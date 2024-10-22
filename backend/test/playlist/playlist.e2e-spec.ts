import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
// import * as fs from 'fs';
// import * as path from 'path';
import * as crypto from 'crypto';
import { clearDatabase, closeTestApp, setupTestApp } from '../setup';
import { CreatePlaylistDto } from 'src/playlist/dto/create-playlist.dto';

describe('Playlist  (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const newPlaylist: CreatePlaylistDto = {
    id: '59032f4b-cfc7-43b3-acf6-e882c4effb98',
    title: 'Test Playlist',
    image_name: null,
    type: 'regular',
  };

  beforeAll(async () => {
    app = await setupTestApp();

    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: `playlist_user_${crypto.randomUUID()}`,
        email: `playlist_user_${crypto.randomUUID()}@example.com`,
        password: 'password123',
      });

    expect(registerResponse.status).toBe(201);
    authToken = registerResponse.body.access_token;
  });

  beforeEach(() => {
    expect(authToken).toBeDefined();
  });

  afterAll(async () => {
    await clearDatabase(app);
    await closeTestApp();
  });

  it('should create a new playlist', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/playlists')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newPlaylist);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'Playlist created successfully.',
    );
  });

  // it('should update a playlist cover image', async () => {
  //   const filePath = path.join(__dirname, 'test-image.jpg');
  //   const fileBuffer = fs.readFileSync(filePath);
  //
  //   const response = await request(app.getHttpServer())
  //     .patch(`/api/playlists/${newPlaylist.id}/upload/image`)
  //     .attach('image', fileBuffer, 'test-image.jpg');
  //
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty(
  //     'message',
  //     'Cover image uploaded successfully',
  //   );
  //   expect(response.body).toHaveProperty('image_name', 'test-image.jpg');
  //
  //   // Check if the previous image was deleted
  //   const previousImageName = 'test.jpg';
  //   const previousImagePath = path.join(
  //     __dirname,
  //     '..',
  //     '..',
  //     'uploads',
  //     'images',
  //     previousImageName,
  //   );
  //   expect(fs.existsSync(previousImagePath)).toBe(false);
  //
  //   // Check if the new image was uploaded
  //   const newImageName = 'test-image.jpg';
  //   const newImagePath = path.join(
  //     __dirname,
  //     '..',
  //     '..',
  //     'uploads',
  //     'images',
  //     newImageName,
  //   );
  //   expect(fs.existsSync(newImagePath)).toBe(true);
  //
  //   // Attempt to access the new image directly
  //   const imageUrl = `http://localhost:8080/images/${newImageName}`;
  //   const imageResponse = await request(app.getHttpServer()).get(imageUrl);
  //   expect(imageResponse.status).toBe(200);
  //   expect(imageResponse.headers['content-type']).toBe('image/jpeg');
  // });
  //
  // it('should remove a playlist and its image', async () => {
  //   const response = await request(app.getHttpServer()).delete(
  //     '/api/playlists/1',
  //   );
  //
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty(
  //     'message',
  //     'Playlist removed successfully.',
  //   );
  //
  //   // Check if the image was deleted
  //   const imagePath = path.join(
  //     __dirname,
  //     '..',
  //     '..',
  //     'uploads',
  //     'images',
  //     'test-image.jpg',
  //   );
  //   expect(fs.existsSync(imagePath)).toBe(false);
  //
  //   // Attempt to access the deleted image directly
  //   const imageUrl = `http://localhost:8080/images/test-image.jpg`;
  //   const imageResponse = await request(app.getHttpServer()).get(imageUrl);
  //   expect(imageResponse.status).toBe(404);
  // });
  //
  // // Additional tests for edge cases and failure scenarios
  // it("should fail to upload an image when the playlist doesn't exist", async () => {
  //   const filePath = path.join(__dirname, 'test-image.jpg');
  //   const fileBuffer = fs.readFileSync(filePath);
  //   const response = await request(app.getHttpServer())
  //     .patch('/api/playlists/999/upload/image')
  //     .attach('image', fileBuffer, 'test-image.jpg');
  //
  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty('message', 'Playlist not found.');
  // });
  //
  // it('should fail to upload an invalid image type', async () => {
  //   const filePath = path.join(__dirname, 'test-document.txt');
  //   const fileBuffer = fs.readFileSync(filePath);
  //   const response = await request(app.getHttpServer())
  //     .patch('/api/playlists/1/upload/image')
  //     .attach('image', fileBuffer, 'test-document.txt');
  //
  //   expect(response.status).toBe(400);
  //   expect(response.body).toHaveProperty('message', 'Invalid image type.');
  // });
  //
  // it('should fail to upload an image that exceeds the size limit', async () => {
  //   // Simulate a large file
  //   const largeFileBuffer = Buffer.alloc(1024 * 1024 * 10); // 10MB
  //   const response = await request(app.getHttpServer())
  //     .patch('/api/playlists/1/upload/image')
  //     .attach('image', largeFileBuffer, 'large-image.jpg');
  //
  //   expect(response.status).toBe(400);
  //   expect(response.body).toHaveProperty(
  //     'message',
  //     'Image size exceeds the limit.',
  //   );
  // });
  //
  // it('should fail to remove a playlist that doesn’t exist', async () => {
  //   const response = await request(app.getHttpServer()).delete(
  //     '/api/playlists/999',
  //   );
  //
  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty('message', 'Playlist not found.');
  // });
  //
  // it('should fail to remove an image that doesn’t exist', async () => {
  //   const response = await request(app.getHttpServer()).delete(
  //     '/api/playlists/1/upload/image',
  //   );
  //
  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty('message', 'Image not found.');
  // });
  //
  // it('should fail to add a track that doesn’t exist', async () => {
  //   const response = await request(app.getHttpServer()).post(
  //     '/api/playlists/favorites/tracks/999',
  //   );
  //
  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty('message', 'Track not found.');
  // });
  //
  // it('should fail to remove a track that doesn’t exist', async () => {
  //   const response = await request(app.getHttpServer()).delete(
  //     '/api/playlists/favorites/tracks/999',
  //   );
  //
  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty('message', 'Track not found.');
  // });
  //
  // it('should fail to add the same track twice', async () => {
  //   const response = await request(app.getHttpServer()).post(
  //     '/api/playlists/favorites/tracks/1',
  //   );
  //
  //   expect(response.status).toBe(409);
  //   expect(response.body).toHaveProperty(
  //     'message',
  //     'Track already in Favorites.',
  //   );
  // });
  //
  // it('should fail to remove a track not in the playlist', async () => {
  //   const response = await request(app.getHttpServer()).delete(
  //     '/api/playlists/favorites/tracks/2',
  //   );
  //
  //   expect(response.status).toBe(404);
  //   expect(response.body).toHaveProperty('message', 'Track not in Favorites.');
  // });
});
