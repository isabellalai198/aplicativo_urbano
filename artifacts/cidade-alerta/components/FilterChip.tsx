import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { useColors } from "@/hooks/useColors";

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}

export function FilterChip({ label, active, onPress, color }: FilterChipProps) {
  const colors = useColors();
  const activeColor = color ?? colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? activeColor : colors.muted,
          borderColor: active ? activeColor : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: active ? "#FFF" : colors.mutedForeground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
