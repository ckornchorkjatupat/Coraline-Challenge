import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('Score & Player (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/player/session (GET) should create playerId in first time', async () => {
    const res = await request(app.getHttpServer()).get('/player/session');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ currentScore: 0, highScore: 0 });

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.startsWith('playerId='))).toBe(true);
  });

  it('/player/session (GET) should score be the same in second time', async () => {
    const firstRes = await request(app.getHttpServer()).get('/player/session');
    const cookie = firstRes.headers['set-cookie'][0];

    const secondRes = await request(app.getHttpServer())
      .get('/player/session')
      .set('Cookie', cookie);

    expect(secondRes.status).toBe(200);
    expect(secondRes.body).toMatchObject({ currentScore: 0, highScore: 0 });
    expect(secondRes.headers['set-cookie']).toBeUndefined();
  });
});
