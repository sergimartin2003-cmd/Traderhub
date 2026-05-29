/* global React */
// store.jsx — estado global + persistencia en localStorage.

const STORE_KEY = 'norte:v1';
const FREE_LIMIT = 10;

const DEFAULT_STATE = {
  user: null,            // { name, email, business, stage }
  onboarded: false,
  plan: 'free',          // 'free' | 'pro'
  usage: 0,              // mensajes consumidos
  conversations: [],     // [{ id, title, context, messages:[], createdAt, updatedAt }]
  projects: [],          // [{ id, name, tool, data, createdAt }]
  settings: { accent: 'esmeralda', density: 'regular', brand: 'Norte', aiTone: 'estratega' },
};

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) { return { ...DEFAULT_STATE }; }
}

const StoreCtx = React.createContext(null);

function StoreProvider({ children }) {
  const [state, setState] = React.useState(load);

  React.useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  const patch = (p) => setState(s => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const actions = React.useMemo(() => ({
    signIn(user) { patch({ user }); },
    signOut() { setState(s => ({ ...DEFAULT_STATE, settings: s.settings })); },
    setUser(u) { patch(s => ({ user: { ...s.user, ...u } })); },
    completeOnboarding(profile) { patch(s => ({ onboarded: true, user: { ...s.user, ...profile } })); },
    upgrade() { patch({ plan: 'pro' }); },
    downgrade() { patch({ plan: 'free' }); },
    consume() { patch(s => ({ usage: s.usage + 1 })); },
    resetUsage() { patch({ usage: 0 }); },
    updateSettings(p) { patch(s => ({ settings: { ...s.settings, ...p } })); },

    newConversation(title, context) {
      const id = uid();
      const conv = { id, title: title || 'Nueva conversación', context: context || null, messages: [], createdAt: Date.now(), updatedAt: Date.now() };
      patch(s => ({ conversations: [conv, ...s.conversations] }));
      return id;
    },
    appendMessage(convId, msg) {
      patch(s => ({ conversations: s.conversations.map(c => c.id === convId
        ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() } : c) }));
    },
    setConversationTitle(convId, title) {
      patch(s => ({ conversations: s.conversations.map(c => c.id === convId ? { ...c, title } : c) }));
    },
    deleteConversation(convId) {
      patch(s => ({ conversations: s.conversations.filter(c => c.id !== convId) }));
    },
    addProject(project) {
      const p = { id: uid(), createdAt: Date.now(), ...project };
      patch(s => ({ projects: [p, ...s.projects] }));
      return p.id;
    },
    deleteProject(id) { patch(s => ({ projects: s.projects.filter(p => p.id !== id) })); },
    resetAll() { setState({ ...DEFAULT_STATE }); },
  }), []);

  const value = { state, actions, FREE_LIMIT, remaining: Math.max(0, FREE_LIMIT - state.usage), isPro: state.plan === 'pro' };
  return React.createElement(StoreCtx.Provider, { value }, children);
}

function useStore() {
  const ctx = React.useContext(StoreCtx);
  if (!ctx) throw new Error('useStore fuera de StoreProvider');
  return ctx;
}

Object.assign(window, { StoreProvider, useStore, FREE_LIMIT });
