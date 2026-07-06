import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('GameController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should set cookie "playerId" if it isn\'t exist', async () => {
    const res = await request(app.getHttpServer())
      .post('/game/play')
      .send({ action: 'ROCK' });

    expect(res.status).toBe(201);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.startsWith('playerId='))).toBe(true);
  });

  it('should use playerId in cookie', async () => {
    const firstRes = await request(app.getHttpServer())
      .post('/game/play')
      .send({ action: 'ROCK' });

    expect(firstRes.status).toBe(201);

    const cookie = firstRes.headers['set-cookie'];

    const secondRes = await request(app.getHttpServer())
      .post('/game/play')
      .set('Cookie', cookie)
      .send({ action: 'PAPER' });

    expect(secondRes.headers['set-cookie']).toBeUndefined();
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
  }, 10000);

  it('/game/play (POST) should reject wrong action', () => {
    return request(app.getHttpServer())
      .post('/game/play')
      .send({ action: 'INVALID_ACTION' })
      .expect(400);
  });
});
