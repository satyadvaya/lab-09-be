require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

// get all planets
app.get('/planets', async(req, res) => {
  const data = await client.query('SELECT * from planets');

  res.json(data.rows);
});

// get JUST ONE planet
app.get('/planets/:id', async(req, res) => {
  const id = req.params.id;
  const data = await client.query(
    'SELECT * from planets where id=$1',
    [id]
  );

  res.json(data.rows);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
