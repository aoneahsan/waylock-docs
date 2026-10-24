import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {HtmlClassNameProvider, PageMetadata, ThemeClassNames} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';
import Heading from '@theme/Heading';
import type {Props} from '@theme/DocTagDocListPage';
import {isTopicKey, topicCopy} from '../../content/discovery';

// This is the smallest theme replacement that adds approved title, intro and metadata to a generated tag page.
export default function DocTagDocListPage({tag}: Props): ReactNode {
  const key = tag.label.toLowerCase();
  if (!isTopicKey(key)) throw new Error(`Unreviewed docs topic: ${tag.label}`);
  const copy = topicCopy[key];
  return <>
    <PageMetadata title={copy.title} description={copy.description}/>
    <SearchMetadata tag="doc_tag_doc_list"/>
    <HtmlClassNameProvider className={ThemeClassNames.page.docsTagDocListPage}>
      <div className="container margin-vert--lg waylock-index">
        <main>
          <Heading as="h1">{copy.title}</Heading>
          <p>{copy.intro}</p>
          <div className="waylock-index-grid">
            {tag.items.map(doc => <Link key={doc.id} className="waylock-index-card" to={doc.permalink}>
              <Heading as="h2">{doc.title}</Heading>
            </Link>)}
          </div>
        </main>
      </div>
    </HtmlClassNameProvider>
  </>;
}
