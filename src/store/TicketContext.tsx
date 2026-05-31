import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { NewTicketInput, Status, Ticket } from "../types";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";
import { KEYS, load, save } from "../storage/persist";
import {
  Mutation,
  collapse,
  enqueue,
  pruneForDeleted,
} from "../sync/queue";
import { subscribeConnectivity } from "../sync/connectivity";
import { registerForNotifications, notifyTicket } from "../notifications/notify";

interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  online: boolean;
  pending: number; // kuyruktaki bekleyen değişiklik sayısı
  refresh: () => Promise<void>;
  createTicket: (input: NewTicketInput) => Promise<void>;
  setStatus: (id: string, status: Status) => Promise<void>;
  setAssignee: (id: string, assignee: string) => Promise<void>;
  addComment: (id: string, text: string) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
}

const TicketContext = createContext<TicketStore | null>(null);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const actor = session?.user.name ?? "Sistem";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);
  const queueRef = useRef<Mutation[]>([]);

  const persistQueue = useCallback(async (q: Mutation[]) => {
    queueRef.current = q;
    setPending(q.length);
    await save(KEYS.queue, q);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTickets(await api.listTickets());
    } catch (e: any) {
      setError(e?.message ?? "Talepler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Bekleyen kuyruğu sunucuya gönder (sıralı; ilk hatada durur).
  const flush = useCallback(async () => {
    const ordered = collapse(queueRef.current);
    const remaining = [...ordered];
    for (const m of ordered) {
      try {
        if (m.kind === "create") await api.createTicket(m.input);
        else if (m.kind === "status") await api.setStatus(m.id, m.status, m.actor);
        else if (m.kind === "assignee") await api.setAssignee(m.id, m.assignee);
        else if (m.kind === "comment") await api.addComment(m.id, m.text, m.actor);
        else if (m.kind === "delete") await api.deleteTicket(m.id);
        remaining.shift();
      } catch {
        break; // ağ yine yoksa kalanları koru
      }
    }
    await persistQueue(remaining);
    if (remaining.length === 0) await refresh();
  }, [persistQueue, refresh]);

  // Açılış: kuyruğu yükle, bağlantıyı dinle, bildirim izni iste.
  useEffect(() => {
    (async () => {
      const q = await load<Mutation[]>(KEYS.queue);
      if (q?.length) {
        queueRef.current = q;
        setPending(q.length);
      }
      registerForNotifications().catch(() => {});
    })();
    const unsub = subscribeConnectivity(setOnline);
    return unsub;
  }, []);

  useEffect(() => {
    if (session) refresh();
    else setTickets([]);
  }, [session, refresh]);

  // Bağlantı geri geldiğinde kuyruğu boşalt.
  useEffect(() => {
    if (online && queueRef.current.length > 0) flush();
  }, [online, flush]);

  // Ortak mutasyon: anında iyimser güncelle; çevrimiçiyse gönder, değilse kuyrukla.
  const mutate = useCallback(
    async (optimistic: (prev: Ticket[]) => Ticket[], m: Mutation, remote: () => Promise<void>) => {
      setTickets(optimistic);
      if (online) {
        try {
          await remote();
        } catch {
          await persistQueue(enqueue(queueRef.current, m));
        }
      } else {
        await persistQueue(enqueue(queueRef.current, m));
      }
    },
    [online, persistQueue]
  );

  async function createTicket(input: NewTicketInput) {
    if (online) {
      try {
        const t = await api.createTicket(input);
        setTickets((prev) => [t, ...prev]);
        notifyTicket("Yeni talep oluşturuldu", `#${t.id} · ${t.title}`).catch(() => {});
        return;
      } catch {
        /* çevrimdışı yoluna düş */
      }
    }
    const tempId = `TK-LOCAL-${Date.now()}`;
    const temp: Ticket = {
      id: tempId,
      ...input,
      status: "open",
      assignee: "Atanmadı",
      created: "az önce",
      log: [{ who: "Sistem", text: "Talep oluşturuldu (çevrimdışı)", time: "az önce" }],
    };
    setTickets((prev) => [temp, ...prev]);
    await persistQueue(enqueue(queueRef.current, { kind: "create", tempId, input }));
    notifyTicket("Talep kuyruğa alındı", `${input.title} — bağlantı gelince gönderilecek`).catch(() => {});
  }

  async function setStatus(id: string, status: Status) {
    const m: Mutation = { kind: "status", id, status, actor };
    await mutate(
      (prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status, log: [...t.log, { who: actor, text: `Durum: ${status}`, time: "az önce" }] }
            : t
        ),
      m,
      () => api.setStatus(id, status, actor).then(() => undefined)
    );
  }

  async function setAssignee(id: string, assignee: string) {
    const m: Mutation = { kind: "assignee", id, assignee };
    await mutate(
      (prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, assignee, log: [...t.log, { who: "Sistem", text: `${assignee} atandı`, time: "az önce" }] }
            : t
        ),
      m,
      () => api.setAssignee(id, assignee).then(() => undefined)
    );
    if (assignee !== "Atanmadı") {
      notifyTicket("Talep atandı", `#${id} → ${assignee}`).catch(() => {});
    }
  }

  async function addComment(id: string, text: string) {
    const m: Mutation = { kind: "comment", id, text, actor };
    await mutate(
      (prev) =>
        prev.map((t) => (t.id === id ? { ...t, log: [...t.log, { who: actor, text, time: "az önce" }] } : t)),
      m,
      () => api.addComment(id, text, actor).then(() => undefined)
    );
  }

  async function deleteTicket(id: string) {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    // Silinen talebe ait bekleyen mutasyonları temizle, sonra silmeyi ekle/uygula.
    const cleaned = pruneForDeleted(queueRef.current, id);
    if (online) {
      try {
        await api.deleteTicket(id);
        await persistQueue(cleaned);
        return;
      } catch {
        /* kuyrukla */
      }
    }
    await persistQueue(enqueue(cleaned, { kind: "delete", id }));
  }

  return (
    <TicketContext.Provider
      value={{
        tickets,
        loading,
        error,
        online,
        pending,
        refresh,
        createTicket,
        setStatus,
        setAssignee,
        addComment,
        deleteTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets(): TicketStore {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets, TicketProvider içinde kullanılmalıdır.");
  return ctx;
}
