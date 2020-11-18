import _ from 'lodash';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import Header from '@/components/Header';
import { fetchCategories, fetchCategoryBySlug } from '@/lib/category';
import { buildProductPageHref } from '@/lib/link';
import { fetchProducts, fetchProductVendors } from '@/lib/product';
import { withImagesFirst } from '@/lib/product-util';
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

      <main className="xxl:container xxl:mx-auto">
        <h2>Par famille&nbsp;: {category.name}</h2>

        <p>{products.length} produits</p>

        <ul
          className="grid grid-cols-1 p-2 gap-2
                     md:grid-cols-2 
                     lg:grid-cols-3 
                     xl:grid-cols-4"
        >
          {products.map((product, index) => {
            const firstProductImage = _.get(product, 'images[0]');
            const productPageHref = buildProductPageHref(product);
            const vendor = vendorsByVendorCode[product.vendorCode];
            const priority = index <= 1;

            return (
              <li
                className="bg-white relative rounded-lg p-2
                           h-cmgi-1/1w
                           md:h-cmgi-1/2w
                           lg:h-cmgi-1/3w
                           xl:h-cmgi-1/4w
                           xxl:h-cmgi-1/4xxl-w"
                key="product:{productId}"
              >
                <div className="h-full relative w-full">
                  {firstProductImage && (
                    <Link href={productPageHref} prefetch={false}>
                      <a>
                        <Image
                          className="object-contain"
                          src={firstProductImage.href}
                          sizes="(min-width: 1920px) 30rem,
                                 (min-width: 1280px) 25vw,
                                 (min-width: 1024px) 33.333333vw,
                                 (min-width: 768px) 50vw,
                                 100vw"
                          alt={`${category.name} « ${product.name} »`}
                          layout="fill"
                          quality={75}
                          priority={priority}
                        />
                      </a>
                    </Link>
                  )}
                </div>

                <div className="absolute bg-labaleinebleue-white bg-opacity-75 bottom-0 left-0 p-2 right-0 rounded-lg">
                  <Link href={productPageHref} prefetch={false}>
                    <a
                      className="font-bold text-labaleinebleue-blue text-lg
                                 active:underline
                                 hover:underline"
                    >
                      {product.name}
                    </a>
                  </Link>
                  <div className="text-gray-600 text-xs">{vendor.name}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </main>

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
  const products = await fetchProducts(
    { categoryCode: category.code },
    { sortBy: [withImagesFirst, 'name'] }
  );

  // Fetch vendors of fetched products
  const productVendors = await fetchProductVendors({
    categoryCode: category.code,
  });

  // Arrange vendors in an object keyed by vendor code
  const vendorsByVendorCode = keyByValueOf(productVendors, 'code');

  return { props: { category, vendorsByVendorCode, products } };
}
