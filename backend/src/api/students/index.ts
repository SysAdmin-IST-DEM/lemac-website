import type { Request, Response } from 'express';
import { getStudentDetails, getAccessToken, getStudentCards } from './services.js';
import * as controller from './controller.js'
import type { RequestWithBody } from '../../middleware/parseBody.js';
import { AssignStudentCardBody } from '@lemac/data-model';
import { DateTime } from 'luxon';

const softwares = {
  solidworks: {
    url: process.env.SOLIDWORKS_URL,
    license: process.env.SOLIDWORKS_LICENSE,
  },
  solidedge: {
    url: process.env.SOLIDEDGE_URL,
    password: process.env.SOLIDEDGE_PASS,
  },
  nx: {
    url: process.env.NX_URL
  }
}

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
  let state = req.query.state;
  if(state != "software" && state != "printing" && state != "student-registration") {
    state = "student-registration";
  }
  if(!code) {
    res.status(400).json({ error: 'Code is required' });
    return;
  }

  try {
    const accessToken = await getAccessToken(code.toString());
    if(!accessToken) {
      res.redirect(process.env.URL + `/${state}?error=access_token`);
      return;
    }

    const data = await getStudentDetails(accessToken, state === 'student-registration');

    if(state === 'student-registration') {
      const mifareNumber = await getStudentCards(accessToken);
      const student = await controller.upsertStudent(data.istId, data.name, data.email, data.isDEM!, mifareNumber);
      res.redirect(process.env.URL + `/student-registration?name=${encodeURIComponent(student.name)}&istId=${encodeURIComponent(student.istId)}&isDEM=${student.isDEM}&renewed=${!isToday(student.createdAt)}&mifare=${mifareNumber ? 'true' : 'false'}`);
    } else {
      const student = await controller.getStudent(data.istId);
      if(!student) {
        res.redirect(process.env.URL + `/${state}?error=not_found`);
        return;
      }
      const now = DateTime.now();
      const schoolYearStart = DateTime.fromObject({
        year: now.month >= 9 ? now.year : now.year - 1,
        month: 9,
        day: 1,
      }).startOf("day");
      if(DateTime.fromJSDate(student.lastRenewed) < schoolYearStart) {
        res.redirect(process.env.URL + `/${state}?error=renewal_required`);
        return;
      }

      if(state === 'software') {
        if(!student.isDEM) {
          res.redirect(process.env.URL + `/${state}?error=not_dem`);
        }
        res.redirect(process.env.URL + `/${state}?name=${encodeURIComponent(student.name)}&istId=${encodeURIComponent(student.istId)}&software=${encodeURIComponent(JSON.stringify(softwares))}`);
      } else {
        res.redirect(process.env.URL + `/${state}?name=${encodeURIComponent(student.name)}&istId=${encodeURIComponent(student.istId)}`);
      }
    }
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