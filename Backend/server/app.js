const pacsRoutes = require('./routes/pacsRoutes');

// Add after other route middleware
app.use('/api/pacs', pacsRoutes);