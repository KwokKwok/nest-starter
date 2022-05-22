import * as request from 'supertest';
const SERVER_LOCATION = `http://localhost:3000`;

// 直接在服务器启动的情况下测试

describe('AppController (e2e)', () => {
  const origin = 'http://localhost:3002';
  it('跨域测试', () => {
    return request(SERVER_LOCATION)
      .options('/')
      .set('Origin', origin)
      .expect('Access-Control-Allow-Origin', origin);
  });
});
