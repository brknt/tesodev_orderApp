const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');
const { deleteTestCustomer } = require('../controllers/customerController.js');

chai.use(chaiHttp);
const expect = chai.expect;



describe('Customer Authenticatiton', async () => {
    // after((done) => {
    //      deleteTestCustomer();
    //     done();
    // });

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

    describe(`PATCH /update/:id`, () => {
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
    })

});
