import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { clearDatabase, closeTestApp, setupTestApp } from '../setup';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApp();
  });

  afterAll(async () => {
    await clearDatabase(app);
    await closeTestApp();
  });

  describe('/api/auth/register (POST)', () => {
    it('should register successfully with valid credentials', async () => {
      const registerAuthDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerAuthDto)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login successfully with valid credentials', async () => {
      const loginAuthDto = {
        email: 'test@example.com',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginAuthDto)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });
  });
});
