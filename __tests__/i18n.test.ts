import { tr, en, translate, LANGS } from "../src/i18n/translations";

describe("çeviri bütünlüğü", () => {
  it("EN, TR ile birebir aynı anahtarlara sahip", () => {
    const trKeys = Object.keys(tr).sort();
    const enKeys = Object.keys(en).sort();
    expect(enKeys).toEqual(trKeys);
  });

  it("hiçbir çeviri boş değil", () => {
    for (const lang of LANGS) {
      const table = lang === "tr" ? tr : en;
      for (const [, value] of Object.entries(table)) {
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("translate()", () => {
  it("doğru dilde metin döndürür", () => {
    expect(translate("tr", "login.signin")).toBe("Giriş Yap");
    expect(translate("en", "login.signin")).toBe("Sign In");
  });

  it("{param} yer tutucularını değiştirir", () => {
    expect(translate("tr", "detail.deleteMsg", { id: "TK-9" })).toContain("TK-9");
    expect(translate("en", "list.syncing", { count: 3 })).toBe("Syncing 3 change(s)…");
  });

  it("bilinmeyen anahtarda anahtarın kendisini döndürür (kırılmaz)", () => {
    expect(translate("tr", "yok.boyle.anahtar")).toBe("yok.boyle.anahtar");
  });

  it("durum ve öncelik anahtarları her iki dilde çözülür", () => {
    for (const k of ["status.open", "status.closed", "priority.critical", "priority.low"]) {
      expect(translate("tr", k)).not.toBe(k);
      expect(translate("en", k)).not.toBe(k);
    }
  });
});
