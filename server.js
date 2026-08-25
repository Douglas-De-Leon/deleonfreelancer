import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(__dirname));

// Custom fallback for any assets requested with encoded or decoded names
app.get('/assets/:filename', (req, res, next) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(__dirname, 'assets', filename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`De LeOn server running on http://0.0.0.0:${PORT}`);
});
