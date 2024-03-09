const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 8080;


// customer-service
app.use('/customer', createProxyMiddleware({
    target: 'http://127.0.0.1:8081',
    pathRewrite: {
        '^/customer': ''
    }
}));



// product-service
app.use('/product', createProxyMiddleware({
    target: 'http://127.0.0.1:8082',
    pathRewrite: {
        '^/product': ''
    }
}));


// order-service
app.use('/order', createProxyMiddleware({
    target: 'http://127.0.0.1:8083',
    pathRewrite: {
        '^/order': ''
    }
}));




app.listen(port, () => {
    console.log(`Api-gateway started on port: ${port}`);
});