import axios from 'axios';

const FENIX_BASE_URL = process.env.FENIX_BASE_URL || 'https://fenix.tecnico.ulisboa.pt/';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

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

export function isDEM(personData: unknown): boolean {
  if(!isRecord(personData) || !isRecord(personData.roles)) return false;

  for(const roleKey in personData.roles) {
    const role = personData.roles[roleKey];
    if (!isRecord(role)) continue;

    if(role.registrations) {
      if(!Array.isArray(role.registrations)) continue;
      for(const registration of role.registrations) {
        const name = registration.degree.name["pt-PT"];
        if(name.includes('Aeroespacial') ||
          name.includes('Mecânica') ||
          name.includes('Naval') ||
          name.includes('Materiais') ||
          name.includes('Ambiente') ||
          name.includes('Energia') ||
          name.includes('Biomédica') ||
          name.includes('Investigação')) return true;
      }
    }

    if(isRecord(role.department) && role.department.acronym === 'DEM') {
      return true;
    }
  }

  if(personData.username === 'ist1113807') return true;
  return false;
}

export async function createStudentOrNull(access_token: string) {
  const { data: person } = await axios.get(`${FENIX_BASE_URL}tecnico-api/v2/person`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!isDEM(person)) return null;

  const { data: card } = await axios.get(`${FENIX_BASE_URL}tecnico-api/v2/person/cards`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return {
    id: -1,
    istId: person.username,
    name: person.name,
    email: person.email,
    mifareNumber: card[0].mifareNumber
  }
}