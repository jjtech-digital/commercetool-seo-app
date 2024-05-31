import { createContext, useContext, useState } from 'react';
interface Props {
  children: React.ReactNode;
  [key: string]: any;
}
interface IAppContext {
  isApiFetching: boolean;
  pageLoading: boolean;
  notificationMessage: string;
  notificationMessageType: 'success' | 'error' | 'info' | 'warning';
}
export type IUseAppState = {
  state: IAppContext;
  setState: Function;
};
const AppContext = createContext<IUseAppState>({} as IUseAppState);

const initalState: IAppContext = {
  pageLoading: false,
  isApiFetching: false,
  notificationMessage: '',
  notificationMessageType: 'success',
};

export const AppContextProvider = ({ children }: Props) => {
  const [state, setState] = useState({
    ...initalState,
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppContext);
  return context;
}
