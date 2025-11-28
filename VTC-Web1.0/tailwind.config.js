

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        tertiary: '#06b6d4',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'bg-primary': '#f8fafc',
        'bg-secondary': '#f1f5f9',
        'border-primary': '#e2e8f0',
        'border-secondary': '#cbd5e1'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-tertiary': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-success': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        'gradient-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-hover': '0 0 30px rgba(102, 126, 234, 0.5)'
      }
    }
  },
  plugins: [],
}

