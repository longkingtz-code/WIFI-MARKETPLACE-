require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {
  initializeDatabase,
  getDatabase,
  saveDatabase
} = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'LONGX WIFI MARKETPLACE API',
    status: 'running',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/packages', (req, res) => {
  try {
    const db = getDatabase();
    const result = db.exec(`
      SELECT * FROM wifi_packages
      WHERE status = 'active'
      ORDER BY id DESC
    `);

    if (!result.length) return res.json([]);

    const packages = result[0].values.map(row => {
      return Object.fromEntries(
        result[0].columns.map((column, index) => [column, row[index]])
      );
    });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  try {
    await initializeDatabase();
    console.log(`LONGX API running at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
});

process.on('SIGINT', () => {
  try {
    saveDatabase();
  } finally {
    process.exit(0);
  }
});
