import PropTypes from 'prop-types';

const imagePropTypes = {
  href: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const imagePropType = PropTypes.exact(imagePropTypes);

export default imagePropType;
