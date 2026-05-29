/* global React, Icon, Button, Badge, PremiumPill, Avatar, IconButton, RichText, AI */
// chat.jsx — chat con IA real, streaming simulado, adjuntos y persistencia.

function AssistantMark({ size = 30 }) {
  return React.createElement('div', {
    style: { width: size, height: size, borderRadius: 'var(--r-full)', flexShrink: 0, display: 'grid', placeItems: 'center',
      background: 'var(--surface)', border: '1px solid var(--line-2)', boxShadow: 'var(--sh-xs)' },
  },
    React.createElement('svg', { width: size * 0.62, height: size * 0.62, viewBox: '0 0 32 32', fill: 'none' },
      React.createElement('path', { d: 'M16 3.5 19.2 16 16 28.5 12.8 16z', fill: 'var(--accent)' }),
      React.createElement('path', { d: 'M5 16 16 14.2 27 16 16 17.8z', fill: 'var(--accent)', opacity: 0.4 }),
    )
  );
}

function TypingDots() {
  return React.createElement('div', { style: { display: 'flex', gap: 5, padding: '8px 2px' } },
    [0, 1, 2].map(i => React.createElement('span', { key: i,
      style: { width: 7, height: 7, borderRadius: 999, background: 'var(--ink-4)', animation: `blink 1.2s ${i * 0.18}s infinite` } })));
}

function Attachments({ files }) {
  if (!files || !files.length) return null;
  return React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 8, justifyContent: 'flex-end' } },
    files.map((f, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-sm)', fontSize: 12.5, color: 'var(--ink-2)', maxWidth: 220 } },
      React.createElement(Icon, { name: f.kind === 'image' ? 'image' : 'file', size: 14, style: { color: 'var(--ink-4)', flexShrink: 0 } }),
      React.createElement('span', { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, f.name))));
}

function UserMessage({ msg }) {
  return React.createElement('div', { className: 'anim-fade-up', style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: 26 } },
    React.createElement(Attachments, { files: msg.attachments }),
    React.createElement('div', {
      style: { maxWidth: '80%', background: 'var(--ink)', color: '#fff', padding: '12px 17px', borderRadius: '18px 18px 5px 18px',
        fontSize: 15.5, lineHeight: 1.55, letterSpacing: '-0.01em', boxShadow: 'var(--sh-sm)', whiteSpace: 'pre-wrap' },
    }, msg.content),
  );
}

const FOLLOWUPS = ['Profundiza en el punto clave', 'Dame un ejemplo concreto', 'Conviértelo en un plan de acción'];

function AssistantMessage({ msg, brandName, streaming, reveal, onFollowup, isLast }) {
  const content = streaming ? msg.content.slice(0, reveal) : msg.content;
  const done = !streaming;
  return React.createElement('div', { className: 'assistant-msg anim-fade-up', style: { display: 'flex', gap: 13, marginBottom: 30 } },
    React.createElement(AssistantMark, null),
    React.createElement('div', { style: { flex: 1, minWidth: 0, paddingTop: 2 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 } },
        React.createElement('span', { style: { fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' } }, brandName),
        React.createElement(Badge, { tone: 'neutral', size: 'sm' }, 'Estratega'),
      ),
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement(RichText, { value: content }),
        streaming && React.createElement('span', { style: { display: 'inline-block', width: 8, height: 16, background: 'var(--accent)', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink 1s infinite', borderRadius: 2 } }),
      ),
      done && isLast && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 16 } },
        FOLLOWUPS.map((f, i) => React.createElement('button', {
          key: i, className: 'focusable', onClick: () => onFollowup(f),
          onMouseEnter: (e) => { e.currentTarget.style.background = 'var(--accent-tint)'; e.currentTarget.style.borderColor = 'var(--accent-tint-2)'; e.currentTarget.style.color = 'var(--accent-700)'; },
          onMouseLeave: (e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.color = 'var(--ink-2)'; },
          style: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 'var(--r-full)', border: '1px solid var(--line-2)', background: 'var(--surface)', fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)', transition: 'all .16s' },
        }, React.createElement(Icon, { name: 'spark', size: 14 }), f))),
      done && React.createElement('div', { className: 'msg-actions', style: { display: 'flex', gap: 2, marginTop: 12, opacity: 0, transition: 'opacity .2s' } },
        React.createElement(IconButton, { name: 'copy', size: 16, title: 'Copiar', onClick: () => navigator.clipboard && navigator.clipboard.writeText(msg.content) }),
        React.createElement(IconButton, { name: 'refresh', size: 16, title: 'Regenerar' }),
        React.createElement(IconButton, { name: 'thumbUp', size: 16, title: 'Buena respuesta' }),
      ),
    ),
  );
}

