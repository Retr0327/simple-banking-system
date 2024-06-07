import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('E2E Testing Suite', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('account management', () => {
    it('should successfully create a new account', async () => {
      return await request(app.getHttpServer())
        .post('/account')
        .send({ name: 'test', email: '1@mail.com', password: '12345678' })
        .expect(201)
        .expect(({ body }) => {
          expect(body.status).toEqual('success');
          expect(body.data.balance).toEqual(0);
        });
    });

    it('should return 401 when attempting to create an account with an existing email', async () => {
      return await request(app.getHttpServer())
        .post('/account')
        .send({ name: 'test', email: '1@mail.com', password: '12345678' })
        .expect(401);
    });

    it('should retrieve account information', async () => {
      return await request(app.getHttpServer())
        .post('/account/detail')
        .send({ email: '1@mail.com', password: '12345678' })
        .expect(200)
        .expect(({ body }) => {
          expect(body.status).toEqual('success');
          expect(body.data.name).toEqual('test');
          expect(body.data.balance).toEqual(0);
        });
    });

    it('should return 401 for incorrect password', async () => {
      return await request(app.getHttpServer())
        .post('/account/detail')
        .send({ email: '1@mail.com', password: '123456789' })
        .expect(401);
    });

    it('should return 401 for non-existent email', async () => {
      return await request(app.getHttpServer())
        .post('/account/detail')
        .send({ email: '2@mail.com', password: '12345678' })
        .expect(401);
    });
  });

  describe('transaction operations', () => {
    let accountId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/account/detail')
        .send({ email: '1@mail.com', password: '12345678' });
      accountId = res.body.data.id;
    });

    it('should successfully deposit funds', async () => {
      await request(app.getHttpServer())
        .post('/transactions/deposit')
        .send({
          account: accountId,
          password: '12345678',
          amount: 300,
        })
        .expect(201);

      return await request(app.getHttpServer())
        .post('/account/detail')
        .send({ email: '1@mail.com', password: '12345678' })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.balance).toEqual(300);
        });
    });

    it('should return 401 due to insufficient balance', async () => {
      return await request(app.getHttpServer())
        .post('/transactions/withdrawal')
        .send({ account: accountId, password: '12345678', amount: 400 })
        .expect(401);
    });

    it('should successfully withdraw funds', async () => {
      await request(app.getHttpServer())
        .post('/transactions/withdrawal')
        .send({ account: accountId, password: '12345678', amount: 100 })
        .expect(201);

      return await request(app.getHttpServer())
        .post('/account/detail')
        .send({ email: '1@mail.com', password: '12345678' })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.balance).toEqual(200);
        });
    });

    it('should successfully transfer funds between accounts', async () => {
      const targetAccountReq = await request(app.getHttpServer())
        .post('/account')
        .send({
          name: 'test2',
          email: '2@mail.com',
          password: '12345678',
          balance: 200,
        });
      const targetId = targetAccountReq.body.data.id;

      await request(app.getHttpServer())
        .post('/transactions/transfer')
        .send({
          account: accountId,
          password: '12345678',
          targetAccount: targetId,
          amount: 100,
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/account/detail')
        .send({ email: '1@mail.com', password: '12345678' })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.balance).toEqual(100);
        });

      await request(app.getHttpServer())
        .post('/account/detail')
        .send({ email: '2@mail.com', password: '12345678' })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.balance).toEqual(300);
        });
    });
  });
});
