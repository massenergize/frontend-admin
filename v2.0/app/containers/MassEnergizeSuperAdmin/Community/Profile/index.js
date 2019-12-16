import React from 'react';
import Loading from 'dan-components/Loading';
import loadable from '../../../../utils/loadable';

export const About = loadable(() => import('./About'), {
  fallback: <Loading />,
});

export const Albums = loadable(() => import('./Albums'), {
  fallback: <Loading />,
});

export const Connection = loadable(() => import('./Connection'), {
  fallback: <Loading />,
});

export const Cover = loadable(() => import('./Cover'), {
  fallback: <Loading />,
});

export const Favorites = loadable(() => import('./Favorites'), {
  fallback: <Loading />,
});

export const Pages = loadable(() => import('./Pages'), {
  fallback: <Loading />,
});

export const CommunityData = loadable(() => import('./CommunityData'), {
  fallback: <Loading />,
});
