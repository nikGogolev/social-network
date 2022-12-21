import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ThemeProvider } from '@material-tailwind/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import 'react-image-crop/src/ReactCrop.scss';

function CustomApp({ Component, pageProps, auth }: AppProps) {
  console.log('_app', auth);

  return (
    <>
      <Head>
        <title>Social Network</title>
      </Head>
      <main className="app">
        <ThemeProvider>
          <Provider store={store}>
            <div className="mx-auto max-w-screen-lg">
              <Component {...pageProps} auth={auth} />
            </div>
          </Provider>
        </ThemeProvider>
      </main>
    </>
  );
}

CustomApp.getInitialProps = async ({ Component, router, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const auth = { auth0: true };

  return { pageProps, auth };
};

export default CustomApp;
