import {
  screen,
  mapResourceAccessToAppliedPermissions,
  type TRenderAppWithReduxOptions,
} from '@commercetools-frontend/application-shell/test-utils';
import { renderApplicationWithRedux } from '../../test-utils';
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';
import ApplicationRoutes from '../../routes';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const renderApp = (options: Partial<TRenderAppWithReduxOptions> = {}) => {

  const entryPointUriPath = useApplicationContext(
    (context) => context.environment.entryPointUriPath
  );
  const route = options.route || `/my-project/${entryPointUriPath}`;
  const { history } = renderApplicationWithRedux(<ApplicationRoutes />, {
    route,
    project: {
      allAppliedPermissions: mapResourceAccessToAppliedPermissions([
        entryPointUriPathToPermissionKeys(entryPointUriPath).View,
      ]),
    },
    ...options,
  });
  return { history };
};

it('should render welcome page', async () => {
  renderApp();
  await screen.findByText('Develop applications for the Merchant Center');
});
