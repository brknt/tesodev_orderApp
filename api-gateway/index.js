const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 8080;


let customerTarget="http://customer:8081";
let orderTarget="http://order:8083";
let productTarget="http://product:8082";

if (process.env.NODE_ENV === 'test' ||process.env.NODE_ENV === 'dev' ) {
    customerTarget = "http://127.0.0.1:8081";
    productTarget="http://127.0.0.1:8082";
    orderTarget="http://127.0.0.1:8083";
  }


// customer-service
app.use('/customer', createProxyMiddleware({
    target: customerTarget,
    pathRewrite: {
        '^/customer': ''
    }
}));



// product-service
app.use('/product', createProxyMiddleware({
    target: productTarget,
    pathRewrite: {
        '^/product': ''
    }
}));


// order-service
app.use('/order', createProxyMiddleware({
    target: orderTarget,
    pathRewrite: {
        '^/order': ''
    }
}));




app.listen(port, () => {
    console.log(`Api-gateway started on port: ${port}`);
});