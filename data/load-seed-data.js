const client = require('../lib/client');
// import our seed data:
const planets = require('./planets.js');
const particles = require('./particles.js');
const usersData = require('./users.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        // return client.query(`
        // INSERT INTO planets (name, moons, rings, type)
        // INSERT INTO planets (name, family, discovered, charge)
        // VALUES ($1, $2, $3, $4);
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

    await Promise.all(
      particles.map(particle => {
        return client.query(`
                    INSERT INTO particles (name, family, discovered, charge, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [particle.name, particle.family, particle.discovered, particle.charge, user.id]);
      })
    );
    

    // console.log('seed data load complete');
  }
  catch(err) {
    // console.log(err);
  }
  finally {
    client.end();
  }
    
}
