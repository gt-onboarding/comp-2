import axios from 'axios';
import { getGT } from 'gt-next/server';

export async function fetcher(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    const t = await getGT();
    throw new Error(t('Failed to fetch data'));
  }
}
