import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Header({ title, linkToIndexPage }) {
  return <h1>{linkToIndexPage ? <Link href="/">{title}</Link> : title}</h1>;
}

Header.propTypes = {
  linkToIndexPage: PropTypes.bool,
  title: PropTypes.string,
};

Header.defaultProps = {
  linkToIndexPage: true,
  title: 'La Baleine Bleue',
};
