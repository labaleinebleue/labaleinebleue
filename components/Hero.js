export default function Hero() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0">
        <img
          className="h-full object-cover w-full"
          src="https://res.cloudinary.com/labaleinebleue/image/upload/f_auto,g_auto,q_auto,c_fill,h_400,w_1024/v1605732963/photos/labaleinebleue/31237770_368044943715852_1549631969992638464_o"
        />
      </div>
      <article
        className="bg-gradient-to-t bg-opacity-50 from-black h-auto p-6 relative text-center text-labaleinebleue-white
                   md:p-8
                   lg:p-10
                   xl:p-12
                   2xl:p-14
      "
      >
        <header
          className="font-extrabold leading-6 p-1 text-base
                     md:leading-7 md:p-2 md:text-lg
                     lg:leading-8 lg:p-3 lg:text-xl
                     xl:leading-9 xl:p-4 xl:text-2xl
                     2xl:leading-10 2xl:p-5 2xl:text-3xl"
        >
          Jouets et jeux traditionnels de qualité, durables, pour toute la
          famille.
        </header>
        <address
          className="not-italic text-xs
                     md:text-sm
                     lg:text-base
                     xl:text-lg
                     2xl:text-xl
        "
        >
          <p className="leading-tight p-1">
            35&nbsp;bis boulevard Victor Hugo
            <br />
            64500 Saint-Jean-de-Luz
            <br />
            France
          </p>
          <p className="p-1">
            <span role="img" aria-label="Téléphone">
              📞
            </span>
            &nbsp;
            <a href="tel:+33559229637">05&nbsp;59&nbsp;22&nbsp;96&nbsp;37</a>
          </p>
        </address>
      </article>
    </div>
  );
}
