import * as request from 'supertest';

describe('AppController (e2e)', () => {
  describe('/publish (POST)', () => {
    it('should return CREATED when message is processed', () => {
      return request('http://localhost:3000')
        .post('/publish')
        .send({
          ts: '123',
          sender: 'e2e supertest',
          message: { dummy: 'yes' },
        })
        .expect(201);
    });

    it('should return BAD_REQUEST when payload is invalid', () => {
      return request('http://localhost:3000')
        .post('/publish')
        .send({})
        .expect(400);
    });
  });
});
