import { copyFile } from 'node:fs/promises';

/**
 * GitHub Pages serves 404.html for any path it can't resolve. Copying the built
 * index.html there means a mistyped or stale URL under the base still renders
 * the site instead of GitHub's default 404 page.
 *
 * Note: this is NOT needed for anchor links — URL fragments (#about) never reach
 * the server. It also has to be a copy of the BUILT html, not public/index.html,
 * which would reference /src/main.tsx and break in production.
 */
await copyFile('dist/index.html', 'dist/404.html');
console.log('postbuild: dist/404.html written');
