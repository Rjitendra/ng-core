import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Foundations/Core',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const PremiumFoundations: Story = {
  render: () => ({
    template: `
      <section
        style="
          min-height:100vh;
          display:grid;
          gap:28px;
          padding:48px;
          background:
            radial-gradient(circle at top left, rgba(14,165,233,.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(99,102,241,.16), transparent 32%),
            linear-gradient(180deg, #f8fafc, #eef2ff);
        "
      >
        <div style="display:grid; gap:12px; max-width:820px;">
          <p style="margin:0; color:#0284c7; letter-spacing:.16em; text-transform:uppercase; font-size:.8rem;">Core foundations</p>
          <h1 style="margin:0; font-size:3rem; line-height:1.02; color:#0f172a;">Premium surface language for the shared Angular component kit.</h1>
          <p style="margin:0; color:#475569; font-size:1.05rem;">This foundations story acts as the system-level “Core” entry the repo was missing: tone, spacing, elevation, and showcase framing for the premium controls added in this pass.</p>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:18px;">
          <article style="padding:24px; border-radius:28px; background:#0f172a; color:white;">
            <h3 style="margin:0 0 8px;">Atmosphere</h3>
            <p style="margin:0; color:#cbd5e1;">Deep navigation surfaces paired with brighter content planes.</p>
          </article>
          <article style="padding:24px; border-radius:28px; background:white; box-shadow:0 24px 48px rgba(15,23,42,.08);">
            <h3 style="margin:0 0 8px;">Density</h3>
            <p style="margin:0; color:#475569;">Larger radii, more breathing room, and clearer hierarchy.</p>
          </article>
          <article style="padding:24px; border-radius:28px; background:linear-gradient(135deg, #1d4ed8, #312e81); color:white;">
            <h3 style="margin:0 0 8px;">Emphasis</h3>
            <p style="margin:0; color:#dbeafe;">Accent gradients used sparingly for premium emphasis.</p>
          </article>
        </div>
      </section>
    `,
  }),
};
