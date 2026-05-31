import NetInfo from "@react-native-community/netinfo";

// Bağlantı durumu için ince bir sarmalayıcı. Test/SSR için kolayca taklit edilir.
export type Unsubscribe = () => void;

export function subscribeConnectivity(onChange: (online: boolean) => void): Unsubscribe {
  const sub = NetInfo.addEventListener((state) => {
    onChange(Boolean(state.isConnected && state.isInternetReachable !== false));
  });
  return sub;
}

export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return Boolean(state.isConnected && state.isInternetReachable !== false);
}
