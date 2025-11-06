const { asyncHandler } = require('../../middleware/requestHandler');
const {
  createEvent,
  editEvent,
  getEvents,
  deleteEvents,
  getUserTargets,
  setUserTarget,
  getOffDays,
  setOffDay,
  deleteOffDay,
  editUserTarget,
  deleteTarget,
} = require('./index');
const { requiresAuth } = require('../../middleware/requiresAuth');

module.exports = {
  init: (app) => {
    app.get('/api/schedule', requiresAuth(), asyncHandler(getEvents));
    app.post('/api/schedule', requiresAuth(), asyncHandler(createEvent));
    app.put('/api/schedule/:id', requiresAuth(), asyncHandler(editEvent));
    app.delete('/api/schedule/:id', requiresAuth(), asyncHandler(deleteEvents));
    app.post('/api/schedule/targets', requiresAuth(1), asyncHandler(setUserTarget));
    app.put('/api/schedule/targets/:id', requiresAuth(1), asyncHandler(editUserTarget));
    app.delete('/api/schedule/targets/:id', requiresAuth(1), asyncHandler(deleteTarget));
    app.get('/api/schedule/targets', requiresAuth(), asyncHandler(getUserTargets));
    app.get('/api/schedule/off_days', requiresAuth(), asyncHandler(getOffDays));
    app.post('/api/schedule/off_days', requiresAuth(1), asyncHandler(setOffDay));
    app.delete('/api/schedule/off_days/:id', requiresAuth(1), asyncHandler(deleteOffDay));
  },
};
