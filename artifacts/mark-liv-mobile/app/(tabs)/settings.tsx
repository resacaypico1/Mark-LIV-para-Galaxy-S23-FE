import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAssistant } from '@/context/AssistantContext';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { assistantName, userName, hapticsEnabled, setProfile, clearConversation } = useAssistant();
  const [assistantDraft, setAssistantDraft] = useState(assistantName);
  const [userDraft, setUserDraft] = useState(userName);
  const save = () => setProfile({ assistantName: assistantDraft.trim() || 'MARK LIV', userName: userDraft.trim() || 'Usuario' });
  const clear = () => Alert.alert('Borrar conversación', 'Se eliminarán los mensajes guardados en este teléfono.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Borrar', style: 'destructive', onPress: clearConversation }]);
  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 100 }}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>CONFIGURACIÓN</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Personaliza tu asistente</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>Mark LIV se adapta a la forma en que quieres usarlo.</Text>
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Perfil de voz</Text>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Nombre del asistente</Text>
        <TextInput value={assistantDraft} onChangeText={setAssistantDraft} onBlur={save} autoCapitalize="characters" style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} />
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Cómo te llamo</Text>
        <TextInput value={userDraft} onChangeText={setUserDraft} onBlur={save} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} />
      </View>
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: colors.foreground }]}>Respuesta háptica</Text><Text style={[styles.rowText, { color: colors.mutedForeground }]}>Vibración sutil al enviar comandos</Text></View><Switch value={hapticsEnabled} onValueChange={(value) => setProfile({ hapticsEnabled: value })} trackColor={{ false: colors.muted, true: colors.secondary }} thumbColor={hapticsEnabled ? colors.primary : colors.mutedForeground} /></View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Pressable onPress={clear} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.65 : 1 }]}><View style={[styles.dangerIcon, { backgroundColor: colors.secondary }]}><Feather name="trash-2" size={17} color={colors.destructive} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: colors.destructive }]}>Borrar conversación</Text><Text style={[styles.rowText, { color: colors.mutedForeground }]}>Elimina solo el historial de chat local</Text></View><Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>
      </View>
      <View style={styles.footer}><View style={[styles.footerDot, { backgroundColor: colors.primary }]} /><Text style={[styles.footerText, { color: colors.mutedForeground }]}>Mark LIV Mobile · versión 1.0</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 18 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  title: { fontSize: 29, fontWeight: '700', marginTop: 5 },
  description: { fontSize: 14, lineHeight: 21, marginTop: 10 },
  section: { borderWidth: 1, borderRadius: 20, padding: 15, marginTop: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 15 },
  label: { fontSize: 11, marginBottom: 7, marginTop: 4 },
  input: { borderWidth: 1, borderRadius: 12, minHeight: 44, paddingHorizontal: 12, fontSize: 14, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  rowCopy: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '600' },
  rowText: { fontSize: 11, lineHeight: 17, marginTop: 3 },
  divider: { height: 1, marginVertical: 12 },
  dangerIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 28 },
  footerDot: { width: 5, height: 5, borderRadius: 3 },
  footerText: { fontSize: 11 },
});