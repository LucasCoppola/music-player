import {
  Controller,
  Get,
  Post,
  Body,
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
  Patch,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateTrackDto } from './dto/create-track.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateTrackDto } from './dto/update-track.dto';

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
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10 MB
          new FileTypeValidator({
            fileType: 'audio/mpeg',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.trackService.uploadTrack({ file, user_id: req.user.sub });
  }

  @Post('/upload/image')
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
    @Req() req: Request,
  ) {
    return await this.trackService.uploadImage({ file, user_id: req.user.sub });
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto, @Req() req: Request) {
    return await this.trackService.create({
      createTrackDto,
      user_id: req.user.sub,
    });
  }

  @Get()
  async findAll(@Req() req: Request, @Query('q') query: string) {
    if (query) {
      return await this.trackService.search({ query, user_id: req.user.sub });
    } else {
      return await this.trackService.findAll({ user_id: req.user.sub });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return await this.trackService.findOne({ id, user_id: req.user.sub });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return await this.trackService.update({
      id,
      user_id: req.user.sub,
      updateTrackDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    return await this.trackService.remove({ id, user_id: req.user.sub });
  }
}
