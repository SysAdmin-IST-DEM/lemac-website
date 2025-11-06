const { asyncHandler } = require('../../middleware/requestHandler');
const {
  addHours,
  getHours,
  getIndividualHours,
  deleteHours,
  updateHours,
  getSum,
  lastEntry,
} = require('./index');
const { requiresAuth } = require('../../middleware/requiresAuth');

module.exports = {
  init: (app) => {
    app.post('/api/loghours', requiresAuth(), asyncHandler(addHours));
    app.get('/api/loghours', requiresAuth(1), asyncHandler(getHours));
    app.get('/api/loghours/self', requiresAuth(), asyncHandler(getIndividualHours));
    app.put('/api/loghours/:id', requiresAuth(), asyncHandler(updateHours));
    app.delete('/api/loghours/:id', requiresAuth(), asyncHandler(deleteHours));
    app.get('/api/loghours/sum', requiresAuth(1), asyncHandler(getSum));
    app.get('/api/loghours/lastEntry', requiresAuth(1), asyncHandler(lastEntry));
  },
};
