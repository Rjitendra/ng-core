import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import {
  NgChatbotComponent,
  NgChatbotMessage,
  NgChatbotQuickAction,
} from './ng-chatbot.component';

const conciergeMessages: NgChatbotMessage[] = [
  {
    id: 'm-1',
    role: 'assistant',
    author: 'Concierge AI',
    content: 'I reviewed the account. Renewal confidence is strong, but legal approval is still blocking signature.',
    timestamp: '9:12 AM',
  },
  {
    id: 'm-2',
    role: 'user',
    author: 'Revenue Lead',
    content: 'Draft a concise update I can send to the executive sponsor.',
    timestamp: '9:13 AM',
  },
  {
    id: 'm-3',
    role: 'assistant',
    author: 'Concierge AI',
    content: 'Draft: We are on track commercially and have completed pricing alignment. The only remaining dependency is final legal review, which we expect to close this week.',
    timestamp: '9:13 AM',
  },
];

const supportActions: NgChatbotQuickAction[] = [
  { id: 'brief', label: 'Executive brief', prompt: 'Create a leadership-ready summary.', icon: 'insert_chart' },
  { id: 'email', label: 'Draft email', prompt: 'Draft a premium client email.', icon: 'mail' },
  { id: 'next-step', label: 'Recommend next step', prompt: 'Recommend the next best action.', icon: 'assistant_navigation' },
];

const meta: Meta<NgChatbotComponent> = {
  title: 'Communication/Chatbot',
  component: NgChatbotComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgChatbotComponent],
    }),
  ],
  parameters: withControlDocs(NgChatbotComponent, {
    layout: 'padded',
  }),
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['online', 'thinking', 'offline'],
    },
    density: {
      control: 'inline-radio',
      options: ['default', 'compact'],
    },
  },
  args: {
    eyebrow: 'Conversational AI',
    title: 'Premium chatbot',
    supportingText: 'A polished conversation surface for copilots, client support, and guided workflows.',
    status: 'online',
    avatarIcon: 'smart_toy',
    messages: conciergeMessages,
    quickActions: supportActions,
    placeholder: 'Ask for a summary, draft, or recommendation...',
    composerLabel: 'Prompt',
    helperText: 'This story is presentational; wire `messageSubmitted` and `quickActionSelected` in your host app.',
    rows: 4,
    density: 'default',
  },
};

export default meta;

type Story = StoryObj<NgChatbotComponent>;

export const Default: Story = {};

export const SupportCopilot: Story = {
  args: {
    eyebrow: 'Support copilot',
    title: 'Priority support assistant',
    status: 'thinking',
    supportingText: 'Surface premium support context, reply drafts, and escalation prompts in a cleaner chat shell.',
    messages: [
      {
        id: 's-1',
        role: 'system',
        author: 'System',
        content: 'Case severity raised to P1. Engineering watcher added automatically.',
        timestamp: '2:05 PM',
        tone: 'warning',
      },
      {
        id: 's-2',
        role: 'user',
        author: 'Support manager',
        content: 'Summarize what changed in the last 30 minutes.',
        timestamp: '2:06 PM',
      },
      {
        id: 's-3',
        role: 'assistant',
        author: 'Priority AI',
        content: 'In the last 30 minutes, incident scope narrowed to EU traffic, mitigation was deployed, and customer comms were approved for send.',
        timestamp: '2:06 PM',
      },
    ],
    quickActions: [
      { id: 'timeline', label: 'Build incident timeline', prompt: 'Create an incident timeline.', icon: 'schedule' },
      { id: 'status-page', label: 'Draft status page', prompt: 'Draft a public status update.', icon: 'public' },
      { id: 'escalate', label: 'Escalate to on-call lead', prompt: 'Escalate this to the on-call lead.', icon: 'campaign' },
    ],
  },
};

export const CompactWidget: Story = {
  args: {
    density: 'compact',
    title: 'Embedded assistant',
    supportingText: 'A tighter version for side panels or dashboard cards.',
    rows: 3,
    quickActions: [
      { id: 'recap', label: 'Recap', prompt: 'Give me the recap.', icon: 'notes' },
      { id: 'next', label: 'Next step', prompt: 'What should I do next?', icon: 'trending_up' },
    ],
  },
};
