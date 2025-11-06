const { asyncHandler } = require('../../middleware/requestHandler');
const { getHours, addHours, deleteHours, updateHours } = require('./index');
const { getHoursFenix } = require('./index');
const { requiresAuth } = require('../../middleware/requiresAuth');

module.exports = {
  init: (app) => {
    app.post('/api/room-hours/fenix', asyncHandler(getHoursFenix));
    app.get('/api/room-hours', asyncHandler(getHours));
    app.post('/api/room-hours', requiresAuth(), asyncHandler(addHours));
    app.delete('/api/room-hours/:id', requiresAuth(), asyncHandler(deleteHours));
    app.put('/api/room-hours/:id', requiresAuth(), asyncHandler(updateHours));
  },
};
