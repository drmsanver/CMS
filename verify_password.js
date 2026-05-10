const { Client } = require('pg');
const bcrypt = require('bcryptjs');
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
    const resUser = await client.query('SELECT "passwordHash" FROM "User" WHERE email = $1', [adminEmail]);
    
    if (resUser.rows.length === 0) {
      console.log('User not found!');
      return;
    }
    
    const dbHash = resUser.rows[0].passwordHash;
    const testPassword = 'password123';
    
    const isValid = await bcrypt.compare(testPassword, dbHash);
    console.log(`Password 'password123' is valid for ${adminEmail}?`, isValid ? 'YES' : 'NO');

    if (!isValid) {
        console.log('DEBUG: DB Hash is:', dbHash);
        const newHash = await bcrypt.hash(testPassword, 10);
        console.log('DEBUG: New hash of password123 would be:', newHash);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
