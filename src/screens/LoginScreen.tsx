import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, mono } from "../theme";
import { useAuth } from "../store/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import LangToggle from "../components/LangToggle";

export default function LoginScreen() {
  const { login, pending, error } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("admin@firma.com");
  const [password, setPassword] = useState("1234");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.toggleRow}>
        <LangToggle />
      </View>
      <View style={styles.inner}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>T</Text>
        </View>
        <Text style={styles.title}>TicketOps</Text>
        <Text style={styles.subtitle}>{t("login.subtitle")}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{t("login.email")}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
          />
          <Text style={[styles.label, { marginTop: 14 }]}>{t("login.password")}</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textFaint}
            style={styles.input}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            onPress={() => login(email, password)}
            disabled={pending}
            style={[styles.button, pending && styles.buttonDisabled]}
          >
            {pending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t("login.signin")}</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.demo}>
          <Text style={styles.demoTitle}>{t("login.demoTitle")}</Text>
          <Text style={[styles.demoLine, mono]}>admin@firma.com · 1234  ({t("common.role.admin")})</Text>
          <Text style={[styles.demoLine, mono]}>agent@firma.com · 1234  ({t("common.role.agent")})</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  toggleRow: { flexDirection: "row", justifyContent: "flex-end", paddingTop: 52, paddingHorizontal: 20 },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 28, marginTop: -40 },
  logo: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: colors.accent,
    alignItems: "center", justifyContent: "center", alignSelf: "center",
  },
  logoLetter: { color: "#fff", fontSize: 28, fontWeight: "900" },
  title: { textAlign: "center", marginTop: 14, fontSize: 26, fontWeight: "900", color: colors.text },
  subtitle: { textAlign: "center", marginTop: 4, fontSize: 13, color: colors.textFaint },
  form: { marginTop: 32 },
  label: { fontSize: 11, fontWeight: "800", letterSpacing: 1, color: colors.textFaint, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.text,
  },
  error: { color: "#fca5a5", fontSize: 13, marginTop: 12, fontWeight: "600" },
  button: { marginTop: 22, backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  demo: {
    marginTop: 28, padding: 14, borderRadius: 12, backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder, borderWidth: 1,
  },
  demoTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1, color: colors.textFaint, marginBottom: 8 },
  demoLine: { fontSize: 12, color: colors.textDim, marginTop: 2 },
});
