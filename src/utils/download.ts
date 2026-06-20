import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const downloadFile = async (
  url: string,
  destPath: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  const writer = fs.createWriteStream(destPath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  const totalLength = response.headers['content-length'];
  const totalSize = totalLength ? parseInt(String(totalLength)) : 0;

  let downloaded = 0;

  response.data.on('data', (chunk: Buffer) => {
    downloaded += chunk.length;
    if (onProgress && totalSize) {
      const progress = (downloaded / totalSize) * 100;
      onProgress(progress);
    }
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

export const ensureDirectoryExists = (filePath: string): void => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};
