import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/game/play (POST) should return botAction and result', () => {
    return request(app.getHttpServer())
      .post('/game/play')
      .send({ action: 'ROCK' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('botAction');
        expect(res.body).toHaveProperty('result');
        expect(['ROCK', 'PAPER', 'SCISSORS']).toContain(res.body.botAction);
        expect(['WIN', 'LOSE', 'DRAW']).toContain(res.body.result);
      });
  });

  it('/game/play (POST) should reject wrong action', () => {
    return request(app.getHttpServer())
      .post('/game/play')
      .send({ action: 'INVALID_ACTION' })
      .expect(400);
  });
});
