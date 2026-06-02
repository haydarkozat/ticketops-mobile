# TicketOps v5.0 — Destek Talebi Yönetim Sistemi

![CI](https://github.com/haydarkozat/ticketops/actions/workflows/ci.yml/badge.svg)

**React Native + TypeScript (Expo)** kurumsal destek masası. v5.0 **CI/CD** ekler:

- **CI** (`.github/workflows/ci.yml`) — her push/PR'da otomatik: `npm install` → TypeScript tip kontrolü → 26 birim testi (kapsam raporuyla)
- **CD** (`.github/workflows/release.yml`) — `v*` etiketi atıldığında veya elle tetiklendiğinde **EAS** ile iOS + Android derlemesi (`eas.json` profilleriyle)

## v4.0 — çift dil:

- **i18n** — cihaz dilini otomatik algılar, seçimi kalıcı saklar, anında TR↔EN geçiş (giriş ekranında ve üst çubukta TR/EN düğmesi)
- Tüm arayüz metinleri tek sözlükten gelir (`src/i18n/translations.ts`); bir test EN ve TR anahtarlarının birebir eşleştiğini doğrular

## v3.0 katmanları:

- **Birim testleri (Jest)** — saf iş mantığı için 20 test (3 paket), `npm test` ile çalışır
- **Push/yerel bildirimler (expo-notifications)** — yeni veya atanan talepte uyarı
- **Çevrimdışı senkronizasyon** — bağlantı yokken değişiklikler kuyruğa alınır, optimistik (anında) UI güncellenir, bağlantı gelince sunucuya sırayla gönderilir

Önceki sürümlerden gelen: API katmanı, AsyncStorage kalıcılığı, kimlik doğrulama + roller (Yönetici/Teknisyen), react-navigation.

## Demo hesaplar

| Rol | E-posta | Parola | Yetki |
|-----|---------|--------|-------|
| Yönetici | `admin@firma.com` | `1234` | Her şey (kapatma + silme dahil) |
| Teknisyen | `agent@firma.com` | `1234` | Durum/atama/not; kapatma ve silme yok |

## Çalıştırma

```bash
npm install
npx expo install react-native-screens react-native-safe-area-context \
  @react-native-async-storage/async-storage @react-native-community/netinfo expo-notifications expo-localization
npx expo start          # QR kodu Expo Go ile okut
```

## Testleri çalıştırma

```bash
npm test
```

Test edilen saf modüller:
- `src/domain/permissions.ts` — rol bazlı yetki kuralları
- `src/domain/selectors.ts` — filtreleme, istatistik, SLA hesabı
- `src/sync/queue.ts` — çevrimdışı kuyruk (sıkıştırma/birleştirme, silinen temizleme)
- `src/i18n/translations.ts` — çeviri bütünlüğü (EN=TR anahtarları) + interpolasyon

## CI/CD

**Sürekli entegrasyon (CI):** Depoyu GitHub'a yükledikten sonra her push/PR'da `ci.yml` otomatik çalışır ve şunları doğrular:
```bash
npm run typecheck   # tsc --noEmit
npm test            # jest (26 test)
```
Bunları yerelde de aynı komutlarla çalıştırabilirsin.

**Sürekli dağıtım (CD):** Mobil derleme için Expo Application Services (EAS) kullanılır.
1. GitHub deposunda **Settings → Secrets → Actions** altına `EXPO_TOKEN` ekle (expo.dev hesabından alınır).
2. Bir sürüm etiketi at: `git tag v1.0.0 && git push --tags` → iOS + Android derlemesi başlar.
3. Veya Actions sekmesinden "Release (EAS Build)" iş akışını elle tetikle.

## Mimari

```
App.tsx
src/
├─ types.ts                 # Domain + User/Role + nav param listesi
├─ i18n/                    # ÇİFT DİL
│  ├─ translations.ts       #   TR + EN sözlükleri + saf translate() (test edilir)
│  └─ I18nContext.tsx       #   cihaz algısı, kalıcı tercih, t()
├─ domain/                  # SAF, test edilen iş mantığı
│  ├─ permissions.ts        #   rol yetkileri
│  └─ selectors.ts          #   filtre / istatistik / SLA
├─ sync/                    # ÇEVRİMDIŞI
│  ├─ queue.ts              #   bekleyen mutasyon kuyruğu (saf, test edilir)
│  └─ connectivity.ts       #   NetInfo sarmalayıcı
├─ notifications/notify.ts  # expo-notifications (izin + yerel bildirim)
├─ api/                     # client.ts (tek yüzey) + mockServer.ts (swap edilir)
├─ storage/persist.ts       # AsyncStorage (oturum + talepler + kuyruk)
├─ store/                   # AuthContext + TicketContext (optimistik + kuyruklu)
├─ navigation/index.tsx     # native-stack (tipli)
├─ components/              # Badge, StatCard, TicketCard
└─ screens/                 # Login, List, Detail, Create
__tests__/                  # permissions / selectors / queue testleri
```

## Çevrimdışı akışı nasıl çalışır?

1. Bir değişiklik (durum/atama/not/oluştur/sil) yapılır → **UI anında güncellenir** (optimistik).
2. Çevrimiçiyse sunucuya gönderilir. Çevrimdışıysa veya ağ hatası olursa mutasyon **kuyruğa alınır** ve AsyncStorage'a yazılır.
3. `NetInfo` bağlantı dönüşünü algılar → kuyruk **sıkıştırılır** (aynı talebin ara durumları birleştirilir) ve sunucuya **sırayla** gönderilir.
4. Liste başında "Çevrimdışı — N değişiklik kuyrukta" / "N değişiklik eşitleniyor…" bilgisi gösterilir.

## Gerçek sunucuya geçiş

`src/api/client.ts`: `USE_MOCK = false` + `BASE_URL` → bitti. Push için gerçek sunucu Expo push token'ı kullanır; `notify.ts` yerel bildirimi zaten kurar, uzak bildirim için sunucuya token gönderimi eklenir.

---
React Native 0.74 · Expo SDK 51 · React Navigation 6 · AsyncStorage · NetInfo · expo-notifications · Jest · TypeScript 5.3 (strict) · i18n (TR/EN) · CI/CD (GitHub Actions + EAS) · 26 test geçiyor
