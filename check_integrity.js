const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const adminEmail = 'admin@school.com';
    const resUser = await client.query('SELECT * FROM "User" WHERE email = $1', [adminEmail]);
    
    if (resUser.rows.length === 0) {
      console.log('User not found!');
      return;
    }
    
    const user = resUser.rows[0];
    console.log('User found:', user.email);
    console.log('Org ID:', user.organizationId);
    console.log('Campus ID:', user.campusId);

    const resOrg = await client.query('SELECT name FROM "Organization" WHERE id = $1', [user.organizationId]);
    console.log('Organization exists?', resOrg.rows.length > 0 ? 'YES (' + resOrg.rows[0].name + ')' : 'NO');

    const resCampus = await client.query('SELECT name FROM "Campus" WHERE id = $1', [user.campusId]);
    console.log('Campus exists?', resCampus.rows.length > 0 ? 'YES (' + resCampus.rows[0].name + ')' : 'NO');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
