const Hero = () => {
  return (
    <div className="relative pt-16">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/d3689c2c-80c3-4011-9780-9a9f71da81f6/nike-just-do-it.jpg"
          alt="Hero background"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          JUST DO IT
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl">
          Your next favorite pair of Nike shoes is waiting for you. Shop the latest styles and innovations.
        </p>
        <div className="mt-10">
          <a
            href="#"
            className="inline-block bg-white text-black px-8 py-3 text-base font-medium rounded-full hover:bg-gray-100 transition duration-300"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;