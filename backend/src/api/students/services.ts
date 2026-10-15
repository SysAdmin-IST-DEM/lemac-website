import axios from 'axios';
import type { paths } from '../../types/fenix.js';

const FENIX_BASE_URL = process.env.FENIX_BASE_URL || 'https://fenix.tecnico.ulisboa.pt/';

export async function getAccessToken(code: string): Promise<string> {
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

async function isDEM(person: Awaited<ReturnType<typeof getPersonData>>, access_token: string): Promise<boolean> {
  if(person.roles.teacher) {
    return person.roles.teacher.department.acronym === "DEM";
  }

  const employeeRole =
    person.roles.employee ??
    person.roles.researcher ??
    person.roles.grantOwner;
  if(employeeRole && employeeRole.workingPlace) {
    for(const place of employeeRole.workingPlace) {
      if(place.acronym === "DEM") return true;
    }
  }

  if (person.roles.student) {
    const coursesIds = (await getDepartmentCourses("811748818948")).map(c => c.id);
    const enrollments = await getAttending(access_token);
    console.log("\n\n\n\n\nPERSON", enrollments);

    for(const enrollment of enrollments) {
      if(enrollment.state !== "NOT_ENROLLED") {
        if(coursesIds.includes(enrollment.course.id)) return true;
      }
    }
  }

  console.log(JSON.stringify(person), "\n\n\n\n\n");

  if(person.username === 'ist1113807') return true; // Hardcode SysADM as DEM

  return false;
}

export async function getStudentDetails(access_token: string, lookup_dem: boolean) {
  const person = await getPersonData(access_token);

  return {
    id: -1,
    istId: person.username,
    name: person.name,
    email: person.email,
    isDEM: lookup_dem ? await isDEM(person, access_token) : null,
  }
}

export async function getStudentCards(access_token: string) {
  let cards = [];
  try {
    const { data: cardsData } = await axios.get(`${FENIX_BASE_URL}tecnico-api/v2/person/cards`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    cards = cardsData;
  } catch (err) {
    console.error(err);
    cards = [];
  }

  return cards && cards.length > 0 && cards[0].mifareNumber ? BigInt(cards[0].mifareNumber) : null;
}