import express from 'express';

const app = express();
const PORT = 8000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Sportz server is up and running!' });
});

// Start server on port 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
