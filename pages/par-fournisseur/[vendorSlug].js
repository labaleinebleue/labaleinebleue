import Head from 'next/head';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import ProductMosaic from '@/components/ProductMosaic';
import { fetchProductCategories, fetchProducts } from '@/lib/product';
import { withImagesFirst } from '@/lib/product-util';
import { fetchVendors, fetchVendorBySlug } from '@/lib/vendor';

export default function BrowseByVendorPage({ categories, products, vendor }) {
  return (
    <Fragment>
      <Head>
        <title>Par fournisseur&nbsp;: {vendor.name}</title>
      </Head>

      <Header />

      <Main>
        <h2>Par fournisseur&nbsp;: {vendor.name}</h2>

        <p>{products.length} produits</p>

        <ProductMosaic
          categories={categories}
          products={products}
          showVendors={false}
          vendors={[vendor]}
        />
      </Main>

      <pre>{JSON.stringify(vendor)}</pre>
    </Fragment>
  );
}

BrowseByVendorPage.propTypes = {
  categories: PropTypes.object,
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
  const products = await fetchProducts(
    { vendorCode: vendor.code },
    { sortBy: [withImagesFirst, 'name'] }
  );

  // Fetch vendor categories
  const categories = await fetchProductCategories({
    vendorCode: vendor.code,
  });

  return { props: { categories, products, vendor } };
}
