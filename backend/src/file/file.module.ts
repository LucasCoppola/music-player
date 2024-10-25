import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { JwtModule } from '@nestjs/jwt';
import { FileController } from './file.controller';

@Module({
  imports: [JwtModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
