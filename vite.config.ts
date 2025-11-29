import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Stringify the API key so it gets injected as a string literal during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Safe fallback for other process.env accesses to prevent crash
      'process.env': {}
    },
  };
});