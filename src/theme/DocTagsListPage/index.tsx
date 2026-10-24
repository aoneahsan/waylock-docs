import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {HtmlClassNameProvider, PageMetadata, ThemeClassNames} from '@docusaurus/theme-common';
import SearchMetadata from '@theme/SearchMetadata';
import Heading from '@theme/Heading';
import type {Props} from '@theme/DocTagsListPage';
import {discovery, isTopicKey, topicCopy} from '../../content/discovery';

// Keep Docusaurus' generated tag routes; supply the reviewed discovery words around them.
export default function DocTagsListPage({tags}: Props): ReactNode {
  const topics = tags.map(tag => {
    const key = tag.label.toLowerCase();
    if (!isTopicKey(key)) throw new Error(`Unreviewed docs topic: ${tag.label}`);
    return {tag, copy: topicCopy[key]};
  });
  return <>
    <PageMetadata title={discovery.topics.title} description={discovery.topics.description}/>
    <SearchMetadata tag="doc_tags_list"/>
    <HtmlClassNameProvider className={ThemeClassNames.page.docsTagsListPage}>
      <div className="container margin-vert--lg waylock-index">
        <main>
          <Heading as="h1">{discovery.topics.title}</Heading>
          <p>{discovery.topics.intro}</p>
          <div className="waylock-index-grid">
            {topics.map(({tag, copy}) => <Link key={tag.permalink} className="waylock-index-card" to={tag.permalink}>
              <span className="waylock-topic-label">{copy.label}</span>
              <Heading as="h2">{copy.title}</Heading>
              <p>{copy.card}</p>
            </Link>)}
          </div>
        </main>
      </div>
    </HtmlClassNameProvider>
  </>;
}
