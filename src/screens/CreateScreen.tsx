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
import { NewTicketInput, Priority, RootStackParamList } from "../types";
import { colors, priorityMeta } from "../theme";
import { useTickets } from "../store/TicketContext";
import { useI18n } from "../i18n/I18nContext";
import { slaForPriority } from "../domain/selectors";

type Props = NativeStackScreenProps<RootStackParamList, "Create">;

const PRIORITY_KEYS = Object.keys(priorityMeta) as Priority[];

export default function CreateScreen({ navigation }: Props) {
  const { createTicket } = useTickets();
  const { t } = useI18n();

  const [title, setTitle] = useState("");
  const [requester, setRequester] = useState("");
  const [dept, setDept] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [saving, setSaving] = useState(false);

  const valid = title.trim().length > 0 && requester.trim().length > 0;

  async function submit() {
    if (!valid || saving) return;
    const input: NewTicketInput = {
      title: title.trim(),
      requester: requester.trim(),
      dept: dept.trim() || "Genel",
      desc: desc.trim(),
      priority,
      sla: slaForPriority(priority),
    };
    setSaving(true);
    try {
      await createTicket(input);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert(t("detail.errorTitle"), e?.message ?? t("create.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Field label={t("create.title")}>
        <TextInput value={title} onChangeText={setTitle} placeholder={t("create.titlePlaceholder")} placeholderTextColor={colors.textFaint} style={styles.input} />
      </Field>

      <View style={styles.row}>
        <View style={styles.flex}>
          <Field label={t("create.requester")}>
            <TextInput value={requester} onChangeText={setRequester} placeholder={t("create.requesterPlaceholder")} placeholderTextColor={colors.textFaint} style={styles.input} />
          </Field>
        </View>
        <View style={styles.flex}>
          <Field label={t("create.dept")}>
            <TextInput value={dept} onChangeText={setDept} placeholder={t("create.deptPlaceholder")} placeholderTextColor={colors.textFaint} style={styles.input} />
          </Field>
        </View>
      </View>

      <Field label={t("create.desc")}>
        <TextInput value={desc} onChangeText={setDesc} placeholder={t("create.descPlaceholder")} placeholderTextColor={colors.textFaint} multiline numberOfLines={4} style={[styles.input, styles.textarea]} />
      </Field>

      <Field label={t("create.priority")}>
        <View style={styles.grid4}>
          {PRIORITY_KEYS.map((p) => {
            const active = priority === p;
            return (
              <Pressable key={p} onPress={() => setPriority(p)} style={[styles.gridBtn, active && styles.gridBtnActive]}>
                <Text style={[styles.gridBtnText, active && styles.gridBtnTextActive]}>{t(`priority.${p}`)}</Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Pressable onPress={submit} disabled={!valid || saving} style={[styles.submit, (!valid || saving) && styles.submitDisabled]}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{t("create.submit")}</Text>}
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20 },
  field: { marginBottom: 16 },
  fieldLabel: { marginBottom: 6, fontSize: 11, fontWeight: "800", letterSpacing: 1, color: colors.textFaint },
  input: { backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.text },
  textarea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  flex: { flex: 1 },
  grid4: { flexDirection: "row", gap: 6 },
  gridBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: colors.surface, borderColor: colors.surfaceBorder, borderWidth: 1, alignItems: "center" },
  gridBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  gridBtnText: { fontSize: 11, fontWeight: "700", color: colors.textDim },
  gridBtnTextActive: { color: "#fff" },
  submit: { marginTop: 8, backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
