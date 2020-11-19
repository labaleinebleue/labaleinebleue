import PropTypes from 'prop-types';
import imagePropType from './image-prop-type';

const productPropTypes = {
  code: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  categoryCode: PropTypes.string.isRequired,
  vendorCode: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(imagePropType),
};

const productPropType = PropTypes.exact(productPropTypes);

export default productPropType;
