
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useSlugGenerator(productName: string, productId?: string) {
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const { toast } = useToast();

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const checkSlugUniqueness = async (name: string) => {
    if (!name) return true;
    
    setIsCheckingSlug(true);
    const slug = generateSlug(name);
    
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .neq("id", productId || '') // Exclude current product when editing
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      if (data) {
        toast({
          title: "Name already exists",
          description: "A product with this name already exists",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error checking slug uniqueness:", error);
      return false;
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const generateAndCheckSlug = async (name: string) => {
    const slug = generateSlug(name);
    const isUnique = await checkSlugUniqueness(name);
    if (!isUnique) {
      throw new Error("A product with this name already exists");
    }
    return slug;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (productName) {
        void checkSlugUniqueness(productName);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [productName]);

  return {
    isCheckingSlug,
    generateSlug,
    checkSlugUniqueness,
    generateAndCheckSlug
  };
}
