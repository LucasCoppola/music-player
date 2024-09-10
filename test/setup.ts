import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { EntityManager } from 'typeorm';

let app: INestApplication;

export async function setupTestApp(): Promise<INestApplication> {
  if (!app) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

export async function clearDatabase(app: INestApplication): Promise<void> {
  const entityManager = app.get<EntityManager>(EntityManager);
  const tableNames = entityManager.connection.entityMetadatas
    .map((entity) => entity.tableName)
    .join(', ');

  await entityManager.query(`truncate ${tableNames} restart identity cascade;`);
}
