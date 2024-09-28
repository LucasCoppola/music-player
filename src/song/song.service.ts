import { Injectable } from '@nestjs/common';

@Injectable()
export class SongService {
  uploadFile(file: Express.Multer.File) {
    return { file: file.path, message: 'File uploaded successfully' };
  }

  findAll() {
    return `This action returns all song`;
  }

  findOne(id: number) {
    return `This action returns a #${id} song`;
  }

  update(id: number, updateSongDto: any) {
    return `This action updates a #${id} song`;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
