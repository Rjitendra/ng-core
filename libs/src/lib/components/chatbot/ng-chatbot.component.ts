import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/ng-button.component';
import { IconComponent, IconTone } from '../icon/ng-icon.component';

export type NgChatbotRole = 'assistant' | 'user' | 'system';
export type NgChatbotStatus = 'online' | 'thinking' | 'offline';

export interface NgChatbotMessage {
  id: string;
  role: NgChatbotRole;
  author?: string;
  content: string;
  timestamp?: string;
  tone?: IconTone;
}

export interface NgChatbotQuickAction {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}

@Component({
  selector: 'ng-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  template: `
    <section class="ng-chatbot" [class.ng-chatbot--compact]="density() === 'compact'">
      <header class="ng-chatbot__header">
        <div class="ng-chatbot__brand">
          <div class="ng-chatbot__avatar">
            <ng-icon [name]="avatarIcon()" tone="light"></ng-icon>
          </div>
          <div class="ng-chatbot__heading">
            <p>{{ eyebrow() }}</p>
            <h3>{{ title() }}</h3>
            <span class="ng-chatbot__status" [class]="'ng-chatbot__status--' + status()">
              <span class="ng-chatbot__status-dot"></span>
              {{ statusLabel() }}
            </span>
          </div>
        </div>
        <ng-button
          type="outlined"
          label="Reset"
          icon="refresh"
          (buttonClick)="resetRequested.emit()"
        ></ng-button>
      </header>

      @if (supportingText()) {
        <p class="ng-chatbot__supporting">{{ supportingText() }}</p>
      }

      <div class="ng-chatbot__conversation">
        @for (message of messages(); track message.id) {
          <article class="ng-chatbot__message" [class]="'ng-chatbot__message--' + message.role">
            @if (message.role !== 'user') {
              <div class="ng-chatbot__message-icon">
                <ng-icon
                  [name]="message.role === 'assistant' ? 'smart_toy' : 'policy'"
                  [tone]="message.tone ?? 'primary'"
                ></ng-icon>
              </div>
            }
            <div class="ng-chatbot__bubble">
              <div class="ng-chatbot__meta">
                <strong>{{ message.author || defaultAuthor(message.role) }}</strong>
                @if (message.timestamp) {
                  <small>{{ message.timestamp }}</small>
                }
              </div>
              <p>{{ message.content }}</p>
            </div>
          </article>
        }
      </div>

      @if (quickActions().length) {
        <div class="ng-chatbot__actions">
          @for (action of quickActions(); track action.id) {
            <button
              type="button"
              class="ng-chatbot__action"
              (click)="quickActionSelected.emit(action)"
            >
              @if (action.icon) {
                <ng-icon [name]="action.icon" size="sm"></ng-icon>
              }
              <span>{{ action.label }}</span>
            </button>
          }
        </div>
      }

      <div class="ng-chatbot__composer">
        <label class="ng-chatbot__composer-label" [attr.for]="inputId()">{{ composerLabel() }}</label>
        <textarea
          class="ng-chatbot__textarea"
          [id]="inputId()"
          [rows]="rows()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [(ngModel)]="draft"
        ></textarea>
        <div class="ng-chatbot__composer-footer">
          <small>{{ helperText() }}</small>
          <ng-button
            type="filled"
            label="Send"
            icon="north_east"
            [disabled]="disabled() || !canSend()"
            (buttonClick)="submitMessage()"
          ></ng-button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .ng-chatbot {
      display:grid;
      gap:18px;
      padding:24px;
      border-radius:32px;
      background:
        radial-gradient(circle at top right, rgba(59, 130, 246, .14), transparent 28%),
        linear-gradient(180deg, #ffffff, #f8fafc);
      border:1px solid #dbeafe;
      box-shadow:0 24px 60px rgba(15, 23, 42, .08);
    }
    .ng-chatbot--compact { gap:14px; padding:18px; border-radius:24px; }
    .ng-chatbot__header {
      display:flex;
      justify-content:space-between;
      gap:16px;
      align-items:flex-start;
      flex-wrap:wrap;
    }
    .ng-chatbot__brand { display:flex; gap:14px; align-items:flex-start; }
    .ng-chatbot__avatar {
      display:grid;
      place-items:center;
      width:52px;
      height:52px;
      border-radius:18px;
      background:linear-gradient(135deg, #1d4ed8, #0f172a);
      box-shadow:0 14px 28px rgba(29, 78, 216, .24);
      flex:0 0 auto;
    }
    .ng-chatbot__heading { display:grid; gap:6px; }
    .ng-chatbot__heading p {
      margin:0;
      color:#2563eb;
      font-size:.75rem;
      letter-spacing:.14em;
      text-transform:uppercase;
      font-weight:700;
    }
    .ng-chatbot__heading h3 {
      margin:0;
      color:#0f172a;
      font-size:1.35rem;
      line-height:1.1;
    }
    .ng-chatbot__supporting {
      margin:0;
      color:#475569;
      font-size:.95rem;
    }
    .ng-chatbot__status {
      display:inline-flex;
      align-items:center;
      gap:8px;
      width:max-content;
      padding:6px 10px;
      border-radius:999px;
      font-size:.8rem;
      font-weight:600;
      background:#e2e8f0;
      color:#334155;
    }
    .ng-chatbot__status--online { background:#dcfce7; color:#166534; }
    .ng-chatbot__status--thinking { background:#fef3c7; color:#92400e; }
    .ng-chatbot__status--offline { background:#fee2e2; color:#991b1b; }
    .ng-chatbot__status-dot {
      width:8px;
      height:8px;
      border-radius:50%;
      background:currentColor;
    }
    .ng-chatbot__conversation {
      display:grid;
      gap:14px;
      max-height:420px;
      overflow:auto;
      padding:6px;
    }
    .ng-chatbot__message {
      display:flex;
      gap:12px;
      align-items:flex-end;
      max-width:min(88%, 760px);
    }
    .ng-chatbot__message--user {
      margin-left:auto;
      justify-self:end;
      flex-direction:row-reverse;
    }
    .ng-chatbot__message-icon {
      display:grid;
      place-items:center;
      width:36px;
      height:36px;
      border-radius:14px;
      background:#eff6ff;
      flex:0 0 auto;
    }
    .ng-chatbot__bubble {
      display:grid;
      gap:8px;
      padding:14px 16px;
      border-radius:22px;
      background:white;
      border:1px solid #e2e8f0;
      color:#1e293b;
    }
    .ng-chatbot__message--assistant .ng-chatbot__bubble {
      background:linear-gradient(180deg, #ffffff, #f8fafc);
    }
    .ng-chatbot__message--user .ng-chatbot__bubble {
      background:linear-gradient(135deg, #1d4ed8, #312e81);
      border-color:transparent;
      color:white;
    }
    .ng-chatbot__message--system .ng-chatbot__bubble {
      background:#fff7ed;
      border-color:#fdba74;
    }
    .ng-chatbot__meta {
      display:flex;
      justify-content:space-between;
      gap:12px;
      align-items:center;
      flex-wrap:wrap;
    }
    .ng-chatbot__meta small {
      color:inherit;
      opacity:.72;
    }
    .ng-chatbot__bubble p {
      margin:0;
      white-space:pre-wrap;
      line-height:1.5;
    }
    .ng-chatbot__actions {
      display:flex;
      gap:10px;
      flex-wrap:wrap;
    }
    .ng-chatbot__action {
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:10px 14px;
      border-radius:999px;
      border:1px solid #cbd5e1;
      background:white;
      color:#334155;
      cursor:pointer;
      font:inherit;
      transition:transform .16s ease, border-color .16s ease, box-shadow .16s ease;
    }
    .ng-chatbot__action:hover {
      transform:translateY(-1px);
      border-color:#93c5fd;
      box-shadow:0 12px 24px rgba(59, 130, 246, .12);
    }
    .ng-chatbot__composer {
      display:grid;
      gap:10px;
      padding:18px;
      border-radius:24px;
      background:#f8fafc;
      border:1px solid #e2e8f0;
    }
    .ng-chatbot__composer-label {
      font-size:.82rem;
      font-weight:700;
      color:#334155;
    }
    .ng-chatbot__textarea {
      width:100%;
      resize:vertical;
      min-height:96px;
      border-radius:18px;
      border:1px solid #cbd5e1;
      background:white;
      padding:14px 16px;
      font:inherit;
      color:#0f172a;
      outline:none;
    }
    .ng-chatbot__textarea:focus {
      border-color:#60a5fa;
      box-shadow:0 0 0 4px rgba(96, 165, 250, .18);
    }
    .ng-chatbot__composer-footer {
      display:flex;
      justify-content:space-between;
      gap:12px;
      align-items:center;
      flex-wrap:wrap;
    }
    .ng-chatbot__composer-footer small {
      color:#64748b;
    }
    @media (max-width: 640px) {
      .ng-chatbot { padding:18px; }
      .ng-chatbot__message { max-width:100%; }
      .ng-chatbot__composer-footer { align-items:stretch; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgChatbotComponent {
  readonly eyebrow = input('Conversational AI');
  readonly title = input('Premium chatbot');
  readonly supportingText = input('Use this control for guided support, concierge workflows, or embedded product copilots.');
  readonly status = input<NgChatbotStatus>('online');
  readonly avatarIcon = input('forum');
  readonly messages = input<NgChatbotMessage[]>([
    {
      id: 'assistant-1',
      role: 'assistant',
      author: 'Concierge AI',
      content: 'Welcome back. I can help summarize activity, draft replies, or route premium support requests.',
      timestamp: 'Just now',
    },
  ]);
  readonly quickActions = input<NgChatbotQuickAction[]>([
    { id: 'summary', label: 'Summarize account health', prompt: 'Summarize this account for leadership.', icon: 'summarize' },
    { id: 'draft', label: 'Draft client reply', prompt: 'Draft a polished update for the client.', icon: 'edit_square' },
    { id: 'route', label: 'Escalate support', prompt: 'Escalate this conversation to premium support.', icon: 'support_agent' },
  ]);
  readonly placeholder = input('Ask a question or enter a prompt...');
  readonly composerLabel = input('Message');
  readonly helperText = input('Shift the copy and quick actions to fit your support or copilot workflow.');
  readonly rows = input(4);
  readonly disabled = input(false);
  readonly density = input<'default' | 'compact'>('default');
  readonly inputId = input(`ng-chatbot-${Math.random().toString(36).slice(2, 9)}`);

  readonly draft = model('');

  readonly messageSubmitted = output<string>();
  readonly quickActionSelected = output<NgChatbotQuickAction>();
  readonly resetRequested = output<void>();

  readonly canSend = computed(() => this.draft().trim().length > 0);

  statusLabel() {
    switch (this.status()) {
      case 'thinking':
        return 'Thinking';
      case 'offline':
        return 'Offline';
      default:
        return 'Online';
    }
  }

  defaultAuthor(role: NgChatbotRole) {
    switch (role) {
      case 'assistant':
        return 'Assistant';
      case 'system':
        return 'System';
      default:
        return 'You';
    }
  }

  submitMessage() {
    const value = this.draft().trim();
    if (!value || this.disabled()) {
      return;
    }

    this.messageSubmitted.emit(value);
    this.draft.set('');
  }
}
