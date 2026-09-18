import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { ChatMessage } from '@/context/AssistantContext';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const colors = useColors();
  const isUser = message.role === 'user';
  return (
    <View style={[styles.row, isUser && styles.userRow]}>
      {!isUser && <View style={[styles.markDot, { borderColor: colors.primary }]}><Feather name="zap" size={12} color={colors.primary} /></View>}
      <View style={[styles.bubble, { backgroundColor: isUser ? colors.secondary : colors.card, borderColor: isUser ? colors.accent : colors.border }]}>
        <Text style={[styles.text, { color: isUser ? colors.secondaryForeground : colors.foreground }]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 9, marginBottom: 12, maxWidth: '100%' },
  userRow: { alignSelf: 'flex-end' },
  markDot: { width: 25, height: 25, borderWidth: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  bubble: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 11, maxWidth: '92%' },
  text: { fontSize: 14, lineHeight: 21, flexShrink: 1 },
});