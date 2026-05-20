import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterChip } from "@/components/FilterChip";
import { ProblemCard } from "@/components/ProblemCard";
import { Category, Status, useProblems } from "@/context/ProblemsContext";
import { useColors } from "@/hooks/useColors";

const CATEGORY_FILTERS: { label: string; value: Category | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Iluminação", value: "iluminacao" },
  { label: "Buracos", value: "buraco" },
  { label: "Dengue", value: "dengue" },
];

const STATUS_FILTERS: { label: string; value: Status | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendente", value: "pendente" },
  { label: "Em andamento", value: "em_andamento" },
  { label: "Resolvido", value: "resolvido" },
];

export default function FeedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { problems, loading } = useProblems();
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const catMatch = categoryFilter === "all" || p.category === categoryFilter;
      const statusMatch = statusFilter === "all" || p.status === statusFilter;
      return catMatch && statusMatch;
    });
  }, [problems, categoryFilter, statusFilter]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 60 + insets.bottom;

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
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Cidade Alerta
            </Text>
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              {filtered.length} ocorrência{filtered.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/problem/new");
            }}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="plus" size={22} color="#FFF" />
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={CATEGORY_FILTERS}
          keyExtractor={(i) => i.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <FilterChip
              label={item.label}
              active={categoryFilter === item.value}
              onPress={() => setCategoryFilter(item.value)}
            />
          )}
        />

        <FlatList
          horizontal
          data={STATUS_FILTERS}
          keyExtractor={(i) => i.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <FilterChip
              label={item.label}
              active={statusFilter === item.value}
              onPress={() => setStatusFilter(item.value)}
              color={
                item.value === "resolvido"
                  ? colors.success
                  : item.value === "em_andamento"
                  ? colors.warning
                  : item.value === "pendente"
                  ? colors.danger
                  : undefined
              }
            />
          )}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <ProblemCard problem={item} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: bottomPad + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!filtered.length}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="check-circle" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Nenhuma ocorrência
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Ajuste os filtros ou registre um novo problema.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
