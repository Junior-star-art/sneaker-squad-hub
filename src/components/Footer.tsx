import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Company Name</h2>
            <p className="mt-2 text-gray-600">Your company description goes here.</p>
            <Link to="/about" className="text-blue-600 hover:underline">About Us</Link>
            <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/junior-motsoko-970a311b4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Resources</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:underline">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase">Subscribe</h3>
            <p className="mt-2 text-gray-600">Join our newsletter for the latest updates.</p>
            <form className="mt-4">
              <input
                type="email"
                placeholder="Your email"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <button type="submit" className="mt-2 bg-blue-600 text-white rounded-md p-2 w-full">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
