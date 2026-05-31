import { NewTicketInput, Session, Status, Ticket } from "../types";
import { mockServer } from "./mockServer";

// ============================================================================
// API İSTEMCİSİ
// ----------------------------------------------------------------------------
// Tüm ağ erişimi buradan geçer. Şu an sahte sunucuya (mockServer) bağlı.
// GERÇEK SUNUCUYA GEÇİŞ:
//   1) USE_MOCK = false yap
//   2) BASE_URL'i kendi sunucuna ayarla
//   3) request() içindeki fetch gerçek HTTP çağrısını yapar — başka değişiklik yok
// ============================================================================

const USE_MOCK = true;
const BASE_URL = "https://api.firmaniz.com"; // gerçek backend adresin

let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`İstek başarısız (${res.status})`);
  }
  return (await res.json()) as T;
}

// Gerçek istemci (USE_MOCK=false olduğunda devreye girer).
const httpApi = {
  login: (email: string, password: string) =>
    request<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  listTickets: () => request<Ticket[]>("/tickets"),
  createTicket: (input: NewTicketInput) =>
    request<Ticket>("/tickets", { method: "POST", body: JSON.stringify(input) }),
  setStatus: (id: string, status: Status, _actor: string) =>
    request<Ticket>(`/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  setAssignee: (id: string, assignee: string) =>
    request<Ticket>(`/tickets/${id}/assignee`, {
      method: "PATCH",
      body: JSON.stringify({ assignee }),
    }),
  addComment: (id: string, text: string, _actor: string) =>
    request<Ticket>(`/tickets/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  deleteTicket: (id: string) =>
    request<void>(`/tickets/${id}`, { method: "DELETE" }),
};

// Dışa açılan tek API yüzeyi — store yalnızca bunu tanır.
export const api = USE_MOCK ? mockServer : httpApi;
