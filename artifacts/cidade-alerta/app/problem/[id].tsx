import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Category, Priority, Status, useProblems } from "@/context/ProblemsContext";
import { useColors } from "@/hooks/useColors";

const STATUS_OPTIONS: { label: string; value: Status; color: string }[] = [
  { label: "Pendente", value: "pendente", color: "#DC2626" },
  { label: "Em andamento", value: "em_andamento", color: "#D97706" },
  { label: "Resolvido", value: "resolvido", color: "#16A34A" },
];

const CATEGORY_LABELS: Record<Category, string> = {
  iluminacao: "Iluminação",
  buraco: "Buraco",
  dengue: "Dengue",
};

const CATEGORY_ICONS: Record<Category, keyof typeof Feather.glyphMap> = {
  iluminacao: "zap",
  buraco: "alert-triangle",
  dengue: "droplet",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export default function ProblemDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProblemById, updateProblem, deleteProblem } = useProblems();

  const problem = getProblemById(id ?? "");

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(problem?.title ?? "");
  const [description, setDescription] = useState(problem?.description ?? "");
  const [address, setAddress] = useState(problem?.address ?? "");
  const [status, setStatus] = useState<Status>(problem?.status ?? "pendente");
  const [saving, setSaving] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!problem) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Ocorrência não encontrada</Text>
        <Pressable onPress={() => router.back()} style={[styles.backPill, { backgroundColor: colors.primary }]}>
          <Text style={styles.backPillText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const catColor =
    problem.category === "iluminacao"
      ? colors.categoryIluminacao
      : problem.category === "buraco"
      ? colors.categoryBuraco
      : colors.categoryDengue;

  const catBg =
    problem.category === "iluminacao"
      ? colors.categoryIluminacaoLight
      : problem.category === "buraco"
      ? colors.categoryBuracoLight
      : colors.categoryDengueLight;

  const priorityColor =
    problem.priority === "alta"
      ? colors.danger
      : problem.priority === "media"
      ? colors.warning
      : colors.mutedForeground;

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Informe o título do problema.");
      return;
    }
    setSaving(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await updateProblem(id!, { title: title.trim(), description: description.trim(), address: address.trim(), status });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir ocorrência",
      "Tem certeza que deseja excluir esta ocorrência?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteProblem(id!);
            router.back();
          },
        },
      ]
    );
  };

  const createdDate = new Date(problem.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: topPad + 12,
          },
        ]}
      >
        <Pressable
          onPress={() => { if (editing) { setEditing(false); } else { router.back(); } }}
          style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Feather name={editing ? "x" : "arrow-left"} size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {editing ? "Editar" : "Detalhes"}
        </Text>
        <View style={styles.headerActions}>
          {editing ? (
            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: colors.primary, opacity: saving || pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.saveBtnText}>{saving ? "..." : "Salvar"}</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => setEditing(true)}
                style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Feather name="edit-2" size={20} color={colors.primary} />
              </Pressable>
              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Feather name="trash-2" size={20} color={colors.destructive} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!editing ? (
          <>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: catBg }]}>
                <Feather name={CATEGORY_ICONS[problem.category]} size={14} color={catColor} />
                <Text style={[styles.badgeText, { color: catColor }]}>{CATEGORY_LABELS[problem.category]}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.muted }]}>
                <View style={[styles.dot, { backgroundColor: priorityColor }]} />
                <Text style={[styles.badgeText, { color: priorityColor }]}>
                  Prioridade {PRIORITY_LABELS[problem.priority]}
                </Text>
              </View>
            </View>

            <Text style={[styles.titleText, { color: colors.foreground }]}>{problem.title}</Text>

            {problem.description ? (
              <Text style={[styles.descText, { color: colors.mutedForeground }]}>{problem.description}</Text>
            ) : null}

            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={16} color={colors.mutedForeground} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>{problem.address}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.infoRow}>
                <Feather name="calendar" size={16} color={colors.mutedForeground} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>Registrado em {createdDate}</Text>
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Status</Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((s) => {
                const sel = problem.status === s.value;
                return (
                  <Pressable
                    key={s.value}
                    onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await updateProblem(id!, { status: s.value });
                    }}
                    style={({ pressed }) => [
                      styles.statusPill,
                      {
                        backgroundColor: sel ? s.color : colors.muted,
                        borderColor: sel ? s.color : colors.border,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.statusPillText, { color: sel ? "#FFF" : colors.mutedForeground }]}>
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.editLabel, { color: colors.foreground }]}>Título *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />

            <Text style={[styles.editLabel, { color: colors.foreground }]}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />

            <Text style={[styles.editLabel, { color: colors.foreground }]}>Endereço *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={address}
              onChangeText={setAddress}
              maxLength={150}
            />

            <Text style={[styles.editLabel, { color: colors.foreground }]}>Status</Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((s) => {
                const sel = status === s.value;
                return (
                  <Pressable
                    key={s.value}
                    onPress={() => setStatus(s.value)}
                    style={({ pressed }) => [
                      styles.statusPill,
                      {
                        backgroundColor: sel ? s.color : colors.muted,
                        borderColor: sel ? s.color : colors.border,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.statusPillText, { color: sel ? "#FFF" : colors.mutedForeground }]}>
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFound: { fontSize: 16, fontFamily: "Inter_400Regular" },
  backPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  backPillText: { color: "#FFF", fontFamily: "Inter_600SemiBold" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  navBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: { padding: 6 },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveBtnText: { color: "#FFF", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  content: { padding: 20, gap: 12 },
  badges: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  dot: { width: 7, height: 7, borderRadius: 4 },
  titleText: { fontSize: 22, fontFamily: "Inter_700Bold", lineHeight: 30 },
  descText: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 4,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14 },
  infoText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  divider: { height: 1 },
  sectionLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 8 },
  statusRow: { flexDirection: "row", gap: 8 },
  statusPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  statusPillText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  editLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  textArea: { height: 100, paddingTop: 12 },
});
