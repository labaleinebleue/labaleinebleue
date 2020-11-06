import _ from 'lodash';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { buildProductPageHref } from '../../lib/link';
import { fetchCategories } from '../../lib/category';
import { fetchProducts } from '../../lib/product';
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
  const productCategoryCodes = _.uniq(_.map(products, 'categoryCode'));
  const categories = await fetchCategories((category) =>
    _.includes(productCategoryCodes, category.code)
  );
  const categoriesByCategoryCode = _.transform(
    categories,
    (result, category) => {
      result[category.code] = category;
    },
    {}
  );

  return { props: { categoriesByCategoryCode, products, vendor } };
}
