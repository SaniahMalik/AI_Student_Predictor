import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Reason: Vite ke modern templates mein `@vitejs/plugin-react` pehle se installed hota hai.
// `@vitejs/react-refresh` ab obsolete ho chuka hai, is liye standard plugin call kiya hai.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})