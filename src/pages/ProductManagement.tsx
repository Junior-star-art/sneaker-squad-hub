
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/product/ImageUpload";
import { InventoryManager } from "@/components/product/InventoryManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Upload, Download } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  low_stock_threshold: number;
  slug: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    low_stock_threshold: '5'
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchProducts();
  }, [user, navigate]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        low_stock_threshold: parseInt(newProduct.low_stock_threshold),
        images: [],
        slug: generateSlug(newProduct.name)
      };

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: '',
        low_stock_threshold: '5'
      });

      toast({
        title: "Product created",
        description: "New product has been added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      
      toast({
        title: "Product deleted",
        description: "Product has been removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImageChange = async (productId: string, newImages: string[]) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ images: newImages })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, images: newImages } : p
      ));

      toast({
        title: "Images updated",
        description: "Product images have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating images",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock: newStock } : p
      ));
    } catch (error: any) {
      toast({
        title: "Error updating stock",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text !== 'string') return;

        const rows = text.split('\n');
        const headers = rows[0].split(',');
        const products = rows.slice(1).map(row => {
          const values = row.split(',');
          const product: any = {};
          headers.forEach((header, index) => {
            product[header.trim()] = values[index]?.trim();
          });
          return product;
        });

        const productsToInsert = products.map(p => ({
          name: p.name,
          description: p.description,
          price: parseFloat(p.price),
          stock: parseInt(p.stock),
          low_stock_threshold: parseInt(p.low_stock_threshold || '5'),
          slug: generateSlug(p.name)
        }));

        const { error } = await supabase
          .from('products')
          .insert(productsToInsert);

        if (error) throw error;

        fetchProducts();
        toast({
          title: "Products imported",
          description: `Successfully imported ${products.length} products`,
        });
      };
      reader.readAsText(file);
    } catch (error: any) {
      toast({
        title: "Error importing products",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = () => {
    const headers = ['name', 'description', 'price', 'stock', 'low_stock_threshold'];
    const csvContent = [
      headers.join(','),
      ...products.map(product => 
        headers.map(header => product[header as keyof Product]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="flex gap-4">
          <label className="cursor-pointer">
            <Input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleBulkImport}
            />
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </label>
          <Button variant="outline" onClick={handleBulkExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Product</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Initial Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lowStock">Low Stock Threshold</Label>
                  <Input
                    id="lowStock"
                    type="number"
                    min="0"
                    value={newProduct.low_stock_threshold}
                    onChange={(e) => setNewProduct({ ...newProduct, low_stock_threshold: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleCreateProduct}>
                  Create Product
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  ${product.price}
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Product Images</h3>
                <ImageUpload 
                  images={product.images || []}
                  onChange={(newImages) => handleImageChange(product.id, newImages)}
                  maxImages={5}
                />
              </div>

              <InventoryManager
                productId={product.id}
                currentStock={product.stock}
                lowStockThreshold={product.low_stock_threshold}
                onUpdate={(newStock) => handleStockUpdate(product.id, newStock)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
