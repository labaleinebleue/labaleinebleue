import PropTypes from 'prop-types';

const vendorPropTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

const vendorPropType = PropTypes.exact(vendorPropTypes);

export default vendorPropType;
