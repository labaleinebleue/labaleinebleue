import Head from 'next/head';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import ProductMosaic from '@/components/ProductMosaic';
import { fetchCategories, fetchCategoryBySlug } from '@/lib/category';
import { fetchProducts, fetchProductVendors } from '@/lib/product';
import { withImagesFirst } from '@/lib/product-util';

export default function BrowseByCategoryPage({ category, products, vendors }) {
  return (
    <Fragment>
      <Head>
        <title>Par famille&nbsp;: {category.name}</title>
      </Head>

      <Header />

      <Main>
        <h2>Par famille&nbsp;: {category.name}</h2>

        <p>{products.length} produits</p>

        <ProductMosaic
          categories={[category]}
          products={products}
          showCategories={false}
          vendors={vendors}
        />
      </Main>

      <pre>{JSON.stringify(category)}</pre>
    </Fragment>
  );
}

BrowseByCategoryPage.propTypes = {
  category: PropTypes.object,
  products: PropTypes.array,
  vendors: PropTypes.object,
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
  const products = await fetchProducts(
    { categoryCode: category.code },
    { sortBy: [withImagesFirst, 'name'] }
  );

  // Fetch category vendors
  const vendors = await fetchProductVendors({
    categoryCode: category.code,
  });

  return { props: { category, products, vendors } };
}
