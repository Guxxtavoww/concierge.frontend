import { withHydrationOverlay } from '@builder.io/react-hydration-overlay/next';

/** @type {import('next').NextConfig} */
const nextConfig = {};

// Check if the environment is development
const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';

// Apply the hydration overlay only in development mode
const config = isDev
  ? withHydrationOverlay({ appRootSelector: 'main' })(nextConfig)
  : nextConfig;

export default config;
