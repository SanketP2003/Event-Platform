/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#121212',
                    800: '#1e1e1e',
                    700: '#2d2d2d',
                    500: '#6b7280',
                },
                light: {
                    100: '#f8f9fa',
                    200: '#e9ecef',
                    300: '#dee2e6',
                    500: '#6c757d',
                },
                primary: '#646cff',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
}