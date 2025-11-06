const { asyncHandler } = require('../../middleware/requestHandler');
const {
  addPublication,
  deletePublication,
  updatePublications,
  getPublications,
} = require('./index');
const { requiresAuth } = require('../../middleware/requiresAuth');

module.exports = {
  init: (app) => {
    app.post('/api/publication', requiresAuth(1), asyncHandler(addPublication));
    app.get('/api/publication', asyncHandler(getPublications));
    app.put('/api/publication/:id', requiresAuth(1), asyncHandler(updatePublications));
    app.delete('/api/publication/:id', requiresAuth(1), asyncHandler(deletePublication));
  },
};
