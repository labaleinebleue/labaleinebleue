import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Header({ title, linkToIndexPage }) {
  return (
    <header className="bg-labaleinebleue-white p-4">
      <h1
        className="font-labaleinebleue text-labaleinebleue-blue text-2xl
                  md:text-3xl
                  lg:text-4xl
                  xl:text-5xl
                  xxl:text-6xl"
      >
        {linkToIndexPage ? <Link href="/">{title}</Link> : title}
      </h1>
    </header>
  );
}

Header.propTypes = {
  linkToIndexPage: PropTypes.bool,
  title: PropTypes.string,
};

Header.defaultProps = {
  linkToIndexPage: true,
  title: 'La Baleine Bleue',
};
