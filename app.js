const express = require('express');
const config = require('./config/appconfig.js');

const app = express();
const port = config.port;

app.use(express.json());
const routes = require('./routes.js').exposeRoutes(app);

app.listen(port, () => {
    console.log(`Express server listening on port http://localhost:${port}`);
})


