import type { Express } from 'express';

import auth from './auth/routes.js';
import users from './users/routes.js';
import workstations from './workstations/routes.js';
import loghours from './loghours/routes.js';
import printingMaterials from './printing_materials/routes.js';
import printingTasks from './printing_tasks/routes.js';
import entries from './entries/routes.js';
import publications from './publications/routes.js';
import reader from './reader/routes.js';
import roomhours from './rooms/routes.js';
import roomevents from './room_events/routes.js';
import schedule from './schedule/routes.js';
import students from './students/routes.js';

export default {  /*export all routes into the main express file*/
  init: (app: Express) => {
    auth.init(app);
    users.init(app);
    workstations.init(app);
    loghours.init(app);
    printingMaterials.init(app);
    printingTasks.init(app);
    entries.init(app);
    publications.init(app);
    reader.init(app);
    roomhours.init(app);
    roomevents.init(app);
    schedule.init(app);
    students.init(app);
  },
};
