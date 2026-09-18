import type { MemoryItem, Reminder } from '@/context/AssistantContext';

type Reply = {
  text: string;
  reminderTitle?: string;
  memoryText?: string;
  action?: 'youtube' | 'google';
};

type AssistantContext = {
  assistantName: string;
  userName: string;
  reminders: Reminder[];
  memories: MemoryItem[];
};

export function replyToCommand(rawInput: string, context: AssistantContext): Reply {
  const input = rawInput.trim();
  const normalized = input.toLocaleLowerCase('es');
  const reminderMatch = input.match(/(?:recu[eé]rdame|recordatorio)\s+(?:que\s+)?(.+)/i);
  const memoryMatch = input.match(/(?:recuerda|guarda en tu memoria)\s+(?:que\s+)?(.+)/i);

  if (reminderMatch?.[1]) {
    const title = reminderMatch[1].replace(/[.!?]+$/, '');
    return {
      reminderTitle: title,
      text: `Listo, guardaré este recordatorio: “${title}”. Puedes verlo en Actividad y marcarlo cuando esté hecho.`,
    };
  }

  if (memoryMatch?.[1]) {
    const memory = memoryMatch[1].replace(/[.!?]+$/, '');
    return {
      memoryText: memory,
      text: `Lo guardaré en mi memoria: “${memory}”. Podrás revisarlo o borrarlo desde Memoria.`,
    };
  }

  if (normalized.includes('youtube')) {
    return { action: 'youtube', text: 'Abriendo YouTube. También puedes decirme qué quieres buscar y lo preparo por ti.' };
  }

  if (normalized.includes('google') || normalized.includes('buscar en internet') || normalized.includes('busca ')) {
    return { action: 'google', text: 'Abriré una búsqueda web para que puedas continuar desde el navegador.' };
  }

  if (normalized.includes('qué puedes') || normalized.includes('que puedes') || normalized.includes('ayuda')) {
    return {
      text: 'Puedo conversar contigo, crear recordatorios, guardar datos importantes, abrir YouTube o una búsqueda web, y leer mis respuestas en voz alta. Prueba: “recuérdame llamar a mamá mañana”.',
    };
  }

  if (normalized.includes('qué recuerdas') || normalized.includes('que recuerdas') || normalized.includes('memoria')) {
    const memoryText = context.memories.length
      ? context.memories.slice(0, 3).map((item) => `• ${item.text}`).join('\n')
      : 'Todavía no has guardado nada en mi memoria.';
    return { text: `Esto es lo que tengo guardado:\n${memoryText}` };
  }

  if (normalized.includes('recordatorio') || normalized.includes('tareas pendientes')) {
    const pending = context.reminders.filter((item) => !item.completed);
    return {
      text: pending.length
        ? `Tienes ${pending.length} pendiente${pending.length === 1 ? '' : 's'}:\n${pending.slice(0, 4).map((item) => `• ${item.title}`).join('\n')}`
        : 'No tienes recordatorios pendientes. Tu lista está limpia.',
    };
  }

  if (normalized.includes('hora')) {
    return { text: `Ahora son las ${new Intl.DateTimeFormat('es-UY', { hour: 'numeric', minute: '2-digit' }).format(new Date())}.` };
  }

  if (normalized.includes('hola') || normalized.includes('buenos días') || normalized.includes('buenas')) {
    return { text: `Hola, ${context.userName}. Estoy listo para ayudarte. ¿Qué necesitas hacer?` };
  }

  return {
    text: `Entendido. Estoy procesando “${input}”. En esta versión móvil puedo ayudarte con recordatorios, memoria, búsquedas y acciones rápidas. Di “qué puedes hacer” para ver los comandos disponibles.`,
  };
}