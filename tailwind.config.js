/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-cell-selected',
    'bg-cell-related',
    'bg-cell-hover',
    'ring-accent',
    'border-cell-border',
    'bg-highlight-bg',
    'ring-highlight-digit',
    'text-highlight-digit',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        board: 'var(--bg-board)',
        
        'txt-primary': 'var(--text-primary)',
        'txt-secondary': 'var(--text-secondary)',
        'txt-board': 'var(--text-board)',
        
        accent: 'var(--accent-color)',
        'accent-hover': 'var(--accent-hover)',
        
        'cell-border': 'var(--cell-border)',
        'cell-selected': 'var(--cell-selected)',
        'cell-related': 'var(--cell-related)',
        'cell-hover': 'var(--cell-hover)',
        
        'highlight-digit': 'var(--highlight-digit)',
        'highlight-bg': 'var(--highlight-bg)',
      }
    },
  },
  plugins: [],
}
