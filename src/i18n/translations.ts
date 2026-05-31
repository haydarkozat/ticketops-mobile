// ============================================================================
// ÇEVİRİLER — Türkçe + İngilizce
// ----------------------------------------------------------------------------
// TR sözlüğü kanonik anahtar kümesidir; EN aynı anahtarları içermelidir
// (i18n.test.ts bunu doğrular). translate() saf bir fonksiyondur, test edilir.
// ============================================================================

export type Lang = "tr" | "en";

export const tr = {
  // genel
  "common.role.admin": "Yönetici",
  "common.role.agent": "Teknisyen",
  "common.cancel": "İptal",
  "common.lang": "TR",

  // öncelik
  "priority.critical": "Kritik",
  "priority.high": "Yüksek",
  "priority.medium": "Orta",
  "priority.low": "Düşük",

  // durum
  "status.open": "Açık",
  "status.in_progress": "İşlemde",
  "status.resolved": "Çözüldü",
  "status.closed": "Kapalı",

  // giriş
  "login.subtitle": "Destek Masası Yönetimi",
  "login.email": "E-POSTA",
  "login.password": "PAROLA",
  "login.signin": "Giriş Yap",
  "login.demoTitle": "Rol seçerek giriş yap",
  "login.allPerms": "Tüm yetkiler",
  "login.restricted": "Kısıtlı",
  "login.note": "Teknisyen talepleri kapatamaz veya silemez; yalnızca yönetici yapabilir. Rol farkını detay ekranında gör.",

  // navigasyon / üst çubuk
  "nav.tagline": "destek masası",
  "nav.logout": "Çıkış",
  "nav.detailTitle": "Talep Detayı",
  "nav.createTitle": "Yeni Talep",

  // istatistik kartları
  "stats.open": "Açık talep",
  "stats.inProgress": "İşlemde",
  "stats.resolved": "Çözüldü",

  // liste
  "list.search": "Talep, kişi veya #ID ara…",
  "list.filterAll": "Tümü",
  "list.loading": "Talepler yükleniyor…",
  "list.retry": "Yeniden Dene",
  "list.empty": "Eşleşen talep yok.",
  "list.errorBanner": "{error} — aşağı çekerek yenileyin.",
  "list.offline": "Çevrimdışı",
  "list.offlineQueued": "Çevrimdışı — {count} değişiklik kuyrukta, bağlantı gelince gönderilecek",
  "list.syncing": "{count} değişiklik eşitleniyor…",

  // detay
  "detail.status": "DURUM",
  "detail.assignee": "ATANAN TEKNİSYEN",
  "detail.history": "İŞLEM GEÇMİŞİ",
  "detail.addNote": "Not ekle…",
  "detail.send": "Gönder",
  "detail.slaPrefix": "SLA",
  "detail.slaUnit": "sa",
  "detail.closedAdminOnly": "“Kapalı” durumu yalnızca yöneticiye açıktır.",
  "detail.delete": "Talebi Sil",
  "detail.deleteTitle": "Talebi sil",
  "detail.deleteMsg": "#{id} kalıcı olarak silinsin mi?",
  "detail.deleteConfirm": "Sil",
  "detail.gone": "Bu talep artık mevcut değil.",
  "detail.error": "İşlem başarısız.",
  "detail.errorTitle": "Hata",

  // oluştur
  "create.title": "Başlık *",
  "create.titlePlaceholder": "Sorunu kısaca özetleyin",
  "create.requester": "Talep eden *",
  "create.requesterPlaceholder": "Ad Soyad",
  "create.dept": "Departman",
  "create.deptPlaceholder": "Birim",
  "create.desc": "Açıklama",
  "create.descPlaceholder": "Detayları yazın…",
  "create.priority": "Öncelik",
  "create.submit": "Talebi Oluştur",
  "create.error": "Talep oluşturulamadı.",
} as const;

export type TranslationKey = keyof typeof tr;

export const en: Record<TranslationKey, string> = {
  "common.role.admin": "Admin",
  "common.role.agent": "Agent",
  "common.cancel": "Cancel",
  "common.lang": "EN",

  "priority.critical": "Critical",
  "priority.high": "High",
  "priority.medium": "Medium",
  "priority.low": "Low",

  "status.open": "Open",
  "status.in_progress": "In progress",
  "status.resolved": "Resolved",
  "status.closed": "Closed",

  "login.subtitle": "Help Desk Management",
  "login.email": "EMAIL",
  "login.password": "PASSWORD",
  "login.signin": "Sign In",
  "login.demoTitle": "Sign in by role",
  "login.allPerms": "Full access",
  "login.restricted": "Restricted",
  "login.note": "Agents cannot close or delete tickets; only admins can. See the difference on the detail screen.",

  "nav.tagline": "help desk",
  "nav.logout": "Log out",
  "nav.detailTitle": "Ticket Detail",
  "nav.createTitle": "New Ticket",

  "stats.open": "Open",
  "stats.inProgress": "In progress",
  "stats.resolved": "Resolved",

  "list.search": "Search ticket, person or #ID…",
  "list.filterAll": "All",
  "list.loading": "Loading tickets…",
  "list.retry": "Retry",
  "list.empty": "No matching tickets.",
  "list.errorBanner": "{error} — pull down to refresh.",
  "list.offline": "Offline",
  "list.offlineQueued": "Offline — {count} change(s) queued, will sync when back online",
  "list.syncing": "Syncing {count} change(s)…",

  "detail.status": "STATUS",
  "detail.assignee": "ASSIGNEE",
  "detail.history": "ACTIVITY LOG",
  "detail.addNote": "Add a note…",
  "detail.send": "Send",
  "detail.slaPrefix": "SLA",
  "detail.slaUnit": "h",
  "detail.closedAdminOnly": "“Closed” status is admin-only.",
  "detail.delete": "Delete Ticket",
  "detail.deleteTitle": "Delete ticket",
  "detail.deleteMsg": "Permanently delete #{id}?",
  "detail.deleteConfirm": "Delete",
  "detail.gone": "This ticket no longer exists.",
  "detail.error": "Operation failed.",
  "detail.errorTitle": "Error",

  "create.title": "Title *",
  "create.titlePlaceholder": "Briefly summarize the issue",
  "create.requester": "Requester *",
  "create.requesterPlaceholder": "Full name",
  "create.dept": "Department",
  "create.deptPlaceholder": "Unit",
  "create.desc": "Description",
  "create.descPlaceholder": "Write the details…",
  "create.priority": "Priority",
  "create.submit": "Create Ticket",
  "create.error": "Could not create ticket.",
};

const dictionaries: Record<Lang, Record<TranslationKey, string>> = { tr, en };

/**
 * Saf çeviri fonksiyonu. {param} yer tutucularını değiştirir.
 * Anahtar bulunamazsa anahtarın kendisini döndürür (kırılmaz).
 */
export function translate(
  lang: Lang,
  key: string,
  params?: Record<string, string | number>
): string {
  const table = dictionaries[lang] ?? dictionaries.tr;
  let text: string = (table as Record<string, string>)[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

export const LANGS: Lang[] = ["tr", "en"];
