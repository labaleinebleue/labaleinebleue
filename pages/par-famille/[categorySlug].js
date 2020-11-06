import _ from 'lodash';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { fetchCategories, fetchCategoryBySlug } from '../../lib/category';
import { buildProductPageHref } from '../../lib/link';
import { fetchProducts } from '../../lib/product';
import { fetchVendors } from '../../lib/vendor';

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

      <h1>
        <Link href="/">La Baleine Bleue</Link>
      </h1>

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
  const productVendorCodes = _.uniq(_.map(products, 'vendorCode'));
  const vendors = await fetchVendors((vendor) =>
    _.includes(productVendorCodes, vendor.code)
  );
  const vendorsByVendorCode = _.transform(
    vendors,
    (result, vendor) => {
      result[vendor.code] = vendor;
    },
    {}
  );

  return { props: { category, products, vendorsByVendorCode } };
}
