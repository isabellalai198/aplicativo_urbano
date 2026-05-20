import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Category, Priority, Problem, Status } from "@/context/ProblemsContext";
import { useColors } from "@/hooks/useColors";

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

const STATUS_LABELS: Record<Status, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  resolvido: "Resolvido",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const colors = useColors();

  const categoryColor =
    problem.category === "iluminacao"
      ? colors.categoryIluminacao
      : problem.category === "buraco"
      ? colors.categoryBuraco
      : colors.categoryDengue;

  const categoryBg =
    problem.category === "iluminacao"
      ? colors.categoryIluminacaoLight
      : problem.category === "buraco"
      ? colors.categoryBuracoLight
      : colors.categoryDengueLight;

  const statusColor =
    problem.status === "resolvido"
      ? colors.success
      : problem.status === "em_andamento"
      ? colors.warning
      : colors.mutedForeground;

  const statusBg =
    problem.status === "resolvido"
      ? colors.successLight
      : problem.status === "em_andamento"
      ? colors.warningLight
      : colors.muted;

  const priorityColor =
    problem.priority === "alta"
      ? colors.danger
      : problem.priority === "media"
      ? colors.warning
      : colors.mutedForeground;

  const daysAgo = Math.floor(
    (Date.now() - new Date(problem.createdAt).getTime()) / 86400000
  );
  const timeLabel =
    daysAgo === 0 ? "Hoje" : daysAgo === 1 ? "Ontem" : `${daysAgo}d atrás`;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/problem/${problem.id}`);
      }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryBg }]}>
          <Feather name={CATEGORY_ICONS[problem.category]} size={12} color={categoryColor} />
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {CATEGORY_LABELS[problem.category]}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {STATUS_LABELS[problem.status]}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
        {problem.title}
      </Text>

      <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
        {problem.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text style={[styles.address, { color: colors.mutedForeground }]} numberOfLines={1}>
            {problem.address}
          </Text>
        </View>
        <View style={styles.footerRight}>
          <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
          <Text style={[styles.priorityText, { color: priorityColor }]}>
            {PRIORITY_LABELS[problem.priority]}
          </Text>
          <Text style={[styles.timeText, { color: colors.mutedForeground }]}> · {timeLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  address: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priorityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  timeText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