const EMPTY_SUGGESTIONS = [
  { icon: 'target', text: 'Valida esta idea de negocio: ' },
  { icon: 'megaphone', text: 'Diseña un plan de marketing de lanzamiento para mi producto' },
  { icon: 'money', text: '¿Cómo pongo precio a mi SaaS B2B?' },
  { icon: 'users', text: 'Ayúdame a analizar a mi competencia' },
];

function EmptyChat({ brandName, onPick, profile }) {
  return React.createElement('div', { style: { maxWidth: 680, margin: '0 auto', padding: '8vh 24px 24px', textAlign: 'center' } },
    React.createElement('div', { style: { display: 'inline-flex', marginBottom: 20 } }, React.createElement(AssistantMark, { size: 56 })),
    React.createElement('h2', { style: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' } }, `¿En qué avanzamos${profile && profile.name ? ', ' + profile.name.split(' ')[0] : ''}?`),
    React.createElement('p', { style: { margin: '8px 0 28px', fontSize: 15.5, color: 'var(--ink-3)' } }, `Pregúntame lo que sea sobre tu negocio. Pienso como un estratega y te doy el siguiente paso.`),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 } },
      EMPTY_SUGGESTIONS.map((s, i) => React.createElement('button', { key: i, className: 'focusable', onClick: () => onPick(s.text),
        onMouseEnter: (e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; },
        onMouseLeave: (e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.transform = 'none'; },
        style: { display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--line-2)', background: 'var(--surface)', textAlign: 'left', fontSize: 14, color: 'var(--ink-2)', transition: 'all .18s var(--ease)', boxShadow: 'var(--sh-xs)' } },
        React.createElement(Icon, { name: s.icon, size: 18, style: { color: 'var(--accent)', flexShrink: 0 } }),
        React.createElement('span', null, s.text.endsWith(': ') ? s.text.slice(0, -2) + '…' : s.text)))));
}

