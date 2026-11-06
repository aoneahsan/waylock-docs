import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import SearchPage from '@theme-original/SearchPage';

/** The search plugin writes property="robots", which crawlers ignore, so the results page needs a real noindex. */
export default function SearchPageWrapper(): ReactNode {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <SearchPage />
    </>
  );
}
