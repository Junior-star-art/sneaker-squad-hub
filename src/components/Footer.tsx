const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-bold mb-4">FIND A STORE</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Store Locator</a></li>
              <li><a href="#" className="hover:text-white">Nike Retail</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4">GET HELP</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Order Status</a></li>
              <li><a href="#" className="hover:text-white">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4">ABOUT NIKE</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">News</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Investors</a></li>
              <li><a href="#" className="hover:text-white">Sustainability</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4">PROMOTIONS</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Student</a></li>
              <li><a href="#" className="hover:text-white">Military</a></li>
              <li><a href="#" className="hover:text-white">Teacher</a></li>
              <li><a href="#" className="hover:text-white">First Responders</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm">
          <p>&copy; 2024 Nike, Inc. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;