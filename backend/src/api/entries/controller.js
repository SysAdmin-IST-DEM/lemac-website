module.exports = {
  addEntries: async (database, istId, workstationId) => {
    try {
      await database.execute('INSERT INTO `entries` (ist_id, workstation_id) VALUES ( ? , ? )', [
        istId,
        workstationId,
      ]);

      const [results] = await database.execute(
        'SELECT entries.*, workstations.name FROM `entries` LEFT JOIN workstations ON entries.workstation_id = workstations.id WHERE entries.id=LAST_INSERT_ID()'
      );

      return results[0];
    } catch (e) {
      console.error(e);
      return;
    }
  },
  updateEntrieObservation: async (database, entrieId, observation, worksationId, istId) => {
    //update observation only
    try {
      await database.execute('UPDATE entries SET observations = ?, workstation_id = ?, ist_id = ? WHERE id = ?', [
        observation,
        worksationId,
        istId,
        entrieId,
      ]);
      const [
        results,
      ] = await database.execute(
        'SELECT entries.*, workstations.name FROM entries LEFT JOIN workstations ON entries.workstation_id = workstations.id WHERE entries.id= ?',
        [entrieId]
      );
      return results[0];
    } catch (e) {
      console.error(e);
    }
  },
  updateEntrie: async (database, entrieId) => {
    try {
      await database.execute('UPDATE entries SET active = 0, closed_at = now() WHERE id = ?', [entrieId]);
      const [
        results,
      ] = await database.execute(
        'SELECT entries.*, workstations.name FROM entries LEFT JOIN workstations ON entries.workstation_id = workstations.id WHERE entries.id= ?',
        [entrieId]
      );
      return results[0];
    } catch (e) {
      console.error(e);
    }
  },
  getEntries: async (database, active = 0) => {
    // if active = 0 then all entries will be shown (there is no extra query), if = 1 only active entries will be shown
    try {
      if (active == 0) {
        const [results] = await database.execute(
          'SELECT entries.*, workstations.name FROM entries LEFT JOIN workstations ON entries.workstation_id = workstations.id'
        );
        return results;
      } else if (active == 1) {
        const [results] = await database.execute(
          'SELECT entries.*, workstations.name FROM entries LEFT JOIN workstations ON entries.workstation_id = workstations.id  WHERE active = 1'
        );
        return results;
      } else return;
    } catch (e) {
      console.error(e);
      return;
    }
  },
  deleteEntrie: async (database, entrieId) => {
    try {
      const [results] = await database.execute('SELECT * FROM entries WHERE id = ?', [entrieId]);
      if (results.length === 0) return false;
      await database.execute('DELETE FROM entries WHERE id = ?', [entrieId]);
      return true;
    } catch (e) {
      console.error(e);
    }
  },
  getEntrie: async (database, entrieId) => {
    try {
      const [results] = await database.execute('SELECT * FROM entries WHERE id = ?', [entrieId]);
      return results[0];
    } catch (e) {
      console.error(e);
    }
  },
};
