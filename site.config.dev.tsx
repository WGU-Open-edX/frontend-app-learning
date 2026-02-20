import { EnvironmentTypes, footerApp, headerApp, shellApp, SiteConfig } from '@openedx/frontend-base';

import { learningApp } from './src';

import './src/app.scss';

const siteConfig: SiteConfig = {
  siteId: 'learning-dev',
  siteName: 'Learning Dev',
  baseUrl: 'http://apps.local.openedx.io:8080',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    learningApp],
};

export default siteConfig;
