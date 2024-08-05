/// <reference types="@commercetools-frontend/application-config/client" />

import ReactDOM from 'react-dom';
import EntryPoint from './components/entry-point';
import { ApplicationShell } from '@commercetools-frontend/application-shell';
import { ApplicationWindow } from '@commercetools-frontend/constants';
import loadMessages from './load-messages';
import { AppContextProvider } from './context/AppContext';
declare let window: ApplicationWindow;
ReactDOM.render(
  <AppContextProvider>
    <ApplicationShell
      enableReactStrictMode
      environment={window.app}
      applicationMessages={loadMessages}
    >
      <EntryPoint />
    </ApplicationShell>
  </AppContextProvider>,
  document.getElementById('app')
);
