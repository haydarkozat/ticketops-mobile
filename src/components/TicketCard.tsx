import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ticket } from "../types";
import { colors, mono, statusMeta } from "../theme";
import Badge from "./Badge";

interface Props {
  ticket: Ticket;
  onPress: () => void;
}

export default function TicketCard({ ticket, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.bar, { backgroundColor: statusMeta[ticket.status].bar }]} />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={[styles.id, mono]}>#{ticket.id}</Text>
          <Text style={[styles.time, mono]}>{ticket.created}</Text>
        </View>
        <Text style={styles.title}>{ticket.title}</Text>
        <Text style={styles.meta}>
          {ticket.requester} · {ticket.dept}
        </Text>
        <View style={styles.badges}>
          <Badge kind="priority" value={ticket.priority} />
          <Badge kind="status" value={ticket.status} />
          {ticket.assignee !== "Atanmadı" && (
            <Text style={styles.assignee}>→ {ticket.assignee}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
  },
  pressed: { opacity: 0.7 },
  bar: { width: 4 },
  body: { flex: 1, padding: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  id: { fontSize: 11, fontWeight: "700", color: colors.textFaint, letterSpacing: 0.5 },
  time: { fontSize: 10, color: colors.textFaint },
  title: { marginTop: 4, fontSize: 14, fontWeight: "700", color: colors.text },
  meta: { marginTop: 2, fontSize: 11, color: colors.textFaint },
  badges: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8 },
  assignee: { marginLeft: "auto", fontSize: 10, fontWeight: "600", color: colors.textDim },
});
