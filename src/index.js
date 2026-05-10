const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        res.statusCode = 204;
        res.end();
        return;
    }

    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const params = url.searchParams;
        const paramKeys = Array.from(params.keys());
        
        if (paramKeys.length === 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Hello, World!');
            return;
        }
        
        if (paramKeys.length === 1 && params.has('hello')) {
            const name = params.get('hello');
            
            if (!name || name.trim() === '') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Enter a name');
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Hello, ${name}!`);
            return;
        }
        
        if (paramKeys.length === 1 && params.has('users')) {
            const usersPath = path.join(__dirname, '..', 'data', 'users.json');
            
            fs.readFile(usersPath, 'utf8', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end();
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
            });
            return;
        }
        res.statusCode = 500;
        res.end();
        
    } catch (err) {
        res.statusCode = 500;
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});