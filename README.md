# TESODEV BACKEND CHALLENGE
## _Tech Stack: Node.js, Express, MongoDB, Docker, RabbitMQ_


This project currently, has three micro-services

### Customer :
- POST /create  (register customer)
- PATCH /update (update customer)
- DELETE /delete/:id (delete customer)
- GET / (get all customer)
- GET /:id (get by id customer)
- POST /login (login customer)

### Order :
- PATCH /update (update order)
- DELETE /delete/:id (delete order)
- GET / (get all order)
- GET /:id (get by id order)
- POST /changeStatus/:id (change status order)

### Product :
- POST /create (create product)
- GET / (get all product)
- POST /buy/:id (buy product => create order)


### Prerequisites
- npm and node
- Docker
- MongoDB
- RabbitMQ

### Postman
- Requires Postman to run the APIs
- Use `tesodevOrderApp demo.postman_collection.json` from the repo root and import in your postman.
