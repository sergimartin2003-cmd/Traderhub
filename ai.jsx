/* global window */
// ai.jsx — capa de IA real sobre window.claude.complete (+ fallback elegante).

const HAS_AI = typeof window !== 'undefined' && window.claude && typeof window.claude.complete === 'function';

const TONE_DESC = {
  estratega: 'Eres un estratega de negocio analítico y riguroso. Estructuras todo en frameworks, eres cuantitativo y siempre cierras con el siguiente paso.',
  mentor: 'Eres un mentor directo y práctico. Vas al grano y siempre das un siguiente paso concreto y ejecutable.',
  coach: 'Eres un coach cercano y motivador, con energía, pero sin perder el rigor ni la concreción.',
  mezcla: 'Combinas rigor analítico con cercanía: estructuras bien las ideas pero las explicas de forma humana y motivadora.',
};

function buildSystem({ tone, context, profile, brand }) {
  const t = TONE_DESC[tone] || TONE_DESC.estratega;
  let s = `Eres ${brand || 'Norte'}, un copiloto de IA para emprendedores. ${t}\n\n`;
  s += `REGLAS DE RESPUESTA:\n`;
  s += `• Responde SIEMPRE en español.\n`;
  s += `• Desarrolla la respuesta con profundidad pero sin relleno.\n`;
  s += `• Estructura con encabezados markdown ("## Título"), viñetas ("• ") y **negritas** para lo clave.\n`;
  s += `• Cuando compares opciones o muestres datos, usa tablas markdown con "|".\n`;
  s += `• Sé concreto, cuantitativo y accionable. Termina sugiriendo el siguiente paso.\n`;
  if (profile && (profile.business || profile.stage)) {
    s += `\nCONTEXTO DEL USUARIO: negocio = "${profile.business || 'sin definir'}", etapa = "${profile.stage || 'sin definir'}".`;
  }
  if (context) s += `\nTEMA ACTIVO DE LA CONVERSACIÓN: ${context}.`;
  return s;
}

async function aiChat(history, opts = {}) {
  const sys = buildSystem(opts);
  if (!HAS_AI) {
    await wait(700);
    return fallbackChat(history[history.length - 1]?.content || '');
  }
  const msgs = history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
  if (msgs.length && msgs[0].role === 'user') {
    msgs[0] = { ...msgs[0], content: sys + '\n\n— — —\n\n' + msgs[0].content };
  } else {
    msgs.unshift({ role: 'user', content: sys });
  }
  try {
    const text = await window.claude.complete({ messages: msgs });
    return (text || '').trim() || fallbackChat(history[history.length - 1]?.content || '');
  } catch (e) {
    return fallbackChat(history[history.length - 1]?.content || '');
  }
}

// — Genera JSON estructurado para herramientas —
async function aiJSON(instruction, fallback) {
  if (!HAS_AI) { await wait(900); return fallback; }
  const prompt = instruction + `\n\nIMPORTANTE: Responde EXCLUSIVAMENTE con JSON válido, sin texto antes ni después, sin bloques de código markdown. Todo el contenido textual en español.`;
  try {
    const raw = await window.claude.complete(prompt);
    const parsed = parseJSON(raw);
    return parsed || fallback;
  } catch (e) { return fallback; }
}

function parseJSON(raw) {
  if (!raw) return null;
  let s = raw.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  const first = s.indexOf('{'); const last = s.lastIndexOf('}');
  if (first >= 0 && last > first) s = s.slice(first, last + 1);
  try { return JSON.parse(s); } catch (e) { return null; }
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// — Fallback de chat (cuando no hay API) reutiliza el guion —
function fallbackChat(prompt) {
  if (window.generateResponse) {
    const r = window.generateResponse(prompt);
    let out = r.lead.replace(/\*\*/g, '**') + '\n\n';
    r.blocks.forEach(b => { if (b.type === 'text') out += b.value + '\n\n'; });
    return out.trim();
  }
  return 'Vamos a estructurarlo. ## Enfoque\n• Define el objetivo medible.\n• Elige la palanca de mayor impacto.\n• Diseña un experimento para esta semana.';
}

window.AI = { chat: aiChat, json: aiJSON, has: HAS_AI };
