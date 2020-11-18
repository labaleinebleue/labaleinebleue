import PropTypes from 'prop-types';

export default function Main({ children }) {
  return <main className="xxl:container xxl:mx-auto">{children}</main>;
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
};
