const client = require('../lib/client');
// import our seed data:
const planets = require('./planets.js');
const usersData = require('./users.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      planets.map(planet => {
        return client.query(`
                    INSERT INTO planets (name, moons, rings, type, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [planet.name, planet.moons, planet.rings, planet.type, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
