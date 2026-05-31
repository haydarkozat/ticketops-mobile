import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { colors } from "../theme";
import { useAuth } from "../store/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import LangToggle from "../components/LangToggle";
import ListScreen from "../screens/ListScreen";
import DetailScreen from "../screens/DetailScreen";
import CreateScreen from "../screens/CreateScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.surfaceBorder,
    primary: colors.accent,
  },
};

function HeaderTitle() {
  const { session } = useAuth();
  const { t } = useI18n();
  const roleLabel = session?.user.role === "admin" ? t("common.role.admin") : t("common.role.agent");
  return (
    <View style={styles.titleWrap}>
      <View style={styles.logo}>
        <Text style={styles.logoLetter}>T</Text>
      </View>
      <View>
        <Text style={styles.brand}>TicketOps</Text>
        <Text style={styles.role}>{session?.user.name} · {roleLabel}</Text>
      </View>
    </View>
  );
}

function ScreenTitle({ tkey }: { tkey: string }) {
  const { t } = useI18n();
  return <Text style={styles.screenTitle}>{t(tkey)}</Text>;
}

function HeaderRight() {
  const { logout } = useAuth();
  const { t } = useI18n();
  return (
    <View style={styles.headerRight}>
      <LangToggle />
      <Pressable onPress={logout} hitSlop={10}>
        <Text style={styles.logout}>{t("nav.logout")}</Text>
      </Pressable>
    </View>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.accent,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen
          name="List"
          component={ListScreen}
          options={{ headerTitle: () => <HeaderTitle />, headerRight: () => <HeaderRight /> }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ headerTitle: () => <ScreenTitle tkey="nav.detailTitle" /> }}
        />
        <Stack.Screen
          name="Create"
          component={CreateScreen}
          options={{ headerTitle: () => <ScreenTitle tkey="nav.createTitle" />, presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  logoLetter: { color: "#fff", fontSize: 15, fontWeight: "900" },
  brand: { color: colors.text, fontSize: 15, fontWeight: "900" },
  role: { color: colors.textFaint, fontSize: 10, fontFamily: "Courier", marginTop: 1 },
  screenTitle: { color: colors.text, fontSize: 17, fontWeight: "800" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  logout: { color: colors.textDim, fontSize: 13, fontWeight: "700" },
});
