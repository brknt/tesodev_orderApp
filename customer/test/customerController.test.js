const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');
const { deleteTests } = require('../controllers/customerController.js');

chai.use(chaiHttp);
const expect = chai.expect;



describe('Admin and Customer Authenticatiton', () => {

    describe('Admin Operations', () => {

        after(async () => {
            await deleteTests();

        });

        before(async () => {
            const admin = {
                email: "admin@gmail.com",
                password: "admin",
            };
            const res = await chai
                .request(app)
                .post('/login')
                .send(admin)

            tokenAdmin = res.body.data.token;
            expect(res, "admin login error:").to.have.status(200);
            console.log('admin logged in > token: ', tokenAdmin);


        });
        describe('POST /create', () => {
            it('[Admin] should register/create a new customer', async () => {
                const res = await chai
                    .request(app)
                    .post('/create')
                    .set('Cookie', `jwt=${tokenAdmin}`)
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
                    .set('Cookie', `jwt=${tokenAdmin}`)
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
            it('[Admin] should be  getAll', async () => {
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
            it('should get  a customer with id', async () => {
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

            it('If no such customer exists it should an error', async () => {
                const res = await chai
                    .request(app)
                    .get(`/${adminCustomerId}non-id`)
                    .set('Cookie',`jwt=${tokenAdmin}`)

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "There is no customer registered");

            });
        });

        // describe('GET /logout', () => {
        //     it('It is a logout for a valid user and the cookie should be cleared.', (done) => {
        //         chai
        //             .request(app)
        //             .get('/logout')
        //             .end((err, res) => {
        //                 expect(res).to.have.status(200);
        //                 expect(res.body).to.be.a('object');
        //                 expect(res.body).to.have.property("code");
        //                 expect(res.body).to.have.property("data");
        //                 expect(res.body.data).to.have.property("success", true);
        //                 expect(res.body.data).to.have.property("result","logout");
        //                 done();
        //             });
        //     });
        // });


        // describe('DELETE /delete/:id', () => {
        //     it('should delete a customer', (done) => {
        //         chai
        //             .request(app)
        //             .delete(`/delete/${customerId}`)
        //             .end((err, res) => {
        //                 expect(res).to.have.status(200);
        //                 expect(res.body).to.be.a('object');
        //                 expect(res.body.data).to.have.property("success", true);
        //                 done();
        //             });
        //     });

        //     it('If no such customer exists it should an error', (done) => {
        //         chai
        //             .request(app)
        //             .delete(`/delete/${customerId}non-id`)
        //             .end((err, res) => {
        //                 expect(res).to.have.status(400);
        //                 expect(res.body).to.have.property("result", "There is no customer registered");
        //                 done();
        //             });
        //     });
        // });


    });

    // describe('Customer Operations', ()=>{

    // });




});
