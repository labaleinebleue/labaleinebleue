import PropTypes from 'prop-types';

const categoryPropTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

const categoryPropType = PropTypes.exact(categoryPropTypes);

export default categoryPropType;
