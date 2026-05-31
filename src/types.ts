// ============================================================================
// Domain & uygulama tipleri (tek doğruluk kaynağı)
// ============================================================================

export type Priority = "critical" | "high" | "medium" | "low";
export type Status = "open" | "in_progress" | "resolved" | "closed";

export interface LogEntry {
  who: string;
  text: string;
  time: string;
}

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  dept: string;
  priority: Priority;
  status: Status;
  assignee: string;
  created: string;
  desc: string;
  sla: number; // saat
  log: LogEntry[];
}

export type NewTicketInput = Pick<
  Ticket,
  "title" | "requester" | "dept" | "priority" | "desc" | "sla"
>;

// --- Kimlik & roller -------------------------------------------------------

export type Role = "admin" | "agent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Session {
  token: string;
  user: User;
}

// --- Navigasyon (react-navigation tipli param listesi) ---------------------

export type RootStackParamList = {
  List: undefined;
  Detail: { ticketId: string };
  Create: undefined;
};
