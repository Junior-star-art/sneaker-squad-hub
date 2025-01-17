const categories = [
  {
    title: "Running",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/d3689c2c-80c3-4011-9780-9a9f71da81f6/nike-just-do-it.jpg",
  },
  {
    title: "Basketball",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/7c5678f4-c28d-4862-a8d9-56750f839f12/nike-just-do-it.jpg",
  },
  {
    title: "Lifestyle",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/nike-just-do-it.jpg",
  },
  {
    title: "Training",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/nike-just-do-it.jpg",
  }
];

const ExploreMore = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Explore More</h2>
        <p className="text-nike-gray text-center mb-12">Discover your perfect fit</p>
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
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="flex items-center justify-center h-full">
                    <h3 className="text-white text-2xl font-bold">{category.title}</h3>
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