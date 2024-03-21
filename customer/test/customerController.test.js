const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');
const { deleteTests } = require('../controllers/customerController.js');
const Customer = require('../models/Customer.js');

chai.use(chaiHttp);
const expect = chai.expect;



describe('Admin and Customer Authenticatiton', () => {

    describe('Admin Operations', () => {

        after(async () => {
            await Customer.deleteMany({ email: "admintest@gmail.com" });
            console.log('Test customer created for admin was deleted');
            
        });

        before(async () => {
            const [adminRegister] = await Customer.find({ email: "admin@gmail.com" });
            if (!adminRegister) {
                await Customer.create({
                    name: "admin",
                    email: "admin@gmail.com",
                    password: "admin",
                    role: "admin"
                });
            }
            const adminLogin = {
                email: "admin@gmail.com",
                password: "admin",
            };
            const res = await chai
                .request(app)
                .post('/login')
                .send(adminLogin)

            tokenAdmin = res.body.data.token;
            expect(res, "admin login error:").to.have.status(200);
            console.log('admin logged in > token: ', tokenAdmin);


        });


        describe('POST /create', () => {
            it('[Admin] should register/create a new customer', async () => {
                const res = await chai
                    .request(app)
                    .post('/create')
                    .send({
                        name: "admintestname",
                        email: "admintest@gmail.com",
                        password: "test1234",
                        address: {
                            addressLine: "admintestadres",
                            city: "admintestcity",
                            country: "admintestcountry",
                            cityCode: 1
                        }
                    });

                adminCustomerId = res.body.data.result;
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);
                expect(res.body.data).to.have.property("result");
                console.log('Admin saved customer > adminCustomerId:', adminCustomerId);



            });

            it('[Admin] should register an error if such a customer already exists', async () => {
                const res = await chai
                    .request(app)
                    .post('/create')
                    .send({
                        name: "admintestname",
                        email: "admintest@gmail.com",
                        password: "test1234",
                        address: {
                            addressLine: "admintestline",
                            city: "admintestcity",
                            country: "admintestcountry",
                            cityCode: 1
                        }
                    });

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "Such a customer already exists!");


            });
        });

        describe('GET /', () => {
            it('[Admin] should be  getAll customer', async () => {
                const res = await chai
                    .request(app)
                    .get('/')
                    .set('Cookie', `jwt=${tokenAdmin}`)

                expect(res).to.have.status(200);


            });

        });

        describe('PATCH /update/:id', () => {
            it('[Admin] should update a customer', async () => {
                const customer = {
                    name: "admintestnameupdate",
                    email: "admintest@gmail.com",
                    password: "test1234update",
                    address: {
                        addressLine: "admintestadresupdate",
                        city: "admintestcityupdate",
                        country: "admintestcountryupdate",
                        cityCode: 2
                    }
                };

                const res = await chai
                    .request(app)
                    .patch(`/update/${adminCustomerId}`)
                    .set('Cookie', `jwt=${tokenAdmin}`)
                    .send(customer)

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);


            });

            it('[Admin] If no such customer exists it should an error', async () => {
                const customer = {
                    name: "admintestnameupdate",
                    email: "admintest@gmail.com",
                    password: "test1234update",
                    address: {
                        addressLine: "admintestadresupdate",
                        city: "admintestcityupdate",
                        country: "admintestcountryupdate",
                        cityCode: 2
                    }
                };
                const res = await chai
                    .request(app)
                    .patch(`/update/${adminCustomerId}non-id`)
                    .set('Cookie', `jwt=${tokenAdmin}`)
                    .send(customer)
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("result");
            });
        });

        describe('GET /:id', () => {
            it('[Admin] should get  a customer with id', async () => {
                const res = await chai
                    .request(app)
                    .get(`/${adminCustomerId}`)
                    .set('Cookie', `jwt=${tokenAdmin}`)

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);
                expect(res.body.data).to.have.property("result");

            });

            it('[Admin] If no such customer exists it should an error', async () => {
                const res = await chai
                    .request(app)
                    .get(`/${adminCustomerId}non-id`)
                    .set('Cookie', `jwt=${tokenAdmin}`)

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "There is no customer registered");

            });
        });


        describe('DELETE /delete/:id', () => {
            it('[Admin] should delete a customer', async () => {
                const res = await chai
                    .request(app)
                    .delete(`/delete/${adminCustomerId}`)
                    .set('Cookie', `jwt=${tokenAdmin}`)

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.data).to.have.property("success", true);

            });

            it('[Admin] If no such customer exists it should an error', async () => {
                const res = await chai
                    .request(app)
                    .delete(`/delete/${adminCustomerId}non-id`)
                    .set('Cookie', `jwt=${tokenAdmin}`)

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "There is no customer registered");

            });
        });


        describe('GET /logout', () => {
            it('[Admin] It is a logout for a valid user and the cookie should be cleared.', async () => {
                const res = await chai
                    .request(app)
                    .get('/logout')
                    .set('Cookie', `jwt=${tokenAdmin}`)

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);
                expect(res.body.data).to.have.property("result", "logout");

            });
        });




    });

    describe('Customer Operations', () => {

        after(async () => {
            await Customer.deleteMany({ email: "customertest@gmail.com" });
            console.log('Test customer created for customer was deleted');
        });

        describe('POST /create', () => {
            it('[Customer] should register/create a new customer', async () => {
                const res = await chai
                    .request(app)
                    .post('/create')
                    .send({
                        name: "customertestname",
                        email: "customertest@gmail.com",
                        password: "test1234",
                        address: {
                            addressLine: "customertestadres",
                            city: "customertestcity",
                            country: "custumertestcountry",
                            cityCode: 1
                        }
                    });

                customerId = res.body.data.result;
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);
                expect(res.body.data).to.have.property("result");
                console.log('Customer saved customer > custumerId:', customerId);
            });

            it('[Customer] should register an error if such a customer already exists', async () => {
                const res = await chai
                    .request(app)
                    .post('/create')
                    .send({
                        name: "customertestname",
                        email: "customertest@gmail.com",
                        password: "test1234",
                        address: {
                            addressLine: "customertestadres",
                            city: "customertestcity",
                            country: "custumertestcountry",
                            cityCode: 1
                        }
                    });

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "Such a customer already exists!");


            });
        });

        describe('POST /login', () => {
            it('[Customer] should return a JWT token for a valid user', async () => {
                const customer = {
                    email: "customertest@gmail.com",
                    password: "test1234",
                }

                const res = await chai
                    .request(app)
                    .post('/login')
                    .send(customer)

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);
                expect(res.body.data).to.have.property("token");

                tokenCustomer = res.body.data.token;
                console.log('customer logged in > token: ', tokenCustomer);


            });

            it('[Customer] should return an error for an invalid customer', async () => {
                const res = await chai
                    .request(app)
                    .post('/login')
                    .send({ email: 'invalidCustomer', password: 'invalidPassword' })

                expect(res).to.have.status(401);
                expect(res.body).to.have.property("result", "Invalid email or password");

            });

            it('[Customer] should return an error for an incorrect password', async () => {
                const res = await chai
                    .request(app)
                    .post('/login')
                    .send({ email: 'customertest@gmail.com', password: 'wrongPassword' })

                expect(res).to.have.status(401);
                expect(res.body).to.have.property("result", "Invalid email or password");

            });
        });


        describe('GET /', () => {
            it('[Customer] customer should not be  getAll customer', async () => {
                const res = await chai
                    .request(app)
                    .get('/')
                    .set('Cookie', `jwt=${tokenCustomer}`)

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "You cant do it!");

            });
        });


        describe('PATCH /update/:id', () => {
            it('[Customer] customer should update herself/himself', async () => {
                const customer = {
                    name: "customertestnameupdate",
                    email: "customertest@gmail.com",
                    password: "test1234update",
                    address: {
                        addressLine: "customertestadresupdate",
                        city: "customertestcityupdate",
                        country: "custumertestcountryupdate",
                        cityCode: 1
                    }

                };

                const res = await chai
                    .request(app)
                    .patch(`/update/${customerId}`)
                    .set('Cookie', `jwt=${tokenCustomer}`)
                    .send(customer)

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);


            });

            it('[Customer] customer should not update another customer', async () => {
                const customer = {
                    name: "customertestnameupdate",
                    email: "customertest@gmail.com",
                    password: "test1234update",
                    address: {
                        addressLine: "customertestadresupdate",
                        city: "customertestcityupdate",
                        country: "custumertestcountryupdate",
                        cityCode: 1
                    }
                };
                const res = await chai
                    .request(app)
                    .patch(`/update/${customerId}non-id`)
                    .set('Cookie', `jwt=${tokenCustomer}`)
                    .send(customer)
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "You cant do it!");
            });
        });



        describe('GET /:id', () => {
            it('[Customer] should getId with own id', async () => {
                const res = await chai
                    .request(app)
                    .get(`/${customerId}`)
                    .set('Cookie', `jwt=${tokenCustomer}`)

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);
                expect(res.body.data).to.have.property("result");

            });

            it('[Customer] If no such customer exists it should an error', async () => {
                const res = await chai
                    .request(app)
                    .get(`/${customerId}non-id`)
                    .set('Cookie', `jwt=${tokenCustomer}`)

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "There is no customer registered");

            });
        });

        describe('DELETE /delete/:id', () => {
            it('[Customer] should not delete a customer', async () => {
                const res = await chai
                    .request(app)
                    .delete(`/delete/${customerId}`)
                    .set('Cookie', `jwt=${tokenCustomer}`)

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "You cant do it!");

            });

        });


        describe('GET /logout', () => {
            it('[Customer] It is a logout for a valid user and the cookie should be cleared.', async () => {
                const res = await chai
                    .request(app)
                    .get('/logout')
                    .set('Cookie', `jwt=${tokenCustomer}`)

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property("code");
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("success", true);
                expect(res.body.data).to.have.property("result", "logout");

            });
        });




    });




});
