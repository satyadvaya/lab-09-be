require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

// get all planets
app.get('/planets', async(req, res) => {

  console.log(req.headers);
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

  res.json(data.rows[0]);
});

// create a planet
app.post('/planets/', async(req, res) => {
  try {
    const data = await client.query(
      `insert into planets (name, moons, rings, type, owner_id)
      values ($1, $2, $3, $4, $5)
      returning *;`,
      [req.body.name, req.body.moons, req.body.rings, req.body.type, req.body.owner_id]
    );

    res.json(data.rows[0]);
  } catch(e) {
    console.error(e);
    res.json(e);
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
