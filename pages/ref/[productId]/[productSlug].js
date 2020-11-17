import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { fetchCategoryByCode } from '../../../lib/category';
import { fetchProducts, fetchProductById } from '../../../lib/product';
import { fetchVendorByCode } from '../../../lib/vendor';

export default function ProductPage({ category, product, vendor }) {
  return (
    <Fragment>
      <Head>
        <title>Référence&nbsp;: {product.name}</title>
      </Head>
      <h1>
        <Link href="/">La Baleine Bleue</Link>
      </h1>
      <h2>{product.name}</h2>
      <p>{vendor.name}</p>
      <p>{category.name}</p>
      {product.images && (
        <ul>
          {product.images.map(({ href, width, height }) => (
            <li
              style={{
                display: 'block',
                position: 'relative',
                width: '25vw',
                height: '25vw',
              }}
            >
              <Image
                src={href}
                alt={`Image : ${category.name} « ${product.name} »`}
                layout="intrinsic"
                objectFit="cover"
                width={400}
                height={Math.round(400 * (height / width))}
                priority
              />
            </li>
          ))}
        </ul>
      )}
      <pre>{JSON.stringify({ category, product, vendor })}</pre>
    </Fragment>
  );
}

export async function getStaticPaths() {
  const products = await fetchProducts();
  return {
    paths: products.map((product) => ({
      params: {
        productId: product.id,
        productSlug: product.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { productId } = params;

  const product = await fetchProductById(productId);
  const [category, vendor] = await Promise.all([
    fetchCategoryByCode(product.categoryCode),
    fetchVendorByCode(product.vendorCode),
  ]);

  return { props: { category, product, vendor } };
}
