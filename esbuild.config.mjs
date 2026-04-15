import esbuild from 'esbuild';
import process from 'process';
import builtins from 'builtin-modules';
import fs from 'fs';
import path from 'path';

const prod = process.argv[2] === 'production';

// Build CSS: copy src/styles.css to root styles.css
function buildCSS() {
  const srcCSS = path.join(process.cwd(), 'src', 'styles.css');
  if (fs.existsSync(srcCSS)) {
    fs.copyFileSync(srcCSS, path.join(process.cwd(), 'styles.css'));
  } else {
    fs.writeFileSync('styles.css', '/* QNClawdian styles */\n');
  }
}

buildCSS();

const context = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    ...builtins,
  ],
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
  minify: prod,
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
