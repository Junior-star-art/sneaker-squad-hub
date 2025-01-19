const Hero = () => {
  return (
    <div className="relative pt-16">
      <div className="absolute inset-0">
        <iframe
          className="w-full h-full object-cover"
          src="https://www.youtube.com/embed/dHYTo6Da2aA?autoplay=1&controls=0&mute=1&loop=1&playlist=dHYTo6Da2aA"
          title="Nike promotional video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          JUST DO IT
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl">
          Discover the latest Nike innovations, top performance shoes, and trending styles. Shop Nike.com for the finest selection of athletic footwear.
        </p>
        <div className="mt-10">
          <a
            href="#products"
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