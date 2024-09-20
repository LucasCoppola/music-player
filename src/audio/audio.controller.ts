import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AudioService } from './audio.service';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get('stream')
  async streamAudio(@Res() res: Response, @Query('file') file: string) {
    if (!file) {
      return res.status(400).send('File parameter is required');
    }
  }
}
