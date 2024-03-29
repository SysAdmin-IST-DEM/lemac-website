module.exports = {
  addWorkstation: async (database, workstation) => {
    try {
      //inserts in db
      await database.execute(
        'INSERT INTO workstations (name, type, capacity) VALUES ( ? , ? , ? )',
        [workstation.name, workstation.type, workstation.capacity]
      );
      //gets inserted
      const [results] = await database.execute(
        'SELECT * FROM workstations WHERE id=LAST_INSERT_ID()'
      );
      return results[0];
    } catch (e) {
      return e.code;
    }
  },

  getWorkstations: async (database) => {
    try {
      const [results] = await database.execute('SELECT * FROM workstations');
      return results;
    } catch (e) {
      console.error(e);
      return;
    }
  },

  updateWorkstation: async (database, workstationId, workstation) => {
    try {
      console.log(JSON.stringify(workstation.softwares));

      await database.execute(
        'UPDATE workstations SET name = ?, capacity = ?, type = ?, software = ?, problems = ? WHERE id = ?',
        [
          workstation.name,
          workstation.capacity,
          workstation.type,
          JSON.stringify(workstation.softwares),
          JSON.stringify(workstation.problems),
          workstationId,
        ]
      );
      const [results] = await database.execute('SELECT * FROM workstations WHERE id = ?', [
        workstationId,
      ]);
      return results[0];
    } catch (e) {
      return e.code;
    }
  },

  deleteWorkstation: async (database, workstationId) => {
    try {
      const [results] = await database.execute('SELECT * FROM workstations WHERE id = ?', [
        workstationId,
      ]);
      if (results.length === 0) return false;
      await database.execute('DELETE FROM workstations WHERE id = ?', [workstationId]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },

  checkWorkstation: async (database, workstationId) => {
    try {
      const [results] = await database.execute('SELECT * FROM workstations WHERE id = ?', [
        workstationId,
      ]);
      if (results.length === 0) return false;
      if (results[0].occupation < results[0].capacity) return true;
      else return false;
    } catch (e) {
      console.error(e);
    }
  },

  changeOccupation: async (database, workstationId, change) => {
    try {
      const [results] = await database.execute('SELECT * FROM workstations WHERE id = ?', [
        workstationId,
      ]);
      await database.execute('UPDATE workstations SET occupation = ? WHERE id = ?', [
        results[0].occupation + change,
        workstationId,
      ]);
    } catch (e) {
      console.error(e);
    }
  },
};
