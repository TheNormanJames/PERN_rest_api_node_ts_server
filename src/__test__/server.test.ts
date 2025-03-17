import request from 'supertest';
import server, { connnectDB } from '../server';
import db from '../config/db';

describe('GET /api', () => {
  it('should send back a json resonse', async () => {
    const res = await request(server).get('/api');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.msg).toBe('Desde API');

    expect(res.status).not.toBe(404);
    expect(res.body.msg).not.toBe('desde api');
  });
});
jest.mock('../config/db');
describe('connectDB', () => {
  it('Should handle database connection error', async () => {
    jest
      .spyOn(db, 'authenticate')
      .mockRejectedValueOnce(new Error('Error al conectar la base de datos'));

    const consoleSpy = jest.spyOn(console, 'log');

    await connnectDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error al conectar la base de datos')
    );
  });
});
