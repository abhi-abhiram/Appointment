import { Center, Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import { createContext } from 'react';
import { api } from '~/utils/api';

export interface ISessionContextState {
  userId: string | null;
}

export const defaultSessionContextState: ISessionContextState = {
  userId: null,
};

export type TSessionContextActions = 'update_session';
export type TSessionContextPayload = string | null;

export interface ISessionContextActions {
  type: TSessionContextActions;
  payload: TSessionContextPayload;
}

export const SessionReducer = (
  state: ISessionContextState,
  action: ISessionContextActions
): ISessionContextState => {
  switch (action.type) {
    case 'update_session':
      return {
        ...state,
        userId: action.payload,
      };
    default:
      return state;
  }
};

export interface ISessionContextProps {
  SessionState: ISessionContextState;
  SessionDispatch: React.Dispatch<ISessionContextActions>;
}

const SessionContext = createContext<ISessionContextProps>({
  SessionState: defaultSessionContextState,
  SessionDispatch: () => null,
});

export const SessionContextConsumer = SessionContext.Consumer;
export const SessionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [SessionState, SessionDispatch] = React.useReducer(
    SessionReducer,
    defaultSessionContextState
  );

  const me = api.user.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  const { push } = useRouter();
  React.useEffect(() => {
    if (me.data) {
      SessionDispatch({
        type: 'update_session',
        payload: me.data.id,
      });

      void push('/appointments');
    }

    if (me.error) {
      void push('/');
    }
  }, [me.data]);

  if (me.isLoading) {
    return (
      <Center h='100vh'>
        <Loader size={'md'} />
      </Center>
    );
  }

  return (
    <SessionContext.Provider value={{ SessionState, SessionDispatch }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
