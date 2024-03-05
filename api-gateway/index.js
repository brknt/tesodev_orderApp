const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');


const proxy = httpProxy.createProxyServer();

const app = express();


app.use(cors({
    origin: 'https://localhost.com'
}))



app.use('customer', (req, res) => {
    proxy.web(req, res, { target: "https://localhost.com/customer:3000" });
});





const port = process.env.PORT || 3003;

app.listen(port, () => {
    console.log(`api-gateway startup on port: ${port}`);
})