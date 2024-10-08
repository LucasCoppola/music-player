import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import * as fs from 'node:fs';

@Injectable()
export class TrackService {
  async uploadFile(file: Express.Multer.File) {
    const uploadPath = './uploads/tracks';

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    await fs.promises.writeFile(
      `${uploadPath}/${Date.now()}-${file.originalname}`,
      file.buffer,
    );

    return {
      message: 'File uploaded successfully',
      filename: file.originalname,
      mimetype: file.mimetype,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    };
  }

  findAll() {
    return `This action returns all track`;
  }

  findOne(id: number) {
    return `This action returns a #${id} track`;
  }

  update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }
}
