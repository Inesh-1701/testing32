# Bonu assai!

A dynamic pizza ordering website. Static HTML/CSS/JS pages load pizza and topping
data from a Node.js/Express REST API via `fetch`, so the menu, an admin panel,
and checkout all update without a page reload.

## Entities

- **Pizza** — a menu item (name, price, images).
- **Topping** — an ingredient (name).

A pizza has many toppings (`pizza.toppings` is a list of topping ids). `GET
/pizza/detail/:id` expands those ids into full topping objects, so a client
never has to make a second request to know what's on a pizza.

## Prerequisites

- [Node.js](https://nodejs.org/) (18+) and npm

## Getting started

```bash
cd server
npm install
npm start
```

Open **http://127.0.0.1:8090** in a browser. The server also serves the
`client/` folder as static files, so the same port serves both the API and
the website — there's nothing else to start.

## Running the tests

```bash
cd server
npm test
```

This runs the Jest + Supertest suite in `server/app.test.js` directly against
the Express app (no real server/port involved). It covers, for both Pizzas
and Toppings:

- `200` status and JSON `Content-type` on the list and detail endpoints
- shape checks (list responses are arrays where every item has an `id` and a
  `name`; detail responses expand related toppings)
- `400` status on a malformed or non-existent id
- `POST /pizza/new`: `200` and the new pizza appearing in a follow-up
  `GET /pizza/list`, `400` when a required field is missing, and `400` when a
  referenced topping id doesn't exist
- a content check that a known seeded pizza (`Margherita`) appears in the list

## Project layout

```
client/            static site, served as-is by Express
  index.html/js      the menu, pizza customization modal, admin login
  checkout.html/js   cart review, billing form, order confirmation
  admin.html/js      add/remove pizzas and states
  cart.js            shared localStorage cart helpers
  media/             pizza photos, pizza box photos, logos, chef photos

server/            the API
  app.js              Express app + all routes (no .listen — this is what
                      app.test.js requires directly)
  server.js           requires app.js and calls .listen(8090)
  app.test.js         Jest/Supertest suite
  pizzas.json         seed data for the Pizza entity
  toppings.json       seed data for the Topping entity
  states.json         which states have a pride pizza box
  vouchers.json       voucher codes
```

Admin changes (adding/removing a pizza or a state) only update the arrays
held in the running server's memory — they never write back to the `.json`
files. Restarting the server always comes back with the original seed data.

## API documentation

All responses are JSON. There is no authentication on the API itself (the
"admin" login on the client is a cosmetic UI gate, not a real auth layer).

### GET /pizza/list

Returns every pizza.

**Example request**

```
GET /pizza/list
```

**Example response** — `200`

```json
[
  { "id": 1, "name": "Margherita", "price": 8.99, "imageURL": "media/margherita.png", "fancyImageURL": "media/margherita_fancy.webp", "toppings": [1, 8] }
]
```

**Status codes**

| Code | When |
|------|------|
| 200  | Always — even an empty menu returns `200` with `[]`. |

### GET /pizza/detail/:id

Returns one pizza, with `toppings` expanded from ids into full topping
objects.

**Path parameters**

| Name | Type   | Description       |
|------|--------|-------------------|
| id   | number | The pizza's id.   |

**Example request**

```
GET /pizza/detail/1
```

**Example response** — `200`

```json
{
  "id": 1,
  "name": "Margherita",
  "price": 8.99,
  "imageURL": "media/margherita.png",
  "fancyImageURL": "media/margherita_fancy.webp",
  "toppings": [
    { "id": 1, "name": "Mozzarella" },
    { "id": 8, "name": "Basil" }
  ]
}
```

**Status codes**

| Code | When |
|------|------|
| 200  | `id` is a number and a pizza with that id exists. |
| 400  | `id` isn't a number (e.g. `/pizza/detail/abc`), or no pizza has that id. |

### POST /pizza/new

Adds a pizza to the menu.

**Body parameters**

| Name          | Type            | Required | Description                                   |
|---------------|-----------------|----------|------------------------------------------------|
| name          | string          | yes      | Pizza name.                                    |
| price         | number          | yes      | Price in USD.                                  |
| imageURL      | string          | yes      | Path to the regular photo.                     |
| fancyImageURL | string          | yes      | Path to the "fancy" photo used on menu cards.  |
| toppings      | array of number | no       | Topping ids. Defaults to `[]`.                 |

**Example request**

```
POST /pizza/new
Content-Type: application/json

{
  "name": "Veggie",
  "price": 9.49,
  "imageURL": "media/veggie.png",
  "fancyImageURL": "media/veggie_fancy.png",
  "toppings": [3, 5, 6]
}
```

**Example response** — `200` (the full updated pizza list)

```json
[
  { "id": 1, "name": "Margherita", "price": 8.99, "imageURL": "media/margherita.png", "fancyImageURL": "media/margherita_fancy.webp", "toppings": [1, 8] },
  { "id": 7, "name": "Veggie", "price": 9.49, "imageURL": "media/veggie.png", "fancyImageURL": "media/veggie_fancy.png", "toppings": [3, 5, 6] }
]
```

**Status codes**

| Code | When |
|------|------|
| 200  | `name`, `price`, `imageURL` and `fancyImageURL` are present, `price` is a valid number, and every id in `toppings` exists. |
| 400  | A required field is missing, `price` isn't a number, or `toppings` contains an id that isn't a real topping. |

### POST /pizza/remove

Removes a pizza from the menu.

**Body parameters**

| Name | Type   | Required | Description             |
|------|--------|----------|--------------------------|
| id   | number | yes      | Id of the pizza to remove. |

**Example request**

```
POST /pizza/remove
Content-Type: application/json

{ "id": 5 }
```

**Example response** — `200` (the full updated pizza list, with that pizza gone)

**Status codes**

| Code | When |
|------|------|
| 200  | Always. Removing an id that doesn't exist just returns the list unchanged. |

### GET /topping/list

Returns every topping.

**Example request**

```
GET /topping/list
```

**Example response** — `200`

```json
[
  { "id": 1, "name": "Mozzarella" },
  { "id": 2, "name": "Pepperoni" }
]
```

**Status codes**

| Code | When |
|------|------|
| 200  | Always. |

### GET /topping/detail/:id

Returns one topping.

**Path parameters**

| Name | Type   | Description      |
|------|--------|-------------------|
| id   | number | The topping's id. |

**Example request**

```
GET /topping/detail/1
```

**Example response** — `200`

```json
{ "id": 1, "name": "Mozzarella" }
```

**Status codes**

| Code | When |
|------|------|
| 200  | `id` is a number and a topping with that id exists. |
| 400  | `id` isn't a number, or no topping has that id. |

### Other endpoints

Beyond the two required entities, the app also has a small pride-box feature
(`GET /state/list`, `POST /state/new`, `POST /state/remove`, following the
same shape and status codes as the pizza endpoints above) and a read-only
`GET /voucher/list`. These aren't part of the assignment's two-entity
requirement, so they're not documented in full here.
