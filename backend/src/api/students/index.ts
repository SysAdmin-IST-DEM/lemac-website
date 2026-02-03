import type { Request, Response } from 'express';
import { createStudentOrNull, getAccessTokenCard } from './services.js';
import { upsertStudent } from './controller.js';

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
    console.log("WOW", data);

    const student = await upsertStudent(data.istId, data.name, data.email, data.mifareNumber);

    res.redirect(process.env.URL + `/student-registration?name=${encodeURIComponent(student.name)}&istId=${encodeURIComponent(student.istId)}`);
  } catch (e) {
    console.error(e);
    res.redirect(process.env.URL + '/student-registration?error=unknown');
  }
}