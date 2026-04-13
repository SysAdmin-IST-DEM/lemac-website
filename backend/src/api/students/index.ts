import type { Request, Response } from 'express';
import { createStudentOrNull, getAccessTokenCard } from './services.js';
import * as controller from './controller.js'
import type { RequestWithBody } from '../../middleware/parseBody.js';
import { AssignStudentCardBody } from '@lemac/data-model';

export async function getStudents(req: Request, res: Response) {
  const data = await controller.getAllStudents();
  return res.json(data);
}

export async function assignStudentCard(req: RequestWithBody<typeof AssignStudentCardBody>, res: Response) {
  const data = await controller.addStudentCard(req.body.studentId, req.body.mifareNumber);
  return res.json(data);
}

export async function fenixCallback(req: Request, res: Response) {
  const code = req.query.code;
  if(!code) {
    res.status(400).json({ error: 'Code is required' });
    return;
  }

  try {
    const accessToken = await getAccessTokenCard(code.toString());
    if(!accessToken) {
      res.redirect(process.env.URL + '/student-registration?error=access_token');
      return;
    }

    const data = await createStudentOrNull(accessToken);
    if(!data) {
      res.redirect(process.env.URL + '/student-registration?error=not_dem');
      return;
    }

    const student = await controller.upsertStudent(data.istId, data.name, data.email, data.mifareNumber);

    res.redirect(process.env.URL + `/student-registration?name=${encodeURIComponent(student.name)}&istId=${encodeURIComponent(student.istId)}&renewed=${!isToday(student.createdAt)}&mifare=${data.mifareNumber ? 'true' : 'false'}`);
  } catch (e) {
    console.error(e);
    res.redirect(process.env.URL + '/student-registration?error=unknown');
  }
}

function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}