export const theme = {
    colors: {
        background: '#030305', // Very deep dark
        surface: '#0A0A0C',
        primary: '#00F0FF', // Cyberpunk Cyan
        secondary: '#7000FF', // Electric Purple
        accent: '#FF0055', // Neon Red/Pink
        text: '#FFFFFF',
        textSecondary: '#888888',
        border: 'rgba(255, 255, 255, 0.1)',
        glass: 'rgba(255, 255, 255, 0.05)',
    },
    fonts: {
        main: 'var(--font-inter), sans-serif',
        mono: 'var(--font-jetbrains-mono), monospace',
        aesthetic: 'var(--font-bodoni), serif', // For that geek feel
    },
    breakpoints: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px',
    },
    transitions: {
        default: '0.3s ease',
        fast: '0.1s ease',
        slow: '0.5s ease',
    },
}
