import React, { useMemo, useState } from 'react';
import { usePlannerContext } from './PlannerContext';
import type { NotebookMessage } from './PlannerTypes';

function buildMessage(role: NotebookMessage['role'], content: string): NotebookMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: new Date().toISOString()
  };
}

export function NotebookChat() {
  const { messages, setMessages, notebookEnabled, activeTab, plannerMode } = usePlannerContext();
  const [draft, setDraft] = useState('');

  const summary = useMemo(() => {
    return `Context: tab=${activeTab}, mode=${plannerMode}`;
  }, [activeTab, plannerMode]);

  const onSend = () => {
    if (!draft.trim() || !notebookEnabled) return;
    const userMessage = buildMessage('user', draft.trim());
    const notebookResponse = buildMessage(
      'notebook',
      'Noted. Stored in planning notes. (Stub response; no execution or actions.)'
    );
    setMessages([...messages, userMessage, notebookResponse]);
    setDraft('');
  };

  const onReset = () => {
    setMessages([]);
  };

  return (
    <section className="notebook-panel">
      <header>
        <h2>Notebook LLM</h2>
        <p className="notebook-subtitle">
          Advisory-only memory. No execution, no triggers, no side effects.
        </p>
        <p className="notebook-context">{summary}</p>
      </header>

      <div className="notebook-messages">
        {messages.length === 0 && (
          <div className="notebook-empty">
            No messages yet. Use this space to capture planning context.
          </div>
        )}
        {messages.map(message => (
          <div key={message.id} className={`notebook-message ${message.role}`}>
            <div className="notebook-role">{message.role === 'user' ? 'You' : 'Notebook'}</div>
            <div className="notebook-content">{message.content}</div>
            <div className="notebook-meta">{message.timestamp}</div>
          </div>
        ))}
      </div>

      <div className="notebook-input">
        <textarea
          value={draft}
          onChange={event => setDraft(event.target.value)}
          placeholder={notebookEnabled ? 'Share a plan, question, or note.' : 'Notebook LLM disabled.'}
          rows={3}
          disabled={!notebookEnabled}
        />
        <div className="notebook-actions">
          <button type="button" onClick={onSend} disabled={!notebookEnabled || !draft.trim()}>
            Send
          </button>
          <button type="button" className="secondary" onClick={onReset}>
            Reset Chat (explicit)
          </button>
        </div>
      </div>
    </section>
  );
}
