// Simple script to check registered routes
const authRoutes = require('./routes/auth.js');

// Get all registered routes
const routes = authRoutes._router.stack
  .filter(r => r.route)
  .map(r => ({
    method: Object.keys(r.route.methods)[0].toUpperCase(),
    path: r.route.path
  }));

console.log('Registered auth routes:');
console.log(JSON.stringify(routes, null, 2)); 