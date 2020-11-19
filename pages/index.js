import Head from 'next/head';
import Link from 'next/link';
import { Fragment } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Main from '@/components/Main';
import {
  buildBrowseByCategoryPageHref,
  buildBrowseByVendorPageHref,
} from '@/lib/link';
import { fetchProductCategories, fetchProductVendors } from '@/lib/product';
import styles from '@/styles/IndexPage.module.css';

export default function IndexPage({ categories, vendors }) {
  return (
    <Fragment>
      <Head>
        <title>La Baleine Bleue</title>
      </Head>

      <Header linkToIndexPage={false} />

      <Main>
        <Hero />
        <h2>Par famille</h2>
        <ul>
          {categories.map((category) => (
            <li key={`category:${category.slug}`}>
              <Link href={buildBrowseByCategoryPageHref(category)}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <h2>Par fournisseur</h2>
        <ul>
          {vendors.map((vendor) => (
            <li key={`vendor:${vendor.slug}`}>
              <Link href={buildBrowseByVendorPageHref(vendor)}>
                {vendor.name}
              </Link>
            </li>
          ))}
        </ul>
      </Main>
    </Fragment>
  );
}

export async function getStaticProps() {
  const [categories, vendors] = await Promise.all([
    fetchProductCategories(),
    fetchProductVendors(),
  ]);

  return { props: { categories, vendors } };
}
