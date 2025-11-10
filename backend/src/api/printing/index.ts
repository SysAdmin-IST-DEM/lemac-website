import * as controller from './controller.js';
import type { Request, Response } from 'express';

export async function addTask(req: Request, res: Response) {
  const body = req.body;
  if(!body) {
    return res.status(400).json({ error: 'Request body is required' });
  }
  /*
    BODY:
      firstName
      lastName
      studentID
      email
      unit
      modelURL
      material
      price
      notes
  */
  //const result = await controller.addTask(body);
}