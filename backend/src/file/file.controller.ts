import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('images/:filename')
  getImage(@Req() req: Request, @Param('filename') filename: string) {
    return this.fileService.streamFile({
      user_id: req.user.sub,
      filename,
      resource: 'images',
    });
  }

  @Get('track/:filename')
  getTrack(@Req() req: Request, @Param('filename') filename: string) {
    return this.fileService.streamFile({
      user_id: req.user.sub,
      filename,
      resource: 'tracks',
    });
  }
}
