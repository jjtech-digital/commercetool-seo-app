import { lazy, useEffect } from 'react';
import {
  ApplicationShell,
  setupGlobalErrorListener,
} from '@commercetools-frontend/application-shell';
import type { ApplicationWindow } from '@commercetools-frontend/constants';
import loadMessages from '../../load-messages';
import { AppContextProvider } from '../../context/AppContext';
import { useSettings } from '../../scripts/useSettings/useSettings';

declare let window: ApplicationWindow;

// Here we split up the main (app) bundle with the actual application business logic.
// Splitting by route is usually recommended and you can potentially have a splitting
// point for each route. More info at https://reactjs.org/docs/code-splitting.html
const AsyncApplicationRoutes = lazy(
  () => import('../../routes' /* webpackChunkName: "routes" */)
);

// Ensure to setup the global error listener before any React component renders
// in order to catch possible errors on rendering/mounting.
setupGlobalErrorListener();

const EntryPoint = () => {
  const { getCtObjToken } = useSettings();
  const storeToken = async () => {
    try {
      const token = await getCtObjToken();
      if (token) {
        localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  useEffect(() => {
    storeToken();
  }, []);

  return (
    <AppContextProvider>
      <ApplicationShell
        enableReactStrictMode
        environment={window.app}
        applicationMessages={loadMessages}
      >
        <AsyncApplicationRoutes />
      </ApplicationShell>
    </AppContextProvider>
  );
};
EntryPoint.displayName = 'EntryPoint';

export default EntryPoint;
