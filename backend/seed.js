const { initializeDatabase, getDatabase, saveDatabase } = require('./src/config/db');

async function seed() {
  await initializeDatabase();
  const db = getDatabase();

  db.run(`
    INSERT INTO wifi_packages
    (name, price, duration_hours, description)
    VALUES
    ('LONGX Daily', 1000, 24, 'Internet access for 24 hours'),
    ('LONGX Weekly', 5000, 168, 'Internet access for 7 days'),
    ('LONGX Monthly', 20000, 720, 'Internet access for 30 days')
  `);

  saveDatabase();
  console.log('3 LONGX demo packages added successfully.');
}

seed();
