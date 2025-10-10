import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Moral Clarity AI</title>
        <meta name="description" content="Anchored answers for modern life." />
        <link rel="icon" href="/anchor-compass.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
