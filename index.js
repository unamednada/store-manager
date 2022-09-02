require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const productsRouter = require('./routers/productsRouter');
const salesRouter = require('./routers/salesRouter');

const app = express();
app.use(bodyParser.json());
app.use('/products', productsRouter);
app.use('/sales', salesRouter);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT || 3001}`);
});
