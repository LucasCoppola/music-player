import { Injectable } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  uploadFile(file: Express.Multer.File) {
    return { file: file.path, message: 'File uploaded successfully' };
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
