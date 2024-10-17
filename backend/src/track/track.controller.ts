import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateTrackDto } from './dto/create-track.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tracks')
@UseGuards(AuthGuard)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post('upload/audio')
  @UseInterceptors(
    FileInterceptor('track', {
      storage: memoryStorage(),
    }),
  )
  async uploadTrack(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({
            fileType: 'audio/mpeg',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.trackService.uploadTrack(file);
  }

  @Post(':id/upload/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({
            fileType: 'image/jpeg|image/png|image/gif',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.trackService.uploadImage(file);
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto, @Req() req: Request) {
    return await this.trackService.create(createTrackDto, req.user.sub);
  }

  @Get()
  async findAll(@Req() req: Request, @Query('q') query: string) {
    if (query) {
      return await this.trackService.search(query, req.user.sub);
    } else {
      return await this.trackService.findAll(req.user.sub);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return await this.trackService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.trackService.update(+id, updateTrackDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    return await this.trackService.remove(id, req.user.sub);
  }
}
