import type { NextApiRequest, NextApiResponse } from 'next';
import { getTopShowEpisodes } from 'lib/spotify';
import { Show } from 'types/Spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const SYNTAX_FM_SHOW_ID = '4kYCRYJ3yK5DQbP5tbfZby';
  const response = await getTopShowEpisodes(SYNTAX_FM_SHOW_ID);

  if (response.status === 204 || response.status > 400) {
    return res.status(200).json([]);
  }

  const show = await response.json();

  if (!show.items) {
    return res.status(200).json([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: Show[] = show.items.map((i: any) => ({
    id: i.id,
    title: i.name,
    date: i.release_date,
    image: i.images[0] ? i.images[0].url : '',
    url: i.external_urls?.spotify || '',
  }));

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');

  return res.status(200).json(items);
}
