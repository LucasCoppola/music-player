import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('images/:filename')
  async getImage(
    @Res() res: Response,
    @Req() req: Request,
    @Param('filename') filename: string,
  ) {
    const file = await this.fileService.readFile({
      user_id: req.user.sub,
      filename,
    });

    res.set({
      'Content-Type': 'image/webp',
    });

    return res.send(file);
  }

  @Get('track/:filename')
  getTrack(@Req() req: Request, @Param('filename') filename: string) {
    return this.fileService.streamFile({
      user_id: req.user.sub,
      filename,
    });
  }
}
