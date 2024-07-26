import type { ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Settings from './components/Settings/Settings';
import { useAppContext } from './context/AppContext';
import Notification from './components/Notification/Notification';
import TableDataContainer from './components/TableContainer/TableDataContainer';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();
  const { state, setState } = useAppContext();
  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/custom-applications/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  return (
    <>
      <Spacings.Inset scale="l">
        <Switch>
          <Route path={`${match.path}/settings`}>
            <Settings linkToProducts={match.url} />
          </Route>
          <Route>
            <TableDataContainer />
          </Route>
        </Switch>
      </Spacings.Inset>
      {state?.notificationMessage && (
        <Notification
          successMessage={state.notificationMessage}
          setSuccessMessage={setState}
          type={state.notificationMessageType}
        />
      )}
    </>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
