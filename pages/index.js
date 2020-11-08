import Head from 'next/head';
import Link from 'next/link';
import { Fragment } from 'react';
import {
  buildBrowseByCategoryPageHref,
  buildBrowseByVendorPageHref,
} from '../lib/link';
import { fetchProductCategories, fetchProductVendors } from '../lib/product';
import styles from '../styles/IndexPage.module.css';

export default function IndexPage({ categories, vendors }) {
  return (
    <Fragment>
      <Head>
        <title>La Baleine Bleue</title>
      </Head>
      <h1>La Baleine Bleue</h1>
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
