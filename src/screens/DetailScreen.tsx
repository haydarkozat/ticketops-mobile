import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Status } from "../types";
import { AGENTS, colors, mono, statusMeta } from "../theme";
import { useTickets } from "../store/TicketContext";
import { useAuth } from "../store/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { permissions } from "../domain/permissions";
import Badge from "../components/Badge";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

const STATUS_KEYS = Object.keys(statusMeta) as Status[];

export default function DetailScreen({ route, navigation }: Props) {
  const { ticketId } = route.params;
  const { tickets, setStatus, setAssignee, addComment, deleteTicket } = useTickets();
  const { session } = useAuth();
  const { t } = useI18n();
  const role = session!.user.role;

  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const ticket = tickets.find((x) => x.id === ticketId);
  if (!ticket) {
    return (
      <View style={styles.center}>
        <Text style={styles.gone}>{t("detail.gone")}</Text>
      </View>
    );
  }
  const tk = ticket;

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } catch (e: any) {
      Alert.alert(t("detail.errorTitle"), e?.message ?? t("detail.error"));
    } finally {
      setBusy(false);
    }
  }

  function confirmDelete() {
    Alert.alert(t("detail.deleteTitle"), t("detail.deleteMsg", { id: tk.id }), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("detail.deleteConfirm"),
        style: "destructive",
        onPress: () => run(async () => {
          await deleteTicket(tk.id);
          navigation.goBack();
        }),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {busy && (
        <View style={styles.busyBar}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[styles.id, mono]}>#{tk.id}</Text>
        <Text style={styles.title}>{tk.title}</Text>
        <Text style={styles.meta}>{tk.requester} · {tk.dept} · {tk.created}</Text>

        <View style={styles.badgeRow}>
          <Badge kind="priority" value={tk.priority} />
          <Text style={[styles.sla, mono]}>{t("detail.slaPrefix")}: {tk.sla}{t("detail.slaUnit")}</Text>
        </View>

        <Text style={styles.desc}>{tk.desc}</Text>

        <Text style={styles.sectionLabel}>{t("detail.status")}</Text>
        <View style={styles.grid4}>
          {STATUS_KEYS.map((s) => {
            const active = tk.status === s;
            const allowed = permissions.canSetStatus(role, s);
            return (
              <Pressable
                key={s}
                disabled={!allowed || busy}
                onPress={() => run(() => setStatus(tk.id, s))}
                style={[styles.gridBtn, active && styles.gridBtnActive, !allowed && styles.gridBtnLocked]}
              >
                <Text style={[styles.gridBtnText, active && styles.gridBtnTextActive]}>{t(`status.${s}`)}</Text>
              </Pressable>
            );
          })}
        </View>
        {!permissions.canCloseOrDelete(role) && <Text style={styles.hint}>{t("detail.closedAdminOnly")}</Text>}

        <Text style={styles.sectionLabel}>{t("detail.assignee")}</Text>
        <View style={styles.wrapRow}>
          {AGENTS.map((a) => {
            const active = tk.assignee === a;
            return (
              <Pressable key={a} disabled={busy} onPress={() => run(() => setAssignee(tk.id, a))} style={[styles.pill, active && styles.pillActive]}>
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{a}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>{t("detail.history")}</Text>
        <View style={styles.timeline}>
          {tk.log.map((l, i) => (
            <View key={i} style={styles.logItem}>
              <View style={styles.logDot} />
              <View>
                <Text style={styles.logText}>{l.text}</Text>
                <Text style={[styles.logMeta, mono]}>{l.who} · {l.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.commentBox}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            onSubmitEditing={() => { if (comment.trim()) run(async () => { await addComment(tk.id, comment.trim()); setComment(""); }); }}
            placeholder={t("detail.addNote")}
            placeholderTextColor={colors.textFaint}
            style={styles.commentInput}
          />
          <Pressable disabled={busy} onPress={() => { if (comment.trim()) run(async () => { await addComment(tk.id, comment.trim()); setComment(""); }); }} style={styles.sendBtn}>
            <Text style={styles.sendText}>{t("detail.send")}</Text>
          </Pressable>
        </View>

        {permissions.canCloseOrDelete(role) && (
          <Pressable style={styles.deleteBtn} disabled={busy} onPress={confirmDelete}>
            <Text style={styles.deleteText}>{t("detail.delete")}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  gone: { color: colors.textDim },
  busyBar: { paddingVertical: 6, alignItems: "center", backgroundColor: "rgba(14,165,233,0.08)" },
  scroll: { padding: 20, paddingBottom: 40 },
  id: { color: colors.textFaint, fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  title: { marginTop: 4, fontSize: 18, fontWeight: "800", color: colors.text, lineHeight: 24 },
  meta: { marginTop: 4, fontSize: 12, color: colors.textFaint },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  sla: { backgroundColor: colors.surface, color: colors.textDim, fontSize: 11, fontWeight: "700", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: "hidden" },
  desc: { marginTop: 16, backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 13, lineHeight: 20, color: colors.textDim },
  sectionLabel: { marginTop: 22, marginBottom: 8, fontSize: 11, fontWeight: "800", letterSpacing: 1, color: colors.textFaint },
  hint: { marginTop: 8, fontSize: 11, color: colors.textFaint, fontStyle: "italic" },
  grid4: { flexDirection: "row", gap: 6 },
  gridBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1, alignItems: "center" },
  gridBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  gridBtnLocked: { opacity: 0.35 },
  gridBtnText: { fontSize: 11, fontWeight: "700", color: colors.textDim },
  gridBtnTextActive: { color: "#fff" },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1 },
  pillActive: { backgroundColor: "rgba(16,185,129,0.2)", borderColor: "rgba(16,185,129,0.4)" },
  pillText: { fontSize: 12, fontWeight: "700", color: colors.textDim },
  pillTextActive: { color: "#6ee7b7" },
  timeline: { borderLeftColor: "rgba(255,255,255,0.1)", borderLeftWidth: 1, paddingLeft: 16, gap: 14 },
  logItem: { flexDirection: "row" },
  logDot: { position: "absolute", left: -21, top: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  logText: { fontSize: 13, color: colors.text },
  logMeta: { fontSize: 10, color: colors.textFaint, marginTop: 1 },
  commentBox: { marginTop: 16, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  commentInput: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 6 },
  sendBtn: { backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  sendText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  deleteBtn: { marginTop: 28, borderColor: "rgba(239,68,68,0.4)", borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  deleteText: { color: "#fca5a5", fontSize: 14, fontWeight: "800" },
});
