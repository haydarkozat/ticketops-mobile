import { Status, Ticket } from "../types";

// Listeleme ve özet hesapları — saf fonksiyonlar (test edilebilir).

export interface TicketStats {
  open: number;
  progress: number;
  resolved: number;
  closed: number;
}

export function computeStats(tickets: Ticket[]): TicketStats {
  return {
    open: tickets.filter((t) => t.status === "open").length,
    progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };
}

export function filterTickets(
  tickets: Ticket[],
  filter: "all" | Status,
  query: string
): Ticket[] {
  const q = query.trim().toLowerCase();
  return tickets.filter((t) => {
    const statusOk = filter === "all" || t.status === filter;
    const queryOk =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.requester.toLowerCase().includes(q);
    return statusOk && queryOk;
  });
}

// Önceliğe göre otomatik SLA (saat).
export function slaForPriority(priority: string): number {
  switch (priority) {
    case "critical":
      return 2;
    case "high":
      return 4;
    default:
      return 24;
  }
}
