import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { buildProductPageHref } from '../../lib/link';
import { fetchProductCategories, fetchProducts } from '../../lib/product';
import { keyByValueOf } from '../../lib/util';
import { fetchVendors, fetchVendorBySlug } from '../../lib/vendor';

export default function BrowseByVendorPage({
  categoriesByCategoryCode,
  products,
  vendor,
}) {
  return (
    <Fragment>
      <Head>
        <title>Par fournisseur&nbsp;: {vendor.name}</title>
      </Head>

      <h1>
        <Link href="/">La Baleine Bleue</Link>
      </h1>

      <h2>Par fournisseur&nbsp;: {vendor.name}</h2>

      <p>{products.length} produits</p>

      <ul>
        {products.map((product) => (
          <li key="product:{productId}">
            <Link href={buildProductPageHref(product)}>{product.name}</Link>
            {' ('}
            {categoriesByCategoryCode[product.categoryCode].name}
            {')'}
          </li>
        ))}
      </ul>

      <pre>{JSON.stringify(vendor)}</pre>
    </Fragment>
  );
}

BrowseByVendorPage.propTypes = {
  categoriesByCategoryCode: PropTypes.object,
  products: PropTypes.array,
  vendor: PropTypes.object,
};

export async function getStaticPaths() {
  const vendors = await fetchVendors();
  return {
    paths: vendors.map((vendor) => ({
      params: { vendorSlug: vendor.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { vendorSlug } = params;

  const vendor = await fetchVendorBySlug(vendorSlug);

  // Fetch vendor products
  const products = await fetchProducts({ vendorCode: vendor.code });

  // Fetch categories of fetched products
  const productCategories = await fetchProductCategories({
    vendorCode: vendor.code,
  });

  // Arrange categories in an object keyed by category code
  const categoriesByCategoryCode = keyByValueOf(productCategories, 'code');

  return { props: { categoriesByCategoryCode, products, vendor } };
}
