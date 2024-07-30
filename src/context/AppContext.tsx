import { createContext, useContext, useMemo, useState } from 'react';
interface Props {
  children: React.ReactNode;
  [key: string]: any;
}
export interface IAppContext {
  isApiFetchingSEO: boolean;
  isApiFetchingDescription: boolean;
  isApiFetchingKeyFeatures: boolean;
  pageLoading: boolean;
  notificationMessage: string;
  notificationMessageType: 'success' | 'error' | 'info' | 'warning';
}
export type IUseAppState = {
  state: IAppContext;
  setState: Function;
};
const AppContext = createContext<IUseAppState>({} as IUseAppState);

const initialState: IAppContext = {
  pageLoading: false,
  isApiFetchingSEO: false,
  isApiFetchingDescription: false,
  isApiFetchingKeyFeatures: false,
  notificationMessage: '',
  notificationMessageType: 'success',
};

export const AppContextProvider = ({ children }: Props) => {
  const [state, setState] = useState({
    ...initialState,
  });

  const value = useMemo(() => ({ state, setState }), [state, setState]);
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppContext);
  return context;
}
