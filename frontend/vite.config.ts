import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

//front chamando a /api/ e o vite repaasando a APi
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3333' } },
});