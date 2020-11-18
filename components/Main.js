import PropTypes from 'prop-types';

export default function Main({ children }) {
  return <main className="2xl:container 2xl:mx-auto">{children}</main>;
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
};
