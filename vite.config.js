import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        calculator: resolve(__dirname, 'calculator.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        'blog-ai-dental-companion': resolve(__dirname, 'blog/best-ai-dental-companion-2025.html'),
        'blog-patient-compliance': resolve(__dirname, 'blog/patient-compliance-dental-apps.html'),
        'blog-ai-assistant-guide': resolve(__dirname, 'blog/dental-practice-ai-assistant-guide.html'),
      },
    },
  },
});
