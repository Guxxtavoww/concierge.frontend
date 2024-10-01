import 'server-only';
import axios from 'axios';

import { session } from '../session/session.lib';
import { ENV_VARIABLES } from '../../config/env.config';

const api = axios.create({
  baseURL: ENV_VARIABLES.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cache = {
  access_token: undefined as Maybe<string>,
  refresh_token: undefined as Maybe<string>,
};

api.interceptors.request.use(async (req) => {
  if (cache.access_token) {
    req.headers.Authorization = `Bearer ${cache.access_token}`;
  } else {
    const my_session = await session();

    const access_token = my_session.access_token;

    if (access_token) {
      req.headers.Authorization = `Bearer ${access_token}`;
      cache.access_token = access_token;
    }
  }

  return Promise.resolve(req);
});

export { api };
