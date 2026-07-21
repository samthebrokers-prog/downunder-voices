@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-heading: var(--font-source-serif, Georgia), serif;
  --font-sans: var(--font-libre-franklin, Arial), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-source-serif, Georgia), serif;
  --font-mono: ui-monospace, monospace;
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --font-source-serif: Georgia;
  --font-libre-franklin: Arial;
  color-scheme: light;
  /* Bright, clean newspaper palette */
  --background: oklch(0.99 0.004 95);
  --foreground: oklch(0.22 0.015 260);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.015 260);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.015 260);
  /* Masthead red */
  --primary: oklch(0.52 0.2 27);
  --primary-foreground: oklch(0.99 0.004 95);
  --secondary: oklch(0.96 0.006 250);
  --secondary-foreground: oklch(0.26 0.015 260);
  --muted: oklch(0.96 0.006 250);
  --muted-foreground: oklch(0.5 0.012 260);
  /* Deep teal accent for links / highlights */
  --accent: oklch(0.45 0.08 215);
  --accent-foreground: oklch(0.99 0.004 95);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.9 0.006 260);
  --input: oklch(0.9 0.006 260);
  --ring: oklch(0.52 0.2 27);
  --chart-1: oklch(0.52 0.2 27);
  --chart-2: oklch(0.45 0.08 215);
  --chart-3: oklch(0.6 0.1 150);
  --chart-4: oklch(0.7 0.14 70);
  --chart-5: oklch(0.5 0.012 260);
  --radius: 0.375rem;
  --sidebar: oklch(0.99 0.004 95);
  --sidebar-foreground: oklch(0.22 0.015 260);
  --sidebar-primary: oklch(0.52 0.2 27);
  --sidebar-primary-foreground: oklch(0.99 0.004 95);
  --sidebar-accent: oklch(0.96 0.006 250);
  --sidebar-accent-foreground: oklch(0.26 0.015 260);
  --sidebar-border: oklch(0.9 0.006 260);
  --sidebar-ring: oklch(0.52 0.2 27);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}

.prose-content h2 { @apply font-serif text-2xl font-bold text-foreground; }
.prose-content h3 { @apply font-serif text-xl font-bold text-foreground; }
.prose-content a { @apply text-primary underline; }
