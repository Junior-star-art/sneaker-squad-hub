const ComfortSection = () => {
  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="text-lg font-medium mb-2">Nike Bras</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 max-w-2xl">
            GET COMFORTABLE WITH WINNING
          </h2>
          <p className="text-lg mb-8 max-w-2xl">
            Comfort you want with support you need to power your wins.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition duration-300"
            >
              Shop Womens
            </a>
            <a
              href="#"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition duration-300"
            >
              Shop Teens
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComfortSection;