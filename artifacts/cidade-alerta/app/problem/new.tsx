import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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

const CATEGORIES: { label: string; value: Category; icon: keyof typeof Feather.glyphMap; desc: string }[] = [
  { label: "Iluminação", value: "iluminacao", icon: "zap", desc: "Poste apagado ou com defeito" },
  { label: "Buraco", value: "buraco", icon: "alert-triangle", desc: "Via com buraco ou cratera" },
  { label: "Dengue", value: "dengue", icon: "droplet", desc: "Foco de água parada ou lixo" },
];

const PRIORITIES: { label: string; value: Priority; color: string; desc: string }[] = [
  { label: "Baixa", value: "baixa", color: "#6B7280", desc: "Sem risco imediato" },
  { label: "Média", value: "media", color: "#D97706", desc: "Requer atenção" },
  { label: "Alta", value: "alta", color: "#DC2626", desc: "Risco à segurança" },
];

export default function NewProblemScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addProblem } = useProblems();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState<Category>("iluminacao");
  const [priority, setPriority] = useState<Priority>("media");
  const [saving, setSaving] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Informe o título do problema.");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Erro", "Informe o endereço.");
      return;
    }
    setSaving(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await addProblem({
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        category,
        priority,
        status: "pendente",
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

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
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Feather name="x" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Nova Ocorrência</Text>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: colors.primary, opacity: saving || pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.saveBtnText}>{saving ? "Salvando..." : "Salvar"}</Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.label, { color: colors.foreground }]}>Categoria *</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => {
            const selected = category === cat.value;
            const catColor =
              cat.value === "iluminacao"
                ? colors.categoryIluminacao
                : cat.value === "buraco"
                ? colors.categoryBuraco
                : colors.categoryDengue;
            const catBg =
              cat.value === "iluminacao"
                ? colors.categoryIluminacaoLight
                : cat.value === "buraco"
                ? colors.categoryBuracoLight
                : colors.categoryDengueLight;
            return (
              <Pressable
                key={cat.value}
                onPress={() => setCategory(cat.value)}
                style={({ pressed }) => [
                  styles.categoryCard,
                  {
                    backgroundColor: selected ? catColor : colors.card,
                    borderColor: selected ? catColor : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={[styles.categoryIconBox, { backgroundColor: selected ? "rgba(255,255,255,0.25)" : catBg }]}>
                  <Feather name={cat.icon} size={20} color={selected ? "#FFF" : catColor} />
                </View>
                <Text style={[styles.categoryLabel, { color: selected ? "#FFF" : colors.foreground }]}>
                  {cat.label}
                </Text>
                <Text style={[styles.categoryDesc, { color: selected ? "rgba(255,255,255,0.75)" : colors.mutedForeground }]}>
                  {cat.desc}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.foreground }]}>Título *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          placeholder="Ex: Poste apagado na esquina"
          placeholderTextColor={colors.mutedForeground}
          value={title}
          onChangeText={setTitle}
          maxLength={80}
        />

        <Text style={[styles.label, { color: colors.foreground }]}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          placeholder="Descreva o problema com mais detalhes..."
          placeholderTextColor={colors.mutedForeground}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />

        <Text style={[styles.label, { color: colors.foreground }]}>Endereço *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          placeholder="Ex: Rua das Flores, 120 - Centro"
          placeholderTextColor={colors.mutedForeground}
          value={address}
          onChangeText={setAddress}
          maxLength={150}
        />

        <Text style={[styles.label, { color: colors.foreground }]}>Prioridade</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => {
            const selected = priority === p.value;
            return (
              <Pressable
                key={p.value}
                onPress={() => setPriority(p.value)}
                style={({ pressed }) => [
                  styles.priorityCard,
                  {
                    backgroundColor: selected ? p.color : colors.card,
                    borderColor: selected ? p.color : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text style={[styles.priorityLabel, { color: selected ? "#FFF" : colors.foreground }]}>
                  {p.label}
                </Text>
                <Text style={[styles.priorityDesc, { color: selected ? "rgba(255,255,255,0.75)" : colors.mutedForeground }]}>
                  {p.desc}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: "#FFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  content: { padding: 20, gap: 8 },
  label: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  categoryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  categoryDesc: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  priorityLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  priorityDesc: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
