require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // Keep this import
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
console.log("MONGO_URI : ", process.env.MONGO_URI)
// Connect to database
connectDB(); // Call the imported connectDB function

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger middleware for /api/auth routes
app.use('/api/auth', (req, res, next) => {
  console.log(`[Auth Request] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from the parent directory

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html')); // Serve index.html from the parent directory
});

// Route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const stockLogRoutes = require('./routes/stockLogRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stock-logs', stockLogRoutes);

// Handle frontend routes
app.get('/backend/backend.php', (req, res) => {
  const action = req.query.action;
  
  // Map PHP-style endpoints to our API routes
  switch (action) {
    case 'get_products':
      return res.redirect('/api/products');
    case 'add_product':
    case 'update_product':
      return res.redirect('/api/products');
    case 'delete_product':
      return res.redirect(`/api/products/${req.query.id}`);
    case 'get_categories':
      return res.redirect('/api/categories');
    case 'add_category':
      return res.redirect('/api/categories');
    case 'get_suppliers':
      return res.redirect('/api/suppliers');
    case 'add_supplier':
      return res.redirect('/api/suppliers');
    case 'get_stock_logs':
      return res.redirect('/api/stock-logs');
    default:
      return res.status(404).json({ status: 'error', message: 'Endpoint not found' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
