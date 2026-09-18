import React, { useMemo, useRef, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Feather } from '@expo/vector-icons';
import { HologramOrb } from '@/components/HologramOrb';
import { MessageBubble } from '@/components/MessageBubble';
import { useAssistant } from '@/context/AssistantContext';
import { replyToCommand } from '@/lib/assistant';
import { useColors } from '@/hooks/useColors';

const quickPrompts = ['Qué puedes hacer', 'Organiza mi día', 'Recuérdame beber agua'];

export default function AssistantScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');
  const {
    messages, assistantName, userName, reminders, memories, isListening, setIsListening,
    addMessage, addReminder, addMemory, hapticsEnabled,
  } = useAssistant();

  const statusText = useMemo(() => isListening ? 'ESCUCHANDO' : 'EN LÍNEA', [isListening]);

  const submit = (value: string) => {
    const text = value.trim();
    if (!text) return;
    setInput('');
    setIsListening(false);
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    Speech.stop();
    addMessage('user', text);
    const reply = replyToCommand(text, { assistantName, userName, reminders, memories });
    if (reply.reminderTitle) addReminder(reply.reminderTitle);
    if (reply.memoryText) addMemory(reply.memoryText);
    if (reply.action === 'youtube') Linking.openURL('https://www.youtube.com').catch(() => undefined);
    if (reply.action === 'google') Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(text)}`).catch(() => undefined);
    addMessage('assistant', reply.text);
    Speech.speak(reply.text, { language: 'es-ES', rate: 0.96, pitch: 1.02 });
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const toggleListening = () => {
    if (hapticsEnabled) Haptics.selectionAsync().catch(() => undefined);
    setIsListening(!isListening);
    if (!isListening) {
      Alert.alert('Entrada de voz', 'Usa el micrófono del teclado Samsung para dictar tu mensaje. Mark LIV leerá la respuesta en voz alta.');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.screen, { backgroundColor: colors.background }]} keyboardVerticalOffset={0}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: Platform.OS === 'web' ? 34 : 18 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>SISTEMA MARK LIV</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>{assistantName}</Text>
          </View>
          <View style={[styles.statusPill, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={[styles.statusDot, { backgroundColor: isListening ? colors.accent : colors.primary }]} />
            <Text style={[styles.status, { color: colors.mutedForeground }]}>{statusText}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <HologramOrb listening={isListening} />
          <Text style={[styles.greeting, { color: colors.foreground }]}>¿En qué estás pensando, {userName}?</Text>
          <Text style={[styles.caption, { color: colors.mutedForeground }]}>Tu asistente personal, ahora en tu Galaxy.</Text>
        </View>

        <View style={[styles.chatPanel, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <View style={styles.panelHeader}>
            <Text style={[styles.panelLabel, { color: colors.mutedForeground }]}>CONVERSACIÓN</Text>
            <Text style={[styles.panelMeta, { color: colors.primary }]}>{messages.length} mensajes</Text>
          </View>
          <View style={styles.messages}>
            {messages.slice(-8).map((message) => <MessageBubble key={message.id} message={message} />)}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            {quickPrompts.map((prompt) => (
              <Pressable key={prompt} onPress={() => submit(prompt)} style={({ pressed }) => [styles.quickChip, { borderColor: colors.border, backgroundColor: colors.muted, opacity: pressed ? 0.7 : 1 }]}>
                <Text style={[styles.quickText, { color: colors.secondaryForeground }]}>{prompt}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={[styles.composer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              testID="assistant-input"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => submit(input)}
              placeholder={isListening ? 'Dicta con el micrófono del teclado…' : 'Escribe una instrucción…'}
              placeholderTextColor={colors.mutedForeground}
              returnKeyType="send"
              style={[styles.input, { color: colors.foreground }]}
              multiline
            />
            <Pressable testID="voice-button" onPress={toggleListening} style={({ pressed }) => [styles.iconButton, { backgroundColor: isListening ? colors.accent : colors.secondary, opacity: pressed ? 0.7 : 1 }]}>
              <Feather name={isListening ? 'mic' : 'mic-off'} size={18} color={isListening ? colors.accentForeground : colors.primary} />
            </Pressable>
            <Pressable testID="send-button" onPress={() => submit(input)} style={({ pressed }) => [styles.sendButton, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}>
              <Feather name="arrow-up" size={19} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontSize: 10, letterSpacing: 2.2, fontWeight: '700' },
  title: { fontSize: 25, fontWeight: '700', letterSpacing: 1.4, marginTop: 3 },
  statusPill: { flexDirection: 'row', gap: 7, alignItems: 'center', borderWidth: 1, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  status: { fontSize: 10, letterSpacing: 1.2, fontWeight: '700' },
  hero: { alignItems: 'center', paddingTop: 9, paddingBottom: 15 },
  greeting: { fontSize: 19, fontWeight: '600', textAlign: 'center', marginTop: -3 },
  caption: { fontSize: 13, marginTop: 6 },
  chatPanel: { borderWidth: 1, borderRadius: 24, padding: 14, minHeight: 360 },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(128, 160, 190, 0.14)' },
  panelLabel: { fontSize: 10, letterSpacing: 1.7, fontWeight: '700' },
  panelMeta: { fontSize: 11, fontWeight: '600' },
  messages: { paddingTop: 14 },
  quickRow: { gap: 8, height: 50, alignItems: 'center' },
  quickChip: { borderWidth: 1, borderRadius: 15, paddingHorizontal: 11, paddingVertical: 8 },
  quickText: { fontSize: 11, fontWeight: '500' },
  composer: { minHeight: 52, borderWidth: 1, borderRadius: 18, flexDirection: 'row', alignItems: 'center', paddingLeft: 13, paddingRight: 6, marginTop: 4 },
  input: { flex: 1, fontSize: 14, maxHeight: 74, paddingTop: 8, paddingBottom: 8 },
  iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 5 },
  sendButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
