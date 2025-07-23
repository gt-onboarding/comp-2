import { getGT } from 'gt-next/server';
import axios from 'axios';

export async function fetcher(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    const t = await getGT();
    throw new Error(t('Failed to fetch data'));
  }
}
