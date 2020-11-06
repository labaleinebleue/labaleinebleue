export const buildBrowseByCategoryPageHref = (category) =>
  `/par-famille/${category.slug}`;

export const buildBrowseByVendorPageHref = (vendor) =>
  `/par-fournisseur/${vendor.slug}`;

export const buildProductPageHref = (product) =>
  `/ref/${product.id}/${product.slug}`;
