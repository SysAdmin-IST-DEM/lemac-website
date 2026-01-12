import axios from 'axios';

export async function getRoomData(roomCode: number, date: string) {
  const { data: response } = await axios.get(
    `https://fenix.tecnico.ulisboa.pt/api/fenix/v1/spaces/${roomCode}?day=${date}`
  );

  return response;
}
