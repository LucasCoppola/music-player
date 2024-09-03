import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';

let app: INestApplication;

export async function setupTestApp(): Promise<INestApplication> {
  if (!app) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api', {
      exclude: [{ path: 'healthz', method: RequestMethod.GET }],
    });
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  }

  return app;
}

export async function closeTestApp() {
  if (app) {
    await app.close();
  } else {
    throw new Error('App not initialized');
  }
}
