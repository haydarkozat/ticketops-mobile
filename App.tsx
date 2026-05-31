import React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "./src/theme";
import { I18nProvider } from "./src/i18n/I18nContext";
import { AuthProvider, useAuth } from "./src/store/AuthContext";
import { TicketProvider } from "./src/store/TicketContext";
import RootNavigator from "./src/navigation";
import LoginScreen from "./src/screens/LoginScreen";

// Oturum durumuna göre giriş ekranı veya uygulama gösterilir.
function Gate() {
  const { session, hydrating } = useAuth();

  if (hydrating) {
    return (
      <View style={styles.splash}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>T</Text>
        </View>
        <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (!session) return <LoginScreen />;

  // Girişli: talep verisi sağlayıcısı + navigasyon.
  return (
    <TicketProvider>
      <RootNavigator />
    </TicketProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <I18nProvider>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { color: "#fff", fontSize: 32, fontWeight: "900" },
});
