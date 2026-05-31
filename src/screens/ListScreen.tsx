import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Status } from "../types";
import { colors } from "../theme";
import { useTickets } from "../store/TicketContext";
import { useI18n } from "../i18n/I18nContext";
import { computeStats, filterTickets } from "../domain/selectors";
import StatCard from "../components/StatCard";
import TicketCard from "../components/TicketCard";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

const FILTER_KEYS: ("all" | Status)[] = ["all", "open", "in_progress", "resolved", "closed"];

export default function ListScreen({ navigation }: Props) {
  const { tickets, loading, error, online, pending, refresh } = useTickets();
  const { t } = useI18n();
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [query, setQuery] = useState("");

  const stats = useMemo(() => computeStats(tickets), [tickets]);
  const filtered = useMemo(() => filterTickets(tickets, filter, query), [tickets, filter, query]);

  const filterLabel = (k: "all" | Status) => (k === "all" ? t("list.filterAll") : t(`status.${k}`));

  if (loading && tickets.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.centerText}>{t("list.loading")}</Text>
      </View>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retry} onPress={refresh}>
          <Text style={styles.retryText}>{t("list.retry")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent} />}
      >
        {!online && (
          <Text style={styles.offlineBanner}>
            {pending > 0 ? t("list.offlineQueued", { count: pending }) : t("list.offline")}
          </Text>
        )}
        {online && pending > 0 && <Text style={styles.syncBanner}>{t("list.syncing", { count: pending })}</Text>}
        {error && <Text style={styles.errorBanner}>{t("list.errorBanner", { error })}</Text>}

        <View style={styles.stats}>
          <StatCard label={t("stats.open")} value={stats.open} accent="#38bdf8" />
          <StatCard label={t("stats.inProgress")} value={stats.progress} accent="#fbbf24" />
          <StatCard label={t("stats.resolved")} value={stats.resolved} accent="#34d399" />
        </View>

        <View style={styles.search}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("list.search")}
            placeholderTextColor={colors.textFaint}
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {FILTER_KEYS.map((k) => {
            const active = filter === k;
            return (
              <Pressable key={k} onPress={() => setFilter(k)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{filterLabel(k)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {filtered.length === 0 ? (
            <Text style={styles.empty}>{t("list.empty")}</Text>
          ) : (
            filtered.map((tk) => (
              <TicketCard key={tk.id} ticket={tk} onPress={() => navigation.navigate("Detail", { ticketId: tk.id })} />
            ))
          )}
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => navigation.navigate("Create")}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, padding: 24 },
  centerText: { color: colors.textDim, fontSize: 14 },
  errorText: { color: "#fca5a5", fontSize: 15, fontWeight: "600", textAlign: "center" },
  retry: { backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: "#fff", fontWeight: "800" },
  errorBanner: { color: "#fcd34d", backgroundColor: "rgba(245,158,11,0.12)", borderRadius: 10, padding: 10, fontSize: 12, marginBottom: 12 },
  offlineBanner: { color: "#cbd5e1", backgroundColor: "rgba(100,116,139,0.18)", borderRadius: 10, padding: 10, fontSize: 12, fontWeight: "600", marginBottom: 12 },
  syncBanner: { color: "#7dd3fc", backgroundColor: "rgba(14,165,233,0.12)", borderRadius: 10, padding: 10, fontSize: 12, fontWeight: "600", marginBottom: 12 },
  scroll: { padding: 20, paddingBottom: 100 },
  stats: { flexDirection: "row", gap: 8 },
  search: { marginTop: 16, backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12 },
  searchInput: { paddingVertical: 12, fontSize: 14, color: colors.text },
  chips: { gap: 8, paddingTop: 12, paddingBottom: 4 },
  chip: { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 12, fontWeight: "700", color: colors.textDim },
  chipTextActive: { color: "#fff" },
  list: { marginTop: 16 },
  empty: { textAlign: "center", color: colors.textFaint, paddingVertical: 40 },
  fab: {
    position: "absolute", right: 20, bottom: 24, width: 56, height: 56, borderRadius: 18,
    backgroundColor: colors.accent, alignItems: "center", justifyContent: "center",
    shadowColor: colors.accent, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  fabText: { color: "#fff", fontSize: 28, fontWeight: "300", marginTop: -2 },
});
