import PropTypes from 'prop-types';

const productPropTypes = {
  code: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  categoryCode: PropTypes.string.isRequired,
  vendorCode: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
};

const productPropType = PropTypes.exact(productPropTypes);

export default productPropType;
