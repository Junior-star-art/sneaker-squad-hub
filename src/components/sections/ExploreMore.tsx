const categories = [
  {
    title: "Running",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/d3689c2c-80c3-4011-9780-9a9f71da81f6/nike-just-do-it.jpg",
    description: "Find your perfect pace",
    sport: "Running",
    context: ["Competition", "Training", "Road Running", "Trail Running"],
    technology: ["Air", "React", "ZoomX"]
  },
  {
    title: "Basketball",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/7c5678f4-c28d-4862-a8d9-56750f839f12/nike-just-do-it.jpg",
    description: "Elevate your game",
    sport: "Basketball",
    context: ["Indoor Court", "Performance", "Streetball"],
    technology: ["Air Zoom", "Air Max", "Nike Air"]
  },
  {
    title: "Lifestyle",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/nike-just-do-it.jpg",
    description: "Style meets comfort",
    sport: "Lifestyle",
    context: ["Casual", "Street Style", "Athleisure"],
    technology: ["Air Cushioning", "React Foam"]
  },
  {
    title: "Training",
    image: "https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/w_1824,c_limit/fd17b420-b388-4c8a-aaaa-e0a98ddf175f/nike-just-do-it.jpg",
    description: "Push your limits",
    sport: "Training",
    context: ["Gym", "HIIT", "Cross-Training"],
    technology: ["Nike Free", "Flyknit", "Dynamic Support"]
  }
];

const ExploreMore = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
            Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore More</h2>
          <p className="text-gray-600">Discover your perfect fit</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div 
              key={category.title}
              className="group relative overflow-hidden rounded-2xl cursor-pointer animate-fade-up"
            >
              <div className="aspect-[4/5] sm:aspect-square">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 transition-colors">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-sm mb-4 opacity-90">{category.description}</p>
                    <div className="space-y-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="text-xs space-y-1">
                        <p className="font-semibold">Technologies:</p>
                        <p className="text-gray-200">{category.technology.join(" • ")}</p>
                        <p className="font-semibold mt-2">Perfect for:</p>
                        <p className="text-gray-200">{category.context.join(" • ")}</p>
                      </div>
                    </div>
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