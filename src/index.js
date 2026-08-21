import express from 'express';

const app = express();
const PORT = 8000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Root endpoint
app.use('/matches', matchRouter);

// Start server on port 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
