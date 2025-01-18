import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="#" 
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red transition-colors duration-200 active:bg-gray-50 rounded-md"
            >
              New & Featured
            </Link>
            <Link 
              to="#" 
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red transition-colors duration-200 active:bg-gray-50 rounded-md"
            >
              Men
            </Link>
            <Link 
              to="#" 
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red transition-colors duration-200 active:bg-gray-50 rounded-md"
            >
              Women
            </Link>
            <Link 
              to="#" 
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red transition-colors duration-200 active:bg-gray-50 rounded-md"
            >
              Kids
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};