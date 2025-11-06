const { asyncHandler } = require('../../middleware/requestHandler');
const { addEntries, deleteEntrie, updateEntrie, getEntries } = require('./index');
const { requiresAuth } = require('../../middleware/requiresAuth');

module.exports = {
  init: (app) => {
    app.post('/api/entries', requiresAuth(), asyncHandler(addEntries));
    app.delete('/api/entries/:id', requiresAuth(), asyncHandler(deleteEntrie));
    app.put('/api/entries/:id', requiresAuth(), asyncHandler(updateEntrie));
    app.get('/api/entries', requiresAuth(), asyncHandler(getEntries));
  },
};
