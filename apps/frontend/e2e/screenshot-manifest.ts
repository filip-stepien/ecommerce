import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { screenshotDir } from './support.ts';

export default async function writeScreenshotManifest() {
    await mkdir(screenshotDir, { recursive: true });
    const names = (await readdir(screenshotDir))
        .filter(file => file.endsWith('.png'))
        .map(file => file.slice(0, -'.png'.length))
        .sort();
    await writeFile(
        path.join(screenshotDir, 'screenshots.json'),
        `${JSON.stringify(names, null, 4)}\n`
    );
}
