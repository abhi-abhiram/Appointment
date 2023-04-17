import { type AppProps } from 'next/app';
import { api } from '~/utils/api';
import { Center, Loader, MantineProvider } from '@mantine/core';
import { HeaderMegaMenu } from '~/components/Header';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { type Session } from 'next-auth';

function MyApp({
  Component,
  pageProps,
}: AppProps<{ session: Session | null }>) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <SessionProvider session={pageProps.session}>
        <Wrapper>
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
        </Wrapper>
      </SessionProvider>
    </MantineProvider>
  );
}

export default api.withTRPC(MyApp);

function Wrapper({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.push('/auth');
    }
  }, [status]);
  if (status === 'loading') {
    return (
      <Center h='100vh'>
        <Loader />
      </Center>
    );
  }
  return <>{children}</>;
}
