import * as controller from './controller.js';
import type { Request, Response } from 'express';

export async function addPrintingTask(req: Request, res: Response) {
  const body = req.body;
  if(!body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

}

export async function getPrintingTasks(req: Request, res: Response) {
  const body = req.body;
  if(!body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

}