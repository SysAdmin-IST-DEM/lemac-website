const { asyncHandler } = require('../../middleware/requestHandler');
const { createEvent, editEvent, getEvents, deleteEvents } = require('./index');
const { requiresAuth } = require('../../middleware/requiresAuth');

module.exports = {
  init: (app) => {
    app.get('/api/room-events', requiresAuth(), asyncHandler(getEvents));
    app.post('/api/room-events', requiresAuth(), asyncHandler(createEvent));
    app.put('/api/room-events/:id', requiresAuth(), asyncHandler(editEvent));
    app.delete('/api/room-events/:id', requiresAuth(), asyncHandler(deleteEvents));
  },
};
