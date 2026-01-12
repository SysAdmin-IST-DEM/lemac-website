import * as controller from './controller.js';
import type { Request, Response } from 'express';

export async function loginFenix(req: Request, res: Response) {
  const { code } = req.query;

  if (!code) {
    //no auth code sent by frontend
    res.sendStatus(400);
    return;
  }

  const { user, jwt } = await controller.loginFenix(code.toString());

  if (!user || !jwt) {
    //user is not authorized to login, or login failed
    res.sendStatus(401);
    return;
  }
  res.json({ user, jwt });
}

export async function getFenixData(req: Request, res: Response) {
  const { code } = req.query;
  if (!code) {
    //no auth code sent by frontend
    res.sendStatus(400);
    return;
  }

  const fenixData = await controller.getFenixData(code.toString());

  if (fenixData) {
    res.json(fenixData);
    return;
  }

  res.sendStatus(500);
}

export async function userProfile(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401);

  res.json(req.user);
}
