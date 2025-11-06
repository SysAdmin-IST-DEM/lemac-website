const { asyncHandler } = require('../../middleware/requestHandler');
const {
  addWorkstation,
  getWorkstations,
  updateWorkstation,
  deleteWorkstation,
} = require('./index');
const { requiresAuth } = require('../../middleware/requiresAuth');

module.exports = {
  init: (app) => {
    app.post('/api/workstations', requiresAuth(1), asyncHandler(addWorkstation));
    app.get('/api/workstations', asyncHandler(getWorkstations));
    app.put('/api/workstations/:id', requiresAuth(), asyncHandler(updateWorkstation));
    app.delete('/api/workstations/:id', requiresAuth(1), asyncHandler(deleteWorkstation));
  },
};
