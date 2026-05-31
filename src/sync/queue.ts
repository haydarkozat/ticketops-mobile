import { NewTicketInput, Status } from "../types";

// ============================================================================
// ÇEVRİMDIŞI MUTASYON KUYRUĞU (saf mantık — test edilebilir)
// ----------------------------------------------------------------------------
// Çevrimdışıyken yapılan değişiklikler sıraya alınır; bağlantı gelince sunucuya
// sırayla gönderilir. UI değişiklikleri anında (iyimser/optimistic) uygular.
// ============================================================================

export type Mutation =
  | { kind: "create"; tempId: string; input: NewTicketInput }
  | { kind: "status"; id: string; status: Status; actor: string }
  | { kind: "assignee"; id: string; assignee: string }
  | { kind: "comment"; id: string; text: string; actor: string }
  | { kind: "delete"; id: string };

export function enqueue(queue: Mutation[], m: Mutation): Mutation[] {
  return [...queue, m];
}

/**
 * Kuyruğu sıkıştırır: aynı talebe ait art arda gelen "status" ve "assignee"
 * mutasyonlarında yalnızca sonuncusu anlamlıdır (ara değerler sunucuya
 * gönderilmesin diye birleştirilir). create / comment / delete korunur.
 */
export function collapse(queue: Mutation[]): Mutation[] {
  const result: Mutation[] = [];
  const lastIndex = new Map<string, number>(); // "status:id" -> result index

  for (const m of queue) {
    if (m.kind === "status" || m.kind === "assignee") {
      const key = `${m.kind}:${m.id}`;
      const prev = lastIndex.get(key);
      if (prev !== undefined) {
        result[prev] = m; // öncekini güncel değerle değiştir
        continue;
      }
      lastIndex.set(key, result.length);
    }
    result.push(m);
  }
  return result;
}

// Bir talep silindiğinde, o talebe ait bekleyen mutasyonların çoğu anlamsızdır.
export function pruneForDeleted(queue: Mutation[], deletedId: string): Mutation[] {
  return queue.filter((m) => {
    if (m.kind === "delete") return true; // silme işleminin kendisi kalır
    const id = "id" in m ? m.id : "tempId" in m ? m.tempId : "";
    return id !== deletedId;
  });
}
