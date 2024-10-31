import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { join } from 'path';

@Injectable()
export class FileService {
  streamFile({
    user_id,
    filename,
    resource,
  }: {
    user_id: string;
    filename: string;
    resource: 'tracks' | 'images';
  }): StreamableFile {
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      user_id,
      resource,
      filename,
    );

    try {
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException(
          `File ${filename} in ${resource} not found`,
        );
      }

      const file = fs.createReadStream(filePath);
      return new StreamableFile(file);
    } catch (error) {
      console.error('Error streaming file: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to stream file');
      }
    }
  }

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

  /**
   * @param size
   * -- 'small' (~40x40)
   * - 'medium' (~80x80)
   * - 'large' (~200x200)
   */
  async compressImage({
    buffer,
    image_name,
    outputDir,
    size,
  }: {
    buffer: Buffer;
    image_name: string;
    outputDir: string;
    size: 'small' | 'medium' | 'large';
  }) {
    const output_path = `${outputDir}/${image_name}-${size}.webp`;
    let quality: number;
    let target_size: { width: number; height: number };

    switch (size) {
      case 'small':
        quality = 75;
        target_size = { width: 40, height: 40 };
        break;
      case 'medium':
        quality = 90;
        target_size = { width: 80, height: 80 };
        break;
      case 'large':
        quality = 100;
        target_size = { width: 192, height: 192 };
        break;
    }

    try {
      const result = await sharp(buffer)
        .resize({ ...target_size })
        .webp({ quality })
        .toFile(output_path);

      return result;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new InternalServerErrorException('Failed to compress image');
    }
  }
}
