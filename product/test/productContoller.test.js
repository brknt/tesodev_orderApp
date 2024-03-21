const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');
const Product = require('../models/Product.js');

chai.use(chaiHttp);
const expect = chai.expect;



describe('Admin and Customer Product Operations', () => {

    describe('Admin operations for PRODUCT', () => {
        after(async () => {
            await chai
                .request("http://127.0.0.1:8081")
                .get('/logout');
            await Product.deleteMany({ _id: adminProductId });
            console.log('[admin]test product deleted');
        });
        before(async () => {

            const admin = {
                email: "admin@gmail.com",
                password: "admin"
            };

            await chai
                .request("http://127.0.0.1:8081")
                .post('/login')
                .send(admin)
                .then((res) => {
                    tokenAdmin = res.body.data.token;
                    expect(res, "admin login error:").to.have.status(200);
                    console.log('admin logged in > token: ', tokenAdmin);

                }).catch((err) => {
                    if (err) {
                        console.log('Customer service is not up!');
                    }
                })






        });

        describe('POST /create', () => {
            it('[Admin] should create a new product', async () => {
                const product = {
                    name: "adminProduct1",
                    price: 44.5,
                    imageUrl: "adminurl1"
                };
                const res = await chai
                    .request(app)
                    .post('/create')
                    .send(product)
                    .set('Cookie', `jwt=${tokenAdmin}`);
                adminProductId = res.body.data.result._id;
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('code');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('success', true);
                expect(res.body.data).to.have.property('result');



            });
        });

        describe('GET /', () => {
            it('[Admin] should be  getAll product', async () => {
                const res = await chai
                    .request(app)
                    .get('/')
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.data).to.have.property('result');
                expect(res.body.data.result).to.be.a('array');
            });

        });

        describe('POST /buy', () => {
            it('[Admin] should not buy/(create order) products', async () => {
                const data = {
                    address: {
                        addressLine: "lineadmintest",
                        city: "cityadmintest",
                        country: "countryadmintest",
                        cityCode: 1233
                    },
                    ids: [
                        { _id: adminProductId },
                    ]
                };

                const res = await chai
                    .request(app)
                    .post('/buy')
                    .set('Cookie', `jwt=${tokenAdmin}`)
                    .send(data);

                expect(res).to.have.status(400);
                expect(res.body).to.have.property("result", "You cant do it!");

            });
        });


    });
    describe('Customer operations for PRODUCT', () => {
        var customerId;
        after(async () => {
            await chai
                .request("http://127.0.0.1:8081")
                .get('/logout');
            await Product.deleteMany({ _id: customerProductId });
            console.log('[customer]test product deleted');

            await chai
                .request("http://127.0.0.1:8081")
                .post('/login')
                .send({
                    email: "admin@gmail.com",
                    password: "admin"
                    
                }).then((res)=>{
                    tokenAdmin2 = res.body.data.token;
                    expect(res).to.have.status(200);
                })

            await chai
                .request("http://127.0.0.1:8081")
                .delete(`/delete/${customerId}`)
                .set('Cookie', `jwt=${tokenAdmin2}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                })

        });
        before(async () => {

            const customer = {
                name: "customerproducttest@gmail.com",
                email: "customerproducttest@gmail.com",
                password: "test1234",
                address: {
                    addressLine: "line",
                    city: "customertestcity",
                    country: "custumertestcountry",
                    cityCode: 1
                }
            };

            await chai
                .request("http://127.0.0.1:8081")
                .post('/create')
                .send(customer)
                .then((res) => {
                    customerId = res.body.data.result;
                    console.log('IDDD::', customerId);

                    expect(res).to.have.status(201);
                });

            await chai
                .request("http://127.0.0.1:8081")
                .post('/login')
                .send({
                    email: customer.email,
                    password: customer.password
                })
                .then((res) => {
                    tokenCustomer = res.body.data.token;
                    expect(res, "customer login error:").to.have.status(200);

                }).catch((err) => {
                    if (err) {
                        console.log('Customer service is not up!');
                    }
                })






        });

        describe('POST /create', () => {
            it('[Customer] should create a new product', async () => {
                const product = {
                    name: "customerProduct1",
                    price: 45.2,
                    imageUrl: "customerurl1"
                };
                const res = await chai
                    .request(app)
                    .post('/create')
                    .send(product)
                    .set('Cookie', `jwt=${tokenCustomer}`);
                customerProductId = res.body.data.result._id;
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('code');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('success', true);
                expect(res.body.data).to.have.property('result');



            });
        });


    });



});
