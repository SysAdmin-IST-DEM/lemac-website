import axios from 'axios';
import type { paths } from '../../types/fenix.js';

const FENIX_BASE_URL = process.env.FENIX_BASE_URL || 'https://fenix.tecnico.ulisboa.pt/';

export async function getAccessTokenCard(code: string): Promise<string> {
  const { data: response } = await axios.post(
    `${FENIX_BASE_URL}oauth/access_token?client_id=${encodeURIComponent(
      process.env.FENIX_CLIENT_ID_STUDENT || ''
    )}&client_secret=${encodeURIComponent(
      process.env.FENIX_CLIENT_SECRET_STUDENT || ''
    )}&redirect_uri=${encodeURIComponent(
      process.env.FENIX_REDIRECT_URL_STUDENT || ''
    )}&code=${encodeURIComponent(code)}&grant_type=authorization_code`
  );
  return response.access_token;
}

async function getPersonData(access_token: string) {
  return (await axios.get<
    paths["/person"]["get"]["responses"]["200"]["content"]["application/json"]
  >(`${FENIX_BASE_URL}tecnico-api/v2/person`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).data;
}

async function getAttending(access_token: string) {
  return (await axios.get<
    paths["/student/attending"]["get"]["responses"]["200"]["content"]["application/json"]
  >(`${FENIX_BASE_URL}tecnico-api/v2/student/attending`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })).data;
}

async function getDepartmentCourses(department: string) {
  return (await axios.get<
    paths["/departments/{department}/execution-courses"]["get"]["responses"]["200"]["content"]["application/json"]
  >(`${FENIX_BASE_URL}tecnico-api/v2/departments/${department}/execution-courses`)).data;
}

export async function getPersonIfDEM(access_token: string):
  Promise<paths["/person"]["get"]["responses"]["200"]["content"]["application/json"] | null> {
  const person = await getPersonData(access_token);

  if(person.roles.teacher) {
    return person.roles.teacher.department.acronym === "DEM" ? person : null;
  }

  const employeeRole =
    person.roles.employee ??
    person.roles.researcher ??
    person.roles.grantOwner;
  if(employeeRole && employeeRole.workingPlace) {
    for(const place of employeeRole.workingPlace) {
      if(place.acronym === "DEM") return person;
    }
  }

  if (person.roles.student) {
    const coursesIds = (await getDepartmentCourses("811748818948")).map(c => c.id);
    const enrollments = await getAttending(access_token);

    for(const enrollment of enrollments) {
      if(enrollment.state !== "NOT_ENROLLED") {
        if(coursesIds.includes(enrollment.course.id)) return person;
      }
    }
  }

  return null;
}

export async function createStudentOrNull(access_token: string) {
  const person = await getPersonIfDEM(access_token);

  if(!person) return null;

  const { data: card } = await axios.get(`${FENIX_BASE_URL}tecnico-api/v2/person/cards`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  console.log(`CARDS OF PERSON ${person.name}: ${JSON.stringify(card)}`);

  return {
    id: -1,
    istId: person.username,
    name: person.name,
    email: person.email,
    mifareNumber: BigInt(card[0].mifareNumber)
  }
}