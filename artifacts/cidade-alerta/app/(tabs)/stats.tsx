import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProblems } from "@/context/ProblemsContext";
import { useColors } from "@/hooks/useColors";

interface StatRowProps {
  label: string;
  count: number;
  total: number;
  color: string;
  bg: string;
  icon: keyof typeof Feather.glyphMap;
}

function StatRow({ label, count, total, color, bg, icon }: StatRowProps) {
  const colors = useColors();
  const pct = total > 0 ? count / total : 0;

  return (
    <View style={[styles.statRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <View style={styles.statInfo}>
        <View style={styles.statHeader}>
          <Text style={[styles.statLabel, { color: colors.foreground }]}>{label}</Text>
          <Text style={[styles.statCount, { color: color }]}>{count}</Text>
        </View>
        <View style={[styles.barBg, { backgroundColor: colors.muted }]}>
          <View style={[styles.barFill, { width: `${Math.round(pct * 100)}%`, backgroundColor: color }]} />
        </View>
        <Text style={[styles.statPct, { color: colors.mutedForeground }]}>
          {Math.round(pct * 100)}% do total
        </Text>
      </View>
    </View>
  );
}

interface SummaryCardProps {
  label: string;
  count: number;
  color: string;
  icon: keyof typeof Feather.glyphMap;
}

function SummaryCard({ label, count, color, icon }: SummaryCardProps) {
  const colors = useColors();
  return (
    <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Feather name={icon} size={20} color={color} />
      <Text style={[styles.summaryCount, { color: colors.foreground }]}>{count}</Text>
      <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { problems } = useProblems();

  const stats = useMemo(() => {
    const total = problems.length;
    const byCategory = {
      iluminacao: problems.filter((p) => p.category === "iluminacao").length,
      buraco: problems.filter((p) => p.category === "buraco").length,
      dengue: problems.filter((p) => p.category === "dengue").length,
    };
    const byStatus = {
      pendente: problems.filter((p) => p.status === "pendente").length,
      em_andamento: problems.filter((p) => p.status === "em_andamento").length,
      resolvido: problems.filter((p) => p.status === "resolvido").length,
    };
    const byPriority = {
      alta: problems.filter((p) => p.priority === "alta").length,
      media: problems.filter((p) => p.priority === "media").length,
      baixa: problems.filter((p) => p.priority === "baixa").length,
    };
    return { total, byCategory, byStatus, byPriority };
  }, [problems]);

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Estatísticas</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Visão geral das ocorrências
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          <SummaryCard label="Total" count={stats.total} color={colors.primary} icon="activity" />
          <SummaryCard label="Pendentes" count={stats.byStatus.pendente} color={colors.danger} icon="clock" />
          <SummaryCard label="Resolvidos" count={stats.byStatus.resolvido} color={colors.success} icon="check-circle" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Por categoria</Text>
        <StatRow
          label="Iluminação"
          count={stats.byCategory.iluminacao}
          total={stats.total}
          color={colors.categoryIluminacao}
          bg={colors.categoryIluminacaoLight}
          icon="zap"
        />
        <StatRow
          label="Buracos"
          count={stats.byCategory.buraco}
          total={stats.total}
          color={colors.categoryBuraco}
          bg={colors.categoryBuracoLight}
          icon="alert-triangle"
        />
        <StatRow
          label="Dengue"
          count={stats.byCategory.dengue}
          total={stats.total}
          color={colors.categoryDengue}
          bg={colors.categoryDengueLight}
          icon="droplet"
        />

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Por status</Text>
        <StatRow
          label="Pendente"
          count={stats.byStatus.pendente}
          total={stats.total}
          color={colors.danger}
          bg={colors.dangerLight}
          icon="clock"
        />
        <StatRow
          label="Em andamento"
          count={stats.byStatus.em_andamento}
          total={stats.total}
          color={colors.warning}
          bg={colors.warningLight}
          icon="loader"
        />
        <StatRow
          label="Resolvido"
          count={stats.byStatus.resolvido}
          total={stats.total}
          color={colors.success}
          bg={colors.successLight}
          icon="check-circle"
        />

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Por prioridade</Text>
        <StatRow
          label="Alta"
          count={stats.byPriority.alta}
          total={stats.total}
          color={colors.danger}
          bg={colors.dangerLight}
          icon="arrow-up"
        />
        <StatRow
          label="Média"
          count={stats.byPriority.media}
          total={stats.total}
          color={colors.warning}
          bg={colors.warningLight}
          icon="minus"
        />
        <StatRow
          label="Baixa"
          count={stats.byPriority.baixa}
          total={stats.total}
          color={colors.success}
          bg={colors.successLight}
          icon="arrow-down"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  content: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  summaryCount: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
    marginTop: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 14,
    marginBottom: 10,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: { flex: 1, gap: 5 },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  statCount: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  barBg: {
    height: 6,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: 4,
  },
  statPct: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
