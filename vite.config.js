import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Минификация статических .js/.css, скопированных в dist.
 * Скрипты проекта — классические (глобальная область видимости между файлами),
 * поэтому бандлинг в ES-модули неприменим: копируем как есть, но сжимаем esbuild.
 * Файлы *.min.* (vendor-библиотеки) не трогаем — они уже сжаты.
 */
function minifyStatics() {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(js|css)$/.test(entry.name) && !/\.min\.(js|css)$/.test(entry.name)) {
        const src = fs.readFileSync(full, 'utf8');
        const { code } = esbuild.transformSync(src, {
          minify: true,
          loader: entry.name.endsWith('.css') ? 'css' : 'js',
        });
        fs.writeFileSync(full, code);
      }
    }
  };
  return {
    name: 'minify-static-js-css',
    apply: 'build',
    closeBundle() {
      if (fs.existsSync('dist')) walk('dist');
    },
  };
}

export default defineConfig({
  // GitHub Pages обслуживает сайт из подпапки — относительные пути
  base: './',
  publicDir: false,
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        step: 'step-v-gib.html',
        ycalc: 'y-calculator.html',
      },
    },
  },
  plugins: [
    // Классические <script src> и <link href> Vite не бандлит — копируем сами
    viteStaticCopy({
      targets: [
        { src: 'js/**/*', dest: 'js' },
        { src: 'css/**/*', dest: 'css' },
        { src: 'favicon.svg', dest: '.' },
        { src: 'og-image.png', dest: '.' },
      ],
    }),
    minifyStatics(),
  ],
});
