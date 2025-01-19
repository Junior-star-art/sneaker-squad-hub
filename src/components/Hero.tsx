const Hero = () => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-gray-800/70 z-10" />
          <iframe
            src="https://www.youtube.com/embed/1VNQB0SYLII?autoplay=1&mute=1&controls=0&loop=1&playlist=1VNQB0SYLII&playsinline=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full object-cover"
            title="Nike promotional video"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      </div>
      <div className="relative z-20 text-white text-center p-8 animate-fade-up">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl md:text-2xl">Discover amazing products</p>
      </div>
    </div>
  );
};

export default Hero;