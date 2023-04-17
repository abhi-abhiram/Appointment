import { type AppType } from 'next/app';
import { api } from '~/utils/api';
import { MantineProvider } from '@mantine/core';
import { HeaderMegaMenu } from '~/components/Header';
import { type User } from 'lucia-auth';
import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
} from 'next';
import { auth } from '~/auth/lucia';
import { SessionContextProvider } from '~/context/SessionContext';

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <SessionContextProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <HeaderMegaMenu />
          <div style={{ flex: 1 }}>
            <Component {...pageProps} />
          </div>
        </div>
      </SessionContextProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ user: User }>> => {
  const { req, res } = context;
  const authRequest = auth.handleRequest(req, res);
  const { user } = await authRequest.validateUser();
  if (!user)
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  return {
    props: {
      user,
    },
  };
};
