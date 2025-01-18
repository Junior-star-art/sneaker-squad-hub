const ComfortSection = () => {
  return (
    <div className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
            Nike Bras
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 max-w-2xl leading-tight">
            GET COMFORTABLE WITH WINNING
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Comfort you want with support you need to power your wins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="#"
              className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-full hover:bg-gray-900 transition duration-300 text-center"
            >
              Shop Womens
            </a>
            <a
              href="#"
              className="w-full sm:w-auto bg-white text-black border-2 border-black px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 text-center"
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