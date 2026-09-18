import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type MessageRole = 'assistant' | 'user';

export type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: number;
};

export type Reminder = {
  id: string;
  title: string;
  createdAt: number;
  completed: boolean;
};

export type MemoryItem = {
  id: string;
  text: string;
  createdAt: number;
};

type AssistantState = {
  messages: ChatMessage[];
  reminders: Reminder[];
  memories: MemoryItem[];
  assistantName: string;
  userName: string;
  hapticsEnabled: boolean;
};

type AssistantContextValue = AssistantState & {
  hydrated: boolean;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  addMessage: (role: MessageRole, text: string) => void;
  addReminder: (title: string) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  addMemory: (text: string) => void;
  deleteMemory: (id: string) => void;
  setProfile: (values: Partial<Pick<AssistantState, 'assistantName' | 'userName' | 'hapticsEnabled'>>) => void;
  clearConversation: () => void;
};

const STORAGE_KEY = 'mark-liv-mobile-state-v1';
const greeting: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hola. Soy Mark LIV. Puedo ayudarte a organizar tu día, guardar recuerdos y ejecutar acciones rápidas desde tu teléfono.',
  createdAt: Date.now(),
};

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [assistantName, setAssistantName] = useState('MARK LIV');
  const [userName, setUserName] = useState('Usuario');
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<AssistantState>;
        if (saved.messages?.length) setMessages(saved.messages);
        if (saved.reminders) setReminders(saved.reminders);
        if (saved.memories) setMemories(saved.memories);
        if (saved.assistantName) setAssistantName(saved.assistantName);
        if (saved.userName) setUserName(saved.userName);
        if (typeof saved.hapticsEnabled === 'boolean') setHapticsEnabled(saved.hapticsEnabled);
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: AssistantState = { messages, reminders, memories, assistantName, userName, hapticsEnabled };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [assistantName, hapticsEnabled, hydrated, memories, messages, reminders, userName]);

  const value = useMemo<AssistantContextValue>(() => ({
    messages,
    reminders,
    memories,
    assistantName,
    userName,
    hapticsEnabled,
    hydrated,
    isListening,
    setIsListening,
    addMessage: (role, text) => setMessages((current) => [...current, {
      id: makeId('message'),
      role,
      text,
      createdAt: Date.now(),
    }]),
    addReminder: (title) => setReminders((current) => [{
      id: makeId('reminder'),
      title,
      createdAt: Date.now(),
      completed: false,
    }, ...current]),
    toggleReminder: (id) => setReminders((current) => current.map((item) => item.id === id ? { ...item, completed: !item.completed } : item)),
    deleteReminder: (id) => setReminders((current) => current.filter((item) => item.id !== id)),
    addMemory: (text) => setMemories((current) => [{ id: makeId('memory'), text, createdAt: Date.now() }, ...current]),
    deleteMemory: (id) => setMemories((current) => current.filter((item) => item.id !== id)),
    setProfile: (values) => {
      if (values.assistantName !== undefined) setAssistantName(values.assistantName);
      if (values.userName !== undefined) setUserName(values.userName);
      if (values.hapticsEnabled !== undefined) setHapticsEnabled(values.hapticsEnabled);
    },
    clearConversation: () => setMessages([greeting]),
  }), [assistantName, hapticsEnabled, hydrated, isListening, memories, messages, reminders, userName]);

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) throw new Error('useAssistant must be used inside AssistantProvider');
  return context;
}