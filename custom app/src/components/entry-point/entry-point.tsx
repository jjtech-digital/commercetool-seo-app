import { lazy, useEffect } from 'react';
import { setupGlobalErrorListener } from '@commercetools-frontend/application-shell';
import type { ApplicationWindow } from '@commercetools-frontend/constants';
import { createCtObjToken } from '../../api/fetchersFunction/ctObjTokenfetcher';
import { LS_KEY } from '../../constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { getSavedAiKeyFromCtCustomObj } from '../../api/fetchersFunction/aiKeyFetchers';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../context/AppContext';

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
  const { setState } = useAppContext();
  const CTP_SCOPES = useApplicationContext(
    (context) => context.environment.scopes
  );
  const CTP_AUTH_URL = useApplicationContext(
    (context) => context.environment.authUrl
  );
  const CTP_CLIENT_ID = useApplicationContext(
    (context) => context.environment.clientId
  );
  const CTP_CLIENT_SECRET = useApplicationContext(
    (context) => context.environment.clientSecret
  );
  const CTP_API_URL = useApplicationContext(
    (context) => context.environment.apiUrl
  );
  const CTP_PROJECT_KEY = useApplicationContext(
    (context) => context.environment.projectKey
  );
  const secrets = {
    CTP_SCOPES,
    CTP_AUTH_URL,
    CTP_CLIENT_ID,
    CTP_CLIENT_SECRET,
    CTP_API_URL,
    CTP_PROJECT_KEY,
  };

  const { setValue } = useForm();
  const storeToken = async () => {
    try {
      const token = await createCtObjToken(secrets);

      if (token) {
        localStorage.setItem(LS_KEY.CT_OBJ_TOKEN, token);
      }
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  const fetchKey = async () => {
    try {
      const response = await getSavedAiKeyFromCtCustomObj(setState, secrets);
      if (response.value) {
        localStorage.setItem(LS_KEY.OPEN_AI_KEY, response.value);
        setValue('openAi', response.value);
      }
    } catch (error) {
      console.error('Error fetching key:', error);
    }
  };

  useEffect(() => {
    storeToken();
    fetchKey();
  }, []);

  return <AsyncApplicationRoutes />;
};
EntryPoint.displayName = 'EntryPoint';

export default EntryPoint;
