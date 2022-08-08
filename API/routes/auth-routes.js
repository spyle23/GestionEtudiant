const { auth } = require("../controller/auth-controller");
const { headers } = require("../headers");

const authRoutes = (url, req, res) => {
    if(req.method === 'OPTIONS'){
        res.writeHead(200, headers);
        res.end();
    }
    if (url === '/auth/register' && req.method === 'POST') {
        auth.register(req, res);
    }else if(url == '/auth/login' && req.method === 'POST'){
        auth.login(req, res);
    }else if(url == '/liste' && req.method === 'GET' ){
        auth.getListe(req, res);
    }else if((url.split('/')[2]!=undefined && url.split('/')[2]!='login') && req.method === 'GET'){
        auth.getUserById(req, res, url.split('/')[2]);
    }else if(req.method!='OPTIONS'){
        res.writeHead(404, headers);
        res.write(JSON.stringify({message: 'page not found'}));
        res.end();
    }
}

module.exports = { authRoutes }