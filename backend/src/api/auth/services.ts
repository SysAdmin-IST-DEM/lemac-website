import type { User } from '@prisma/client';

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { prisma } from '../../index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'placeholder';

const FENIX_BASE_URL = process.env.FENIX_BASE_URL || 'https://fenix.tecnico.ulisboa.pt/';
const FENIX_CLIENT_ID = process.env.FENIX_CLIENT_ID || '';
const FENIX_CLIENT_SECRET = process.env.FENIX_CLIENT_SECRET || '';
const FENIX_REDIRECT_URL = process.env.FENIX_REDIRECT_URL || '';
const FENIX_CLIENT_ID_SOFTWARE = process.env.FENIX_CLIENT_ID_SOFTWARE || '';
const FENIX_CLIENT_SECRET_SOFTWARE = process.env.FENIX_CLIENT_SECRET_SOFTWARE || '';
const FENIX_REDIRECT_URL_SOFTWARE = process.env.FENIX_REDIRECT_URL_SOFTWARE || '';

export function createJWT(user: User) {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
  return token;
}

export async function loginFenixData(code: string): Promise<string> {
  const { data: response } = await axios.post(
    `${FENIX_BASE_URL}oauth/access_token?client_id=${encodeURIComponent(
      FENIX_CLIENT_ID_SOFTWARE
    )}&client_secret=${encodeURIComponent(
      FENIX_CLIENT_SECRET_SOFTWARE
    )}&redirect_uri=${encodeURIComponent(
      FENIX_REDIRECT_URL_SOFTWARE
    )}&code=${encodeURIComponent(code)}&grant_type=authorization_code`
  );
  return response.access_token;
}

export async function loginFenix(code: string): Promise<string> {
  const { data: response } = await axios.post(
    `${FENIX_BASE_URL}oauth/access_token?client_id=${encodeURIComponent(
      FENIX_CLIENT_ID
    )}&client_secret=${encodeURIComponent(
      FENIX_CLIENT_SECRET
    )}&redirect_uri=${encodeURIComponent(FENIX_REDIRECT_URL)}&code=${encodeURIComponent(
      code
    )}&grant_type=authorization_code`
  );
  return response.access_token;
}

export async function returnIstId(access_token: string): Promise<string> {
  const { data: person } = await axios.get(`${FENIX_BASE_URL}api/fenix/v1/person`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return person.username;
}

export async function returnIstData(access_token: string) {
  try {
    const result = await axios.get(`${FENIX_BASE_URL}api/fenix/v1/person`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log(result);

    return result.data;
  } catch (e) {
    console.error(e);
    return;
  }
}

export async function getUser(istId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { istId },
  })

  if(!user) {
    return null;
  }

  return user;
}