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
  async readFile({ user_id, filename }: { user_id: string; filename: string }) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      user_id,
      'images',
      filename,
    );

    try {
      const file = await fs.promises.readFile(filePath);
      return file;
    } catch (error) {
      console.error('Error reading file: ', error);
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`Image ${filename} not found`);
      } else {
        throw new InternalServerErrorException('Failed to read file');
      }
    }
  }

  streamFile({
    user_id,
    filename,
  }: {
    user_id: string;
    filename: string;
  }): StreamableFile {
    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      user_id,
      'tracks',
      filename,
    );

    try {
      const file = fs.createReadStream(filePath);
      return new StreamableFile(file);
    } catch (error) {
      console.error('Error streaming file: ', error);
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`Track ${filename} not found`);
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
        target_size = { width: 128, height: 128 };
        break;
      case 'medium':
        quality = 90;
        target_size = { width: 256, height: 256 };
        break;
      case 'large':
        quality = 100;
        target_size = { width: 512, height: 512 };
        break;
    }

    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const result = await sharp(buffer)
        .resize({
          width: target_size.width,
          height: target_size.height,
          fit: 'cover',
          kernel: 'lanczos3',
        })
        .webp({ quality })
        .toFile(output_path);

      return result;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new InternalServerErrorException('Failed to compress image');
    }
  }
}
