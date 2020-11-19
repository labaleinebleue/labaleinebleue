import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { buildProductPageHref } from '@/lib/link';
import categoryPropType from '@/lib/prop-types/category-prop-type';
import productPropType from '@/lib/prop-types/product-prop-type';
import vendorPropType from '@/lib/prop-types/vendor-prop-type';
import { keyByValueOf } from '@/lib/util';

export default function ProductMosaic({
  categories,
  products,
  showCategories,
  showVendors,
  vendors,
}) {
  // Arrange categories and vendors in objects keyed by code
  const categoriesByCategoryCode = keyByValueOf(categories, 'code');
  const vendorsByVendorCode = keyByValueOf(vendors, 'code');

  return (
    <ul
      className="grid grid-cols-1 p-2 gap-2
                 md:grid-cols-2 
                 lg:grid-cols-3 
                 xl:grid-cols-4"
    >
      {products.map((product, index) => {
        const category = categoriesByCategoryCode[product.categoryCode];
        const vendor = vendorsByVendorCode[product.vendorCode];

        const productPageHref = buildProductPageHref(product);

        const firstProductImage = _.get(product, 'images[0]');

        // Consider only the first two images as “priority”
        const priority = index <= 1;

        return (
          <li
            className="bg-white relative rounded-lg p-2
                       h-cmgi-1/1-w
                       md:h-cmgi-1/2-w
                       lg:h-cmgi-1/3-w
                       xl:h-cmgi-1/4-w
                       2xl:h-cmgi-1/4-2xl-w"
            key="product:{productId}"
          >
            <div className="h-full relative w-full">
              {firstProductImage && (
                <Link href={productPageHref} prefetch={false}>
                  <a>
                    <Image
                      className="object-contain"
                      src={firstProductImage.href}
                      sizes="(min-width: 1536px) 22.5rem,
                             (min-width: 1280px) 25vw,
                             (min-width: 1024px) 33.333333vw,
                             (min-width: 768px) 50vw,
                             100vw"
                      alt={`${category.name} «&nbsp;${product.name}&nbsp;»`}
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
              {showCategories && (
                <div className="text-gray-600 text-xs">{category.name}</div>
              )}
              {showVendors && (
                <div className="text-gray-600 text-xs">{vendor.name}</div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

ProductMosaic.propTypes = {
  categories: PropTypes.arrayOf(categoryPropType),
  products: PropTypes.arrayOf(productPropType),
  showCategories: PropTypes.bool,
  showVendors: PropTypes.bool,
  vendors: PropTypes.arrayOf(vendorPropType),
};

ProductMosaic.defaultProps = {
  showCategories: true,
  showVendors: true,
};
