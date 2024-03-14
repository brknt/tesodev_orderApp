# TESODEV BACKEND CHALLENGE
## _Tech Stack: Node.js, Express, MongoDB, Docker, RabbitMQ_


## This project currently, has three micro-services:

- #### Customer
- POST /create  (register customer)
- PATCH /update (update customer)
- DELETE /delete/:id (delete customer)
- GET / (get all customer)
- GET /:id (get by id customer)
- POST /login (login customer)

- #### Order
- PATCH /update (update order)
- DELETE /delete/:id (delete order)
- GET / (get all order)
- GET /:id (get by id order)
- POST /changeStatus/:id (change status order)

- #### Product
- POST /create (create product)
- GET / (get all product)
- POST /buy/:id (buy product => create order)


## Prerequisites
- [npm](https://www.npmjs.com) and [Node.js](https://nodejs.dev/en/) 
- [Docker](https://www.docker.com)
- [MongoDB](https://www.mongodb.com)
- [RabbitMQ](https://www.rabbitmq.com)

## Postman
- Requires Postman to run the APIs
- Use `Tesodev OrderApp.postman_collection.json` from the repo root and import in your postman.

## Installation and run steps

### on Docker
(_If there are no .env files in the customer, order, and product directories, they need to be added. They have been added for now._)

1. Run `docker-compose build`
2. Run `docker-compose up`. Now you can test the APIs from localhost:8080

### on Localhost
(_If there are no .env files in the customer, order, and product directories, they need to be added. They have been added for now._)

2. Run `npm install` in `customer`, `order`, `product` and `api-gateway` directories.
3. Then run `npm run start:dev` in the customer, order, product and api-gateway directories to run it. And you can test it from localhost:8080.


