import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipli, JSON tabanlı kalıcı depolama yardımcıları.
// Tüm uygulama kalıcılığı bu modülden geçer (tek erişim noktası).

export const KEYS = {
  session: "@ticketops/session",
  tickets: "@ticketops/tickets",
  queue: "@ticketops/queue",
  lang: "@ticketops/lang",
} as const;

export async function load<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.warn("Storage load hatası:", key, e);
    return null;
  }
}

export async function save<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Storage save hatası:", key, e);
  }
}

export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn("Storage remove hatası:", key, e);
  }
}
