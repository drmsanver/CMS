const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Database');

    const resCount = await client.query('SELECT COUNT(*) FROM "User"');
    console.log('Total User Count:', resCount.rows[0].count);

    if (resCount.rows[0].count > 0) {
      const resUsers = await client.query('SELECT id, email, name, role FROM "User" LIMIT 10');
      console.log('Sample Users:');
      console.table(resUsers.rows);
    } else {
      console.log('Warning: User table is empty!');
    }

    const resAdmin = await client.query('SELECT id, email, name, role FROM "User" WHERE role = \'SUPER_ADMIN\'');
    if (resAdmin.rows.length > 0) {
      console.log('SUPER_ADMIN found:');
      console.table(resAdmin.rows);
    } else {
      console.log('NO SUPER_ADMIN FOUND IN DATABASE.');
    }

  } catch (err) {
    console.error('Error connecting to DB:', err);
  } finally {
    await client.end();
  }
}

main();
