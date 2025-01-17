const categories = [
  {
    title: "Running",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/d3689c2c-80c3-4011-9780-9a9f71da81f6/nike-just-do-it.jpg",
    description: "Find your perfect pace"
  },
  {
    title: "Basketball",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/7c5678f4-c28d-4862-a8d9-56750f839f12/nike-just-do-it.jpg",
    description: "Elevate your game"
  },
  {
    title: "Lifestyle",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/nike-just-do-it.jpg",
    description: "Style meets comfort"
  },
  {
    title: "Training",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/nike-just-do-it.jpg",
    description: "Push your limits"
  }
];

const ExploreMore = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore More</h2>
          <p className="text-nike-gray">Discover your perfect fit</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.title}
              className="group relative overflow-hidden rounded-lg cursor-pointer animate-fade-up"
            >
              <div className="aspect-square">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors">
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMore;