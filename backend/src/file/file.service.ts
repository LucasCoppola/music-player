import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async writeFile({
    directory,
    filename,
    buffer,
  }: {
    directory: string;
    filename: string;
    buffer: Buffer;
  }) {
    const filePath = `${directory}/${filename}`;

    try {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      await fs.promises.writeFile(filePath, buffer);

      return filePath;
    } catch (error) {
      console.error('Error writing file: ', error);
      throw new InternalServerErrorException('Failed to write file');
    }
  }

  async removeFile({ filePath }: { filePath: string }) {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn('File not found:', filePath);
        throw new NotFoundException('File not found');
      } else {
        console.error('Error deleting file:', error);
        throw new InternalServerErrorException('Failed to delete file');
      }
    }
  }
}
