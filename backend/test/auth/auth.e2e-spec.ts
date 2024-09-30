import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { clearDatabase, closeTestApp, setupTestApp } from '../setup';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  beforeEach(async () => {
    await clearDatabase(app);
  });

  afterAll(async () => {
    await clearDatabase(app);
    await closeTestApp();
  });

  describe('/api/auth/register (POST)', () => {
    it('should register user successfully with valid credentials', async () => {
      const registerUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
    });

    it('should fail to register with missing fields', async () => {
      const registerUserDto = {
        username: 'testuser',
        // email is missing
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerUserDto)
        .expect(400);

      expect(response.body.message).toContain('email must be an email');
    });

    it('should fail to register with duplicate email', async () => {
      const registerUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerUserDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerUserDto)
        .expect(409);

      expect(response.body.message).toContain('Email already in use');
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login user successfully with valid credentials', async () => {
      const registerUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerUserDto)
        .expect(201);

      const loginDto = {
        email: 'test@example.com',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });

    it('should fail to login with incorrect password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should fail to login with non-existent email', async () => {
      const loginDto = {
        email: 'non_existent_email@example.com',
        password: 'test123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(401);

      expect(response.body.message).toContain('Invalid email or password');
    });
  });

  describe('/api/auth/profile (GET)', () => {
    it('should get user profile successfully', async () => {
      const registerUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
      };

      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerUserDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${res.body.access_token}`)
        .expect(200);

      expect(response.body).toHaveProperty('username', 'testuser');
    });

    it('should fail to get profile with invalid access_token', async () => {
      const fake_access_token = 'fake_access_token';

      const response = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${fake_access_token}`)
        .expect(401);

      expect(response.body.message).toContain('You must be logged in');
    });

    it('should fail to get profile without access_token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.message).toContain('Unauthorized');
    });
  });
});
