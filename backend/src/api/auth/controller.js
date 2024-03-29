const services = require('./services');

module.exports = {
  loginFenix: async (database, code) => {
    const accessToken = await services.loginFenix(code);
    if (!accessToken) return {};

    const istId = await services.returnIstId(accessToken);
    if (!istId) return {};

    const user = await services.getUser(istId, database);
    if (!user) return {};

    const jwt = services.createJWT(user);

    return { user, jwt };
  },
  getFenixData: async (code) => {
    const accessToken = await services.loginFenixData(code);
    if (!accessToken) return {};

    const fenixData = await services.returnIstData(accessToken);

    return fenixData;
  },
};
