import { Link } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
          New & Featured
        </Link>
        <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
          Men
        </Link>
        <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
          Women
        </Link>
        <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-nike-red">
          Kids
        </Link>
      </div>
    </div>
  );
};