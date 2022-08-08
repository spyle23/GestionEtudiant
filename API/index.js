const http = require('http');
const { headers } = require('./headers');

const { authRoutes } = require('./routes/auth-routes');

const port = process.env.port || 3000;

const server = http.createServer((req, res)=>{
    authRoutes(req.url, req, res);
});

server.listen(port, ()=>{
    console.log('your server is running on port'+port);
})