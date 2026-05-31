import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Priority, Status } from "../types";
import { priorityMeta, statusMeta } from "../theme";
import { useI18n } from "../i18n/I18nContext";

type Props =
  | { kind: "priority"; value: Priority }
  | { kind: "status"; value: Status };

export default function Badge(props: Props) {
  const { t } = useI18n();
  const meta =
    props.kind === "priority" ? priorityMeta[props.value] : statusMeta[props.value];
  const label = t(`${props.kind}.${props.value}`);

  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      {props.kind === "priority" && (
        <View style={[styles.dot, { backgroundColor: (meta as any).dot }]} />
      )}
      <Text style={[styles.label, { color: meta.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 11, fontWeight: "700" },
});
