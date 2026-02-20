import { Outlet } from 'react-router-dom';
import { CurrentAppProvider, getSiteConfig } from '@openedx/frontend-base';

import { appId } from './constants';

const Main = () => (
  <CurrentAppProvider appId={appId}>
    <div className="app-container">
      <Outlet />
    </div>
  </CurrentAppProvider>
);

export default Main;