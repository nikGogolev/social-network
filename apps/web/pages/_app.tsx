import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ThemeProvider } from '@material-tailwind/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import 'react-image-crop/src/ReactCrop.scss';
import { checkAuth } from '../api/api';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Social Network</title>
      </Head>
      <main className="app">
        <ThemeProvider>
          <Provider store={store}>
            <div className="mx-auto max-w-screen-lg">
              <Component {...pageProps} />
            </div>
          </Provider>
        </ThemeProvider>
      </main>
    </>
  );
}

CustomApp.getInitialProps = async ({ Component, router, ctx }) => {
  let pageProps = {};

  const res = process.browser
    ? await checkAuth()
    : await checkAuth(ctx.req?.cookies);

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  const auth = { user: res.payload, isAuthenticated: !!res.payload };
  pageProps['auth'] = auth;
  return { pageProps };
};

export default CustomApp;
