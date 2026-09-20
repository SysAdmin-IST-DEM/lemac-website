import type { Request, Response } from 'express';
import * as controller from './controller.js';
import {
  type AddStudentTransactionBody,
} from '@lemac/data-model';
import type { RequestWithBody } from '../../middleware/parseBody.js';

export async function addStudentTransaction(req: RequestWithBody<typeof AddStudentTransactionBody>, res: Response) {
  const data = await controller.addStudentTransaction(
    req.body.type,
    Number(req.body.amount),
    req.body.studentId
  );

  res.send(data)
}

export async function getStudentBalance(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    res.sendStatus(400);
    return;
  }

  const balance = await controller.getSumStudentTransactions(Number(id));

  res.send({ studentId: id, balance });
}

export async function getAllStudentsBalances(req: Request, res: Response) {
  const isDebt = req.query.debt === 'true' || req.query.debt === '1';

  const data = await controller.getAllSumStudentsTransactions(isDebt);

  res.send(data);
}
