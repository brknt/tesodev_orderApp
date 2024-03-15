const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');
const { deleteTestCustomer } = require('../controllers/customerController.js');

chai.use(chaiHttp);
const expect = chai.expect;



describe('Customer Authenticatiton', async () => {
    after((done) => {
         deleteTestCustomer();
        done();
    });

    // When customer service first runs, it automatically creates the admin.
    beforeEach((done)=>{
        const admin = {
            email: "admin@gmail.com",
            password: "admin",
        }
        chai.request(app)
            .post('/login')
            .send(admin)
            .then((res)=>{
                expect(res).to.have.status(200);
                done();
            });
    });


    describe('POST /create', () => {
        it('should register/create a new customer', (done) => {
            chai
                .request(app)
                .post('/create')
                .send({
                    name: "testname",
                    email: "test@gmail.com",
                    password: "test1234",
                    address: {
                        addressLine: "testadres",
                        city: "testcity",
                        country: "testcountry",
                        cityCode: 1
                    }
                }).end((err, res) => {
                    customerId = res.body.data.result;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property("code");
                    expect(res.body).to.have.property("data");
                    expect(res.body.data).to.have.property("success", true);
                    expect(res.body.data).to.have.property("result");
                    done();

                });
        });

        it('should register an error if such a customer already exists', (done) => {
            chai
                .request(app)
                .post('/create')
                .send({
                    name: "testname",
                    email: "test@gmail.com",
                    password: "test1234",
                    address: {
                        addressLine: "testadres",
                        city: "testcity",
                        country: "testcountry",
                        cityCode: 1
                    }
                }).end((err, res) => {

                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("result", "Such a customer already exists!");
                    done();
                });
        });
    });

    describe('GET /', () => {
        it('admin should be  getAll', (done) => {
            chai
                .request(app)
                .get('/')
                .then((res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        // it('customer should not getAll', (done) => {
        //     const customer = {
        //         email: "test@gmail.com",
        //         password: "test1234",
        //     }
        //     chai
        //         .request(app)
        //         .post('/login')
        //         .send(customer)
        //         .then((res) => {
        //             expect(res).to.have.status(200);
        //             done();
        //         });
                
        // });
    });

    describe('POST /login', () => {
        it('should return a JWT token for a valid user', (done) => {
            const customer = {
                email: "test@gmail.com",
                password: "test1234",
            }

            chai
                .request(app)
                .post('/login')
                .send(customer)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property("code");
                    expect(res.body).to.have.property("data");
                    expect(res.body.data).to.have.property("success", true);
                    expect(res.body.data).to.have.property("token");
                    done();
                });
        });

        it('should return an error for an invalid customer', (done) => {
            chai
                .request(app)
                .post('/login')
                .send({ email: 'invalidCustomer', password: 'invalidPassword' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property("result", "Invalid email or password");
                    done();
                });
        });
        it('should return an error for an incorrect password', (done) => {
            chai
                .request(app)
                .post('/login')
                .send({ email: 'test@gmail.com', password: 'wrongPassword' })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property("result", "Invalid email or password");
                    done();
                });
        });
    });

   

    describe('PATCH /update/:id', () => {
        it('should update a customer', (done) => {
            const customer = {
                name: "testnameupdate",
                email: "test@gmail.com",
                password: "test1234update",
                address: {
                    addressLine: "testadresupdate",
                    city: "testcityupdate",
                    country: "testcountryupdate",
                    cityCode: 2
                }
            };

            chai
                .request(app)
                .patch(`/update/${customerId}`)
                .send(customer).end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property("code");
                    expect(res.body).to.have.property("data");
                    expect(res.body.data).to.have.property("success", true);
                    done();
                });
        });

        it('If no such customer exists it should an error', (done) => {
            chai
                .request(app)
                .patch(`/update/${customerId}non-id`)
                .send({
                    name: "testnameupdate",
                    email: "test@gmail.com",
                    password: "test1234update",
                    address: {
                        addressLine: "testadresupdate",
                        city: "testcityupdate",
                        country: "testcountryupdate",
                        cityCode: 2
                    }
                }).end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property("result");
                    done();
                })
        })
    });


    


    describe('GET /:id', () => {
        it('should get  a customer with id', (done) => {
            chai
                .request(app)
                .get(`/${customerId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property("code");
                    expect(res.body).to.have.property("data");
                    expect(res.body.data).to.have.property("success", true);
                    expect(res.body.data).to.have.property("result");
                    done();
                });
        });

        it('If no such customer exists it should an error', (done) => {
            chai
                .request(app)
                .get(`/${customerId}non-id`)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("result", "There is no customer registered");
                    done();
                });
        });
    });


  

    describe('GET /logout', () => {
        it('It is a logout for a valid user and the cookie should be cleared.', (done) => {
            chai
                .request(app)
                .get('/logout')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property("code");
                    expect(res.body).to.have.property("data");
                    expect(res.body.data).to.have.property("success", true);
                    expect(res.body.data).to.have.property("result","logout");
                    done();
                });
        });
    });


    describe('DELETE /delete/:id', () => {
        it('should delete a customer', (done) => {
            chai
                .request(app)
                .delete(`/delete/${customerId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.data).to.have.property("success", true);
                    done();
                });
        });

        it('If no such customer exists it should an error', (done) => {
            chai
                .request(app)
                .delete(`/delete/${customerId}non-id`)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property("result", "There is no customer registered");
                    done();
                });
        });
    });



});
