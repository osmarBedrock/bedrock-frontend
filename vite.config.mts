import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

// Plugin para ignorar advertencias específicas
function muteWarningsPlugin(warningsToIgnore: string[][]): Plugin {
  const mutedMessages = new Set();

  return {
    name: 'mute-warnings',
    enforce: 'pre',
    config: (userConfig) => ({
      build: {
        rollupOptions: {
          onwarn(warning, defaultHandler) {
            if (warning.code) {
              const muted = warningsToIgnore.find(
                ([code, message]) => code == warning.code && warning.message.includes(message)
              );

              if (muted) {
                mutedMessages.add(muted.join());
                return;
              }
            }

            if (userConfig.build?.rollupOptions?.onwarn) {
              userConfig.build.rollupOptions.onwarn(warning, defaultHandler);
            } else {
              defaultHandler(warning);
            }
          },
        },
      },
    }),
    closeBundle() {
      const diff = warningsToIgnore.filter((x) => !mutedMessages.has(x.join()));
      if (diff.length > 0) {
        this.warn('Some of your muted warnings never appeared during the build process:');
        diff.forEach((m) => this.warn(`- ${m.join(': ')}`));
      }
    },
  };
}

// Advertencias a ignorar
const warningsToIgnore = [
  ['SOURCEMAP_ERROR', "Can't resolve original location of error"],
  ['INVALID_ANNOTATION', 'contains an annotation that Rollup cannot interpret'],
];

export default defineConfig({
  plugins: [react(), muteWarningsPlugin(warningsToIgnore)],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^@\/(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  build: {
    emptyOutDir: true, // Vaciar la carpeta de salida antes de construir
    sourcemap: true, // Generar sourcemaps para depuración
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: `assets/[name].js`, // Nombre de los archivos de entrada
        chunkFileNames: `assets/[name].js`, // Nombre de los chunks
        assetFileNames: `assets/[name].[ext]`, // Nombre de los assets (CSS, imágenes, etc.)
      },
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});