const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;
const app = next({ dev, hostname, port});
const handle = app.getRequestHandler();


const httpsOptions = {
  key: fs.readFileSync('./certificates/commercial.key'),
  cert: fs.readFileSync('./certificates/STAR_sakafarma_com.crt')
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);

  }).listen(port, err => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3001');
  });
});
