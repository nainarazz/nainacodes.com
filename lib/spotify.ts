// Auth flows: https://developer.spotify.com/documentation/web-api/tutorials/code-flow
// and https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// Access token tied to the site owner's Spotify account, used for "now playing".
// As of 2026 Spotify expires refresh tokens 6 months after authorization, so this
// will eventually start returning invalid_grant and need to be regenerated with
// `node scripts/get-spotify-refresh-token.mjs`.
const getUserAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token as string,
    }),
  });

  if (!response.ok) {
    return '';
  }

  const { access_token } = await response.json();

  return access_token;
};

// App-only access token for public catalog data (e.g. podcast episodes). Doesn't
// require a user account and never expires the way a refresh token does.
const getAppAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    return '';
  }

  const { access_token } = await response.json();

  return access_token;
};

export const getNowPlaying = async () => {
  const access_token = await getUserAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getTopShowEpisodes = async (showId: string) => {
  const access_token = await getAppAccessToken();

  return fetch(`https://api.spotify.com/v1/shows/${showId}/episodes?limit=5`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
