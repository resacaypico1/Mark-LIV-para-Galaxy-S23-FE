import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAssistant } from '@/context/AssistantContext';

export default function ActivityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { reminders, toggleReminder, deleteReminder } = useAssistant();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 18 }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>CENTRO DE CONTROL</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Actividad</Text>
        </View>
        <View style={[styles.count, { backgroundColor: colors.secondary }]}><Text style={[styles.countText, { color: colors.primary }]}>{reminders.length}</Text></View>
      </View>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>Tus recordatorios y acciones recientes aparecen aquí.</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        scrollEnabled={reminders.length > 0}
        ListEmptyComponent={<View style={styles.empty}><View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="check-circle" size={24} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Todo despejado</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Dile a Mark LIV “recuérdame…” para crear tu primer pendiente.</Text></View>}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border, opacity: item.completed ? 0.55 : 1 }]}>
            <Pressable onPress={() => toggleReminder(item.id)} style={[styles.check, { borderColor: item.completed ? colors.primary : colors.mutedForeground, backgroundColor: item.completed ? colors.primary : 'transparent' }]}>
              {item.completed && <Feather name="check" size={14} color={colors.primaryForeground} />}
            </Pressable>
            <View style={styles.itemBody}><Text style={[styles.itemTitle, { color: colors.foreground, textDecorationLine: item.completed ? 'line-through' : 'none' }]}>{item.title}</Text><Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{item.completed ? 'Completado' : 'Pendiente'}</Text></View>
            <Pressable accessibilityLabel="Eliminar recordatorio" onPress={() => deleteReminder(item.id)} hitSlop={10}><Feather name="trash-2" size={17} color={colors.mutedForeground} /></Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  title: { fontSize: 30, fontWeight: '700', marginTop: 5 },
  count: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 16, fontWeight: '700' },
  description: { fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 310 },
  list: { paddingTop: 25, gap: 10 },
  item: { minHeight: 76, borderWidth: 1, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: { width: 25, height: 25, borderWidth: 1.5, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  itemMeta: { fontSize: 11, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 100, paddingHorizontal: 24 },
  emptyIcon: { width: 62, height: 62, borderWidth: 1, borderRadius: 31, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 17 },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 8 },
});