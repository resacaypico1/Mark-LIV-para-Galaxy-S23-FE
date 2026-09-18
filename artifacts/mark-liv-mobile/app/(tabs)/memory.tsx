import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAssistant } from '@/context/AssistantContext';

export default function MemoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const { memories, addMemory, deleteMemory } = useAssistant();
  const save = () => {
    if (!draft.trim()) return;
    addMemory(draft.trim());
    setDraft('');
  };
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 18 }]}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>MEMORIA LOCAL</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Lo que Mark recuerda</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>Tus notas se guardan en este teléfono y no desaparecen al cerrar la app.</Text>
      <View style={[styles.addBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput value={draft} onChangeText={setDraft} placeholder="Ej. Prefiero respuestas breves" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} multiline />
        <Pressable testID="save-memory" onPress={save} style={({ pressed }) => [styles.addButton, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}><Feather name="plus" size={18} color={colors.primaryForeground} /></Pressable>
      </View>
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        scrollEnabled={memories.length > 0}
        ListEmptyComponent={<View style={styles.empty}><Feather name="bookmark" size={25} color={colors.mutedForeground} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Memoria vacía</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Guarda una preferencia o un dato que quieras tener a mano.</Text></View>}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.bookmark, { backgroundColor: colors.secondary }]}><Feather name="bookmark" size={16} color={colors.primary} /></View>
            <Text style={[styles.itemText, { color: colors.foreground }]}>{item.text}</Text>
            <Pressable onPress={() => deleteMemory(item.id)} hitSlop={10}><Feather name="x" size={18} color={colors.mutedForeground} /></Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 18 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  title: { fontSize: 29, fontWeight: '700', marginTop: 5 },
  description: { fontSize: 14, lineHeight: 21, marginTop: 10 },
  addBox: { minHeight: 90, borderWidth: 1, borderRadius: 18, marginTop: 24, padding: 12, flexDirection: 'row', alignItems: 'flex-end' },
  input: { flex: 1, fontSize: 14, maxHeight: 65, paddingHorizontal: 3, paddingVertical: 4 },
  addButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  list: { paddingTop: 16, gap: 10 },
  item: { minHeight: 66, borderWidth: 1, borderRadius: 17, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11 },
  bookmark: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1, fontSize: 14, lineHeight: 20 },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginTop: 15 },
  emptyText: { fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 7 },
});