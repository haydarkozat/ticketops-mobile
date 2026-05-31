import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { useI18n } from "../i18n/I18nContext";
import { LANGS } from "../i18n/translations";

// TR / EN arasında geçiş yapan küçük segmentli kontrol.
export default function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <View style={styles.wrap}>
      {LANGS.map((l) => {
        const active = lang === l;
        return (
          <Pressable key={l} onPress={() => setLang(l)} style={[styles.seg, active && styles.segActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{l.toUpperCase()}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 999,
    padding: 2,
  },
  seg: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  segActive: { backgroundColor: colors.accent },
  text: { fontSize: 11, fontWeight: "800", color: colors.textDim },
  textActive: { color: "#fff" },
});
