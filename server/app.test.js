'use strict';

const request = require('supertest');

const app = require('./app');

describe('GET /pizza/list', () => {
  test('GET /pizza/list succeeds', () => {
    return request(app)
      .get('/pizza/list')
      .expect(200);
  });

  test('GET /pizza/list returns JSON', () => {
    return request(app)
      .get('/pizza/list')
      .expect('Content-type', /json/);
  });

  test('GET /pizza/list returns an array where every pizza has an id and a name', () => {
    return request(app)
      .get('/pizza/list')
      .expect(200)
      .then(res => {
        expect(Array.isArray(res.body)).toBe(true);
        for(let pizza of res.body){
          expect(pizza).toHaveProperty('id');
          expect(pizza).toHaveProperty('name');
        }
      });
  });

  test('GET /pizza/list includes Margherita', () => {
    return request(app)
      .get('/pizza/list')
      .expect(200)
      .expect(/Margherita/);
  });
});

describe('GET /topping/list', () => {
  test('GET /topping/list succeeds', () => {
    return request(app)
      .get('/topping/list')
      .expect(200);
  });

  test('GET /topping/list returns JSON', () => {
    return request(app)
      .get('/topping/list')
      .expect('Content-type', /json/);
  });

  test('GET /topping/list returns an array where every topping has an id and a name', () => {
    return request(app)
      .get('/topping/list')
      .expect(200)
      .then(res => {
        expect(Array.isArray(res.body)).toBe(true);
        for(let topping of res.body){
          expect(topping).toHaveProperty('id');
          expect(topping).toHaveProperty('name');
        }
      });
  });
});

describe('GET /pizza/detail/:id', () => {
  test('GET /pizza/detail/1 succeeds with JSON', () => {
    return request(app)
      .get('/pizza/detail/1')
      .expect(200)
      .expect('Content-type', /json/);
  });

  test('GET /pizza/detail/1 returns full pizza details with expanded toppings', () => {
    return request(app)
      .get('/pizza/detail/1')
      .expect(200)
      .then(res => {
        expect(res.body.name).toBe('Margherita');
        expect(res.body).toHaveProperty('price');
        expect(res.body).toHaveProperty('imageURL');
        expect(Array.isArray(res.body.toppings)).toBe(true);
        expect(res.body.toppings.length).toBeGreaterThan(0);
        for(let topping of res.body.toppings){
          // toppings should be full objects, not just ids
          expect(topping).toHaveProperty('id');
          expect(topping).toHaveProperty('name');
        }
      });
  });

  test('GET /pizza/detail/not-a-number returns 400', () => {
    return request(app)
      .get('/pizza/detail/not-a-number')
      .expect(400);
  });

  test('GET /pizza/detail/99999 returns 400 for a pizza that does not exist', () => {
    return request(app)
      .get('/pizza/detail/99999')
      .expect(400);
  });
});

describe('GET /topping/detail/:id', () => {
  test('GET /topping/detail/1 succeeds and returns Mozzarella', () => {
    return request(app)
      .get('/topping/detail/1')
      .expect(200)
      .expect('Content-type', /json/)
      .then(res => {
        expect(res.body.name).toBe('Mozzarella');
      });
  });

  test('GET /topping/detail/not-a-number returns 400', () => {
    return request(app)
      .get('/topping/detail/not-a-number')
      .expect(400);
  });

  test('GET /topping/detail/99999 returns 400 for a topping that does not exist', () => {
    return request(app)
      .get('/topping/detail/99999')
      .expect(400);
  });
});

describe('POST /pizza/new', () => {
  test('POST /pizza/new succeeds with valid input and the pizza appears in the list', async () => {
    let newPizza = {
      name: 'Test Special',
      price: 6.5,
      imageURL: 'media/test.png',
      fancyImageURL: 'media/test_fancy.png',
      toppings: [1, 2]
    };

    await request(app)
      .post('/pizza/new')
      .send(newPizza)
      .expect(200)
      .expect('Content-type', /json/);

    return request(app)
      .get('/pizza/list')
      .expect(200)
      .expect(/Test Special/);
  });

  test('POST /pizza/new returns 400 when required fields are missing', () => {
    let incompletePizza = {
      price: 6.5,
      imageURL: 'media/test.png',
      fancyImageURL: 'media/test_fancy.png'
    };

    return request(app)
      .post('/pizza/new')
      .send(incompletePizza)
      .expect(400);
  });

  test('POST /pizza/new returns 400 when a referenced topping id does not exist', () => {
    let pizzaWithBadTopping = {
      name: 'Bad Topping Pizza',
      price: 6.5,
      imageURL: 'media/test.png',
      fancyImageURL: 'media/test_fancy.png',
      toppings: [99999]
    };

    return request(app)
      .post('/pizza/new')
      .send(pizzaWithBadTopping)
      .expect(400);
  });
});
