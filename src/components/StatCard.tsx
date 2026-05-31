import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

interface Props {
  label: string;
  value: number;
  accent: string;
}

export default function StatCard({ label, value, accent }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  value: { fontSize: 24, fontWeight: "800" },
  label: { marginTop: 2, fontSize: 11, fontWeight: "500", color: colors.textDim },
});
