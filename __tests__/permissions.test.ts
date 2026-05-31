import { permissions } from "../src/domain/permissions";

describe("permissions (rol bazlı yetki)", () => {
  it("yalnızca yönetici kapatma/silme yapabilir", () => {
    expect(permissions.canCloseOrDelete("admin")).toBe(true);
    expect(permissions.canCloseOrDelete("agent")).toBe(false);
  });

  it("teknisyen 'closed' durumunu uygulayamaz, diğerlerini uygulayabilir", () => {
    expect(permissions.canSetStatus("agent", "closed")).toBe(false);
    expect(permissions.canSetStatus("agent", "in_progress")).toBe(true);
    expect(permissions.canSetStatus("agent", "resolved")).toBe(true);
  });

  it("yönetici her durumu uygulayabilir", () => {
    expect(permissions.canSetStatus("admin", "closed")).toBe(true);
    expect(permissions.canSetStatus("admin", "open")).toBe(true);
  });

  it("atama, durum değişimi ve oluşturma her role açıktır", () => {
    for (const role of ["admin", "agent"] as const) {
      expect(permissions.canAssign(role)).toBe(true);
      expect(permissions.canChangeStatus(role)).toBe(true);
      expect(permissions.canCreate(role)).toBe(true);
    }
  });
});
