const { asyncHandler } = require('../../middleware/requestHandler');
const { addUser, getUsers, updateUser, deleteUser } = require('./index');
const { requiresAuth } = require('../../middleware/requiresAuth');

module.exports = {
  init: (app) => {
    app.post('/api/users', requiresAuth(1), asyncHandler(addUser));
    app.get('/api/users', requiresAuth(), asyncHandler(getUsers));
    app.put('/api/users/:id', requiresAuth(1), asyncHandler(updateUser));
    app.delete('/api/users/:id', requiresAuth(1), asyncHandler(deleteUser));
  },
};
