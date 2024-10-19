import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { memoryStorage } from 'multer';

@Controller('playlists')
@UseGuards(AuthGuard)
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  create(@Req() req: Request, @Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(req.user.sub, createPlaylistDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.playlistService.findAll(req.user.sub);
  }

  @Post('favorites/tracks/:trackId')
  addTrackToFavorites(@Param('trackId') track_id: string, @Req() req: Request) {
    return this.playlistService.addTrackToFavorites(req.user.sub, track_id);
  }

  @Delete('favorites/tracks/:trackId')
  removeTrackFromFavorites(
    @Param('trackId') track_id: string,
    @Req() req: Request,
  ) {
    return this.playlistService.removeTrackFromFavorites(
      req.user.sub,
      track_id,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.playlistService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistService.update(id, req.user.sub, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.playlistService.remove(id, req.user.sub);
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
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return await this.playlistService.uploadImage(file, id, req.user.sub);
  }

  @Post(':id/tracks/:trackId')
  addTrack(
    @Param('id') id: string,
    @Param('trackId') track_id: string,
    @Req() req: Request,
  ) {
    return this.playlistService.addTrack(id, req.user.sub, track_id);
  }

  @Delete(':id/tracks/:trackId')
  removeTrack(
    @Param('id') id: string,
    @Param('trackId') track_id: string,
    @Req() req: Request,
  ) {
    return this.playlistService.removeTrack(id, req.user.sub, track_id);
  }
}
