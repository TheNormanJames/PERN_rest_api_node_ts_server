import request from 'supertest';
import server from '../../server';

describe('Post /api/products', () => {
  it('should display validation errors', async () => {
    const response = await request(server).post('/api/products').send();
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(4);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body.errors).not.toHaveLength(1);
  });
  it('should display that the price is greater than 0', async () => {
    const response = await request(server)
      .post('/api/products')
      .send({ name: 'monitor Nuevo', price: 0 });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });
  it('should display that the price is a number and greater than 0', async () => {
    const response = await request(server)
      .post('/api/products')
      .send({ name: 'monitor Nuevo', price: 'hola' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  it('Should create a new product', async () => {
    const response = await request(server)
      .post('/api/products')
      .send({ name: 'Mouse - Testing', price: 50 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');

    expect(response.status).not.toBe(200);
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('GET /api/products', () => {
  it('shoud check if api/products url exist', async () => {
    const response = await request(server).get('/api/products');
    expect(response.status).not.toBe(404);
  });

  it('GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(1);
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('GET /api/products/:id', () => {
  it('Should return a 404 response for a non-existent product', async () => {
    const productId = 200;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Producto No encontrado ');
  });

  it('Should check a valid ID in the URL', async () => {
    const resonse = await request(server).get('/api/products/not-valid-url');
    expect(resonse.status).toBe(400);
    expect(resonse.body).toHaveProperty('errors');
    expect(resonse.body.errors[0].msg).toBe('Id no es válido');
  });
  it('get a JSON for a single product', async () => {
    const resonse = await request(server).get('/api/products/1');
    expect(resonse.status).toBe(200);
    expect(resonse.body).toHaveProperty('data');
  });
});

describe('PUT /api/products/:id', () => {
  it('Should check a valid ID in the URL', async () => {
    const resonse = await request(server)
      .put('/api/products/not-valid-url')
      .send({
        name: 'Mouse Nuevo',
        availability: true,
        price: 300,
      });
    expect(resonse.status).toBe(400);
    expect(resonse.body).toHaveProperty('errors');
    expect(resonse.body.errors).toHaveLength(1);
    expect(resonse.body.errors[0].msg).toBe('Id no es válido');
  });
  it('Should display validation error messages when uptading a product', async () => {
    const response = await request(server).put('/api/products/1').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });
  it('Should validatae that the price is greater than 0', async () => {
    const response = await request(server).put('/api/products/1').send({
      name: 'Mouse Nuevo',
      availability: true,
      price: 0,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Precio no válido');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });
  it('Should return a 404 resonse for a non-existing product', async () => {
    const productId = 200;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: 'Mouse Nuevo',
        availability: true,
        price: 300,
      });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto No encontrado');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });
  it('Should update an existing product with  valid data', async () => {
    const response = await request(server).put(`/api/products/1`).send({
      name: 'Mouse Nuevo',
      availability: true,
      price: 300,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('PATCH /api/products/:id', () => {
  it('should return a 404 response for non-existing product', async () => {
    const productId = 2000;
    const response = await request(server).patch(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto No encontrado');
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  it('Should update the product availability', async () => {
    const response = await request(server).patch(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty('error');
  });
});

describe('DELETE /api/products/:id', () => {
  it('Should check a valid ID', async () => {
    const resonse = await request(server).delete('/api/products/not-valid');
    expect(resonse.status).toBe(400);
    expect(resonse.body).toHaveProperty('errors');
    expect(resonse.body.errors[0].msg).toBe('Id no es válido');
  });
  it('Should return a 404 response for a non-existing product', async () => {
    const productId = 2000;
    const resonse = await request(server).delete(`/api/products/${productId}`);
    expect(resonse.status).toBe(404);
    expect(resonse.body).toHaveProperty('error');
    expect(resonse.body.error).toBe('Producto No encontrado');

    expect(resonse.status).not.toBe(200);
  });
  it('Should delete product', async () => {
    const resonse = await request(server).delete(`/api/products/1`);
    expect(resonse.status).toBe(200);
    expect(resonse.body).toHaveProperty('data');
    expect(resonse.body.data).toBe('Producto Eliminado');
  });
});