function Chat({ conversation, brandName, isPro, remaining, onConsume, onUpgrade, onAppend, profile, aiTone, initialPrompt }) {
  const [draft, setDraft] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [typing, setTyping] = React.useState(false);
  const [stream, setStream] = React.useState({ id: null, reveal: 0, full: 0 });
  const scrollRef = React.useRef(null);
  const taRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const sentInitial = React.useRef(false);
  const msgs = conversation ? conversation.messages : [];

  const scrollDown = () => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; };
  React.useEffect(scrollDown, [msgs.length, typing, stream.reveal]);

  // streaming driver
  React.useEffect(() => {
    if (stream.id == null) return;
    if (stream.reveal >= stream.full) { const t = setTimeout(() => setStream({ id: null, reveal: 0, full: 0 }), 60); return () => clearTimeout(t); }
    const t = setTimeout(() => setStream(s => ({ ...s, reveal: Math.min(s.full, s.reveal + 5) })), 14);
    return () => clearTimeout(t);
  }, [stream]);

  const send = async (text) => {
    const clean = (text != null ? text : draft).trim();
    if ((!clean && files.length === 0) || typing) return;
    if (!isPro && remaining <= 0) { onUpgrade(); return; }
    if (!isPro) onConsume();

    let prompt = clean;
    const fileNotes = files.filter(f => f.text).map(f => `\n\n[Archivo adjunto "${f.name}"]:\n${f.text.slice(0, 4000)}`).join('');
    const imgNotes = files.filter(f => f.kind === 'image').map(f => `\n\n[El usuario adjuntó una imagen: ${f.name}]`).join('');
    const fullPrompt = prompt + fileNotes + imgNotes;

    const userMsg = { id: 'u' + Date.now(), role: 'user', content: clean || '(archivo adjunto)', attachments: files.map(f => ({ name: f.name, kind: f.kind })) };
    onAppend(userMsg);
    const history = [...msgs.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: fullPrompt }];
    setDraft(''); setFiles([]); if (taRef.current) taRef.current.style.height = 'auto';
    setTyping(true);

    const reply = await AI.chat(history, { tone: aiTone, context: conversation && conversation.context, profile, brand: brandName });
    setTyping(false);
    const aMsg = { id: 'a' + Date.now(), role: 'assistant', content: reply };
    onAppend(aMsg);
    setStream({ id: aMsg.id, reveal: 0, full: reply.length });
  };

  // auto-envía el prompt inicial al montar
  React.useEffect(() => {
    if (initialPrompt && !sentInitial.current) { sentInitial.current = true; send(initialPrompt); }
  }, []);

  const onFiles = async (e) => {
    const list = Array.from(e.target.files || []);
    const read = await Promise.all(list.map(f => new Promise(res => {
      const isImg = f.type.startsWith('image/');
      const isText = f.type.startsWith('text/') || /\.(md|csv|json|txt)$/i.test(f.name);
      if (isText) { const r = new FileReader(); r.onload = () => res({ name: f.name, kind: 'file', text: r.result }); r.readAsText(f); }
      else res({ name: f.name, kind: isImg ? 'image' : 'file' });
    })));
    setFiles(fs => [...fs, ...read]); e.target.value = '';
  };

  const grow = (e) => { setDraft(e.target.value); const el = taRef.current; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 180) + 'px'; };
  const lastAssistantId = [...msgs].reverse().find(m => m.role === 'assistant')?.id;

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' } },
    conversation && conversation.context && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 9, padding: '10px 24px', borderBottom: '1px solid var(--line)', background: 'var(--surface)', fontSize: 13 } },
      React.createElement(Icon, { name: 'pin', size: 15, style: { color: 'var(--accent)' } }),
      React.createElement('span', { style: { color: 'var(--ink-3)' } }, 'Contexto —'),
      React.createElement('span', { style: { fontWeight: 600 } }, conversation.context),
    ),

    React.createElement('div', { ref: scrollRef, style: { flex: 1, overflowY: 'auto' } },
      msgs.length === 0 && !typing
        ? React.createElement(EmptyChat, { brandName, profile, onPick: (t) => { setDraft(t); if (taRef.current) { taRef.current.focus(); } } })
        : React.createElement('div', { style: { maxWidth: 760, margin: '0 auto', padding: '30px 24px 24px' } },
            msgs.map(m => m.role === 'user'
              ? React.createElement(UserMessage, { key: m.id, msg: m })
              : React.createElement(AssistantMessage, { key: m.id, msg: m, brandName, streaming: stream.id === m.id, reveal: stream.reveal, onFollowup: send, isLast: m.id === lastAssistantId && stream.id == null })),
            typing && React.createElement('div', { style: { display: 'flex', gap: 13, marginBottom: 30 } }, React.createElement(AssistantMark, null),
              React.createElement('div', { style: { paddingTop: 4 } }, React.createElement(TypingDots, null))),
          ),
    ),

    React.createElement('div', { style: { padding: '0 24px 18px', background: 'linear-gradient(transparent, var(--canvas) 22%)' } },
      React.createElement('div', { style: { maxWidth: 760, margin: '0 auto' } },
        !isPro && React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 10, fontSize: 12.5, color: remaining <= 2 ? 'var(--danger)' : 'var(--ink-4)' } },
          React.createElement(Icon, { name: 'chat', size: 14 }), `${remaining} mensajes gratis restantes`,
          React.createElement('button', { className: 'focusable', onClick: onUpgrade, style: { fontWeight: 700, color: 'var(--gold)' } }, '· Hazte Pro')),
        React.createElement(Attachments, { files }),
        React.createElement('div', {
          style: { background: 'var(--surface)', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-md)', padding: 10, transition: 'border-color .2s' },
          onFocusCapture: (e) => e.currentTarget.style.borderColor = 'var(--accent)',
          onBlurCapture: (e) => e.currentTarget.style.borderColor = 'var(--line-2)',
        },
          React.createElement('textarea', { ref: taRef, value: draft, onChange: grow, rows: 1,
            onKeyDown: (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } },
            placeholder: 'Escribe tu mensaje…  (Enter para enviar)',
            style: { width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 15.5, lineHeight: 1.5, background: 'transparent', color: 'var(--ink)', padding: '6px 8px', maxHeight: 180, letterSpacing: '-0.01em' } }),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 } },
            React.createElement('input', { ref: fileRef, type: 'file', multiple: true, onChange: onFiles, style: { display: 'none' }, accept: 'image/*,.txt,.md,.csv,.json,.pdf' }),
            React.createElement(IconButton, { name: 'attach', title: 'Adjuntar archivo', size: 19, onClick: () => fileRef.current && fileRef.current.click() }),
            React.createElement(IconButton, { name: 'mic', title: 'Dictar por voz', size: 19 }),
            React.createElement('div', { style: { flex: 1 } }),
            React.createElement(Badge, { tone: 'neutral', size: 'sm', icon: isPro ? 'crown' : 'bolt' }, isPro ? `${brandName} Pro` : `${brandName} Base`),
            React.createElement(Button, { variant: 'primary', icon: 'arrowUp', onClick: () => send(), disabled: typing, style: { width: 40, height: 40, padding: 0, borderRadius: 'var(--r-lg)' } }),
          ),
        ),
        React.createElement('div', { style: { textAlign: 'center', fontSize: 11.5, color: 'var(--ink-4)', marginTop: 10 } }, `${brandName} puede equivocarse. Verifica los datos importantes.`),
      ),
    ),
    React.createElement('style', null, '.assistant-msg:hover .msg-actions { opacity: 1 !important; }'),
  );
}

window.Chat = Chat;
