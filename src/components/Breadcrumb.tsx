import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link to="/" className="hover:text-foreground transition-colors">
        Shoes
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground">All Products</span>
    </nav>
  );
};

export default Breadcrumb;