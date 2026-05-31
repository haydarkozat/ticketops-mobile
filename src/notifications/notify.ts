import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// ============================================================================
// BİLDİRİMLER (expo-notifications)
// ----------------------------------------------------------------------------
// İzin ister, kanal kurar ve yerel bildirim gönderir. Yeni/atanan talepte
// kullanıcı uygulamayı kapatmış olsa bile uyarılır.
// ============================================================================

// Uygulama açıkken de bildirim banner'ı göster.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForNotifications(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("tickets", {
      name: "Talep Uyarıları",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  return status === "granted";
}

export async function notifyTicket(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // hemen
  });
}
