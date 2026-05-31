import { NewTicketInput, Session, Status, Ticket, User } from "../types";
import { SEED_TICKETS } from "../data/seed";
import { KEYS, load, save } from "../storage/persist";

// ============================================================================
// SAHTE SUNUCU (mock backend)
// ----------------------------------------------------------------------------
// Gerçek bir REST API'yi taklit eder: ağ gecikmesi, olası hata, kalıcı veri.
// Üretimde bu dosyayı silip api/client.ts içindeki BASE_URL'i gerçek sunucuya
// yönlendirmek yeterlidir; ekranlar ve store hiç değişmez.
// ============================================================================

const LATENCY = 600; // ms — ağ gecikmesi taklidi
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Demo kullanıcılar (gerçekte sunucudaki kullanıcı tablosu).
const USERS: Array<User & { password: string }> = [
  { id: "u1", name: "Yönetici Admin", email: "admin@firma.com", password: "1234", role: "admin" },
  { id: "u2", name: "E. Yılmaz", email: "agent@firma.com", password: "1234", role: "agent" },
];

// Bellekteki veri; ilk açılışta AsyncStorage'dan yüklenir, yoksa SEED kullanılır.
let db: Ticket[] | null = null;

async function getDb(): Promise<Ticket[]> {
  if (db) return db;
  const persisted = await load<Ticket[]>(KEYS.tickets);
  db = persisted ?? [...SEED_TICKETS];
  return db;
}

async function commit(): Promise<void> {
  if (db) await save(KEYS.tickets, db);
}

let counter = 1043;

export const mockServer = {
  async login(email: string, password: string): Promise<Session> {
    await delay(LATENCY);
    const match = USERS.find((u) => u.email === email.trim() && u.password === password);
    if (!match) throw new Error("E-posta veya parola hatalı.");
    const { password: _pw, ...user } = match;
    return { token: `demo-token-${match.id}-${Date.now()}`, user };
  },

  async listTickets(): Promise<Ticket[]> {
    await delay(LATENCY);
    // Gerçekçilik için %8 ihtimalle ağ hatası taklidi (retry akışını test etmek için):
    if (Math.random() < 0.08) throw new Error("Sunucuya ulaşılamıyor.");
    return [...(await getDb())];
  },

  async createTicket(input: NewTicketInput): Promise<Ticket> {
    await delay(LATENCY);
    const data = await getDb();
    const ticket: Ticket = {
      id: `TK-${counter++}`,
      ...input,
      status: "open",
      assignee: "Atanmadı",
      created: "az önce",
      log: [{ who: "Sistem", text: "Talep oluşturuldu", time: "az önce" }],
    };
    data.unshift(ticket);
    await commit();
    return ticket;
  },

  async updateTicket(id: string, patch: Partial<Ticket>): Promise<Ticket> {
    await delay(LATENCY / 2);
    const data = await getDb();
    const idx = data.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Talep bulunamadı.");
    data[idx] = { ...data[idx], ...patch };
    await commit();
    return data[idx];
  },

  async setStatus(id: string, status: Status, actor: string): Promise<Ticket> {
    const t = await this.getById(id);
    return this.updateTicket(id, {
      status,
      log: [...t.log, { who: actor, text: `Durum: ${status}`, time: "az önce" }],
    });
  },

  async setAssignee(id: string, assignee: string): Promise<Ticket> {
    const t = await this.getById(id);
    return this.updateTicket(id, {
      assignee,
      log: [...t.log, { who: "Sistem", text: `${assignee} atandı`, time: "az önce" }],
    });
  },

  async addComment(id: string, text: string, actor: string): Promise<Ticket> {
    const t = await this.getById(id);
    return this.updateTicket(id, {
      log: [...t.log, { who: actor, text, time: "az önce" }],
    });
  },

  async deleteTicket(id: string): Promise<void> {
    await delay(LATENCY / 2);
    const data = await getDb();
    db = data.filter((t) => t.id !== id);
    await commit();
  },

  async getById(id: string): Promise<Ticket> {
    const data = await getDb();
    const t = data.find((x) => x.id === id);
    if (!t) throw new Error("Talep bulunamadı.");
    return t;
  },
};
