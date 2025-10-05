require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../prisma');

async function main() {
  const [,, usernameArg, passwordArg] = process.argv;
  const username = usernameArg || process.env.ADMIN_USERNAME;
  const password = passwordArg || process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('Usage: node scripts/createAdmin.js <username> <password>');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.userAdmin.upsert({
    where: { username },
    update: { password: hash },
    create: { username, password: hash },
  });

  console.log('Admin ensured:', { id: admin.id, username: admin.username });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
  });


