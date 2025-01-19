const Hero = () => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-black to-gray-800">
          <iframe
            src="https://www.youtube.com/embed/your-video-id?autoplay=1&mute=1&controls=0&loop=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="relative z-10 text-white text-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl md:text-2xl">Discover amazing products</p>
      </div>
    </div>
  );
};

export default Hero;