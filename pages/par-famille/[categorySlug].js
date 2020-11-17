import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import Header from '@/components/Header';
import { fetchCategories, fetchCategoryBySlug } from '@/lib/category';
import { buildProductPageHref } from '@/lib/link';
import { fetchProducts, fetchProductVendors } from '@/lib/product';
import { keyByValueOf } from '@/lib/util';

export default function BrowseByCategoryPage({
  category,
  products,
  vendorsByVendorCode,
}) {
  return (
    <Fragment>
      <Head>
        <title>Par famille&nbsp;: {category.name}</title>
      </Head>

      <Header />

      <h2>Par famille&nbsp;: {category.name}</h2>

      <p>{products.length} produits</p>

      <ul>
        {products.map((product) => (
          <li key="product:{productId}">
            <Link href={buildProductPageHref(product)}>{product.name}</Link>
            {' — '}
            {vendorsByVendorCode[product.vendorCode].name}
          </li>
        ))}
      </ul>

      <pre>{JSON.stringify(category)}</pre>
    </Fragment>
  );
}

BrowseByCategoryPage.propTypes = {
  category: PropTypes.object,
  products: PropTypes.array,
  vendorsByVendorCode: PropTypes.object,
};

export async function getStaticPaths() {
  const categories = await fetchCategories();

  return {
    paths: categories.map((category) => ({
      params: { categorySlug: category.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { categorySlug } = params;

  const category = await fetchCategoryBySlug(categorySlug);

  // Fetch category products
  const products = await fetchProducts({ categoryCode: category.code });

  // Fetch vendors of fetched products
  const productVendors = await fetchProductVendors({
    categoryCode: category.code,
  });

  // Arrange vendors in an object keyed by vendor code
  const vendorsByVendorCode = keyByValueOf(productVendors, 'code');

  return { props: { category, vendorsByVendorCode, products } };
}
