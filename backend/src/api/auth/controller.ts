import * as services from './services.js';

export async function loginFenix(code: string) {
  const accessToken = await services.loginFenix(code);
  if (!accessToken) return {};

  const istId = await services.returnIstId(accessToken);
  if (!istId) return {};

  const user = await services.getUser(istId);
  if (!user) return {};

  const jwt = services.createJWT(user);

  return { user, jwt };
}

export async function getFenixData(code: string) {
  const accessToken = await services.loginFenixData(code);
  if (!accessToken) return {};

  return await services.returnIstData(accessToken);
}
