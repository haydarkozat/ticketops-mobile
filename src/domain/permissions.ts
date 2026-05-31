import { Role } from "../types";

// Rol bazlı yetki kuralları — saf (pure) fonksiyonlar, kolayca test edilir.
export const permissions = {
  canCloseOrDelete: (role: Role): boolean => role === "admin",
  canAssign: (_role: Role): boolean => true,
  canChangeStatus: (_role: Role): boolean => true,
  canCreate: (_role: Role): boolean => true,
  // Bir durum değişikliğine bu rolün izni var mı?
  canSetStatus: (role: Role, status: string): boolean =>
    status === "closed" ? role === "admin" : true,
};
