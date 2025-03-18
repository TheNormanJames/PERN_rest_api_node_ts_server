import request from 'supertest';
import server, { connnectDB } from '../server';
import db from '../config/db';

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
