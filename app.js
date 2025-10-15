
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

// Load environment variables early
dotenv.config();

const app = express();

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/productsRoute');
const employeesRoute = require('./routes/employees');
const storesRoute = require('./routes/stores');

// Remove unwanted Swagger paths
delete swaggerDocument.paths['/auth/google'];
delete swaggerDocument.paths['/auth/google/callback'];

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Route mounting
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/employees', employeesRoute);
app.use('/stores', storesRoute);

// Swagger API docs
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      withCredentials: true,
      persistAuthorization: true,
    },
  })
);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3300;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
  });
