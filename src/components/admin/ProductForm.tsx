
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductFormMain } from "./product/ProductFormMain";
import { BulkImportModal } from "./product/BulkImportModal";
import { ProductPreview } from "./ProductPreview";
import { InventoryLog } from "./InventoryLog";

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);
  
  const formValues = {
    name: product?.name || '',
    price: product?.price || '0',
    description: product?.description || '',
    stock: product?.stock || 0,
    images: images,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setBulkUploadModalOpen(true)}
        >
          Bulk Import
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(true)}
        >
          Preview
        </Button>
      </div>

      <ProductFormMain 
        product={product}
        images={images}
        setImages={setImages}
        onSuccess={onSuccess}
      />

      {product && (
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Inventory Management</h3>
          <InventoryLog
            productId={product.id}
            currentStock={product.stock}
            onSuccess={onSuccess}
          />
        </div>
      )}

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[425px]">
          <ProductPreview 
            name={formValues.name}
            price={String(formValues.price)}
            description={formValues.description}
            stock={formValues.stock}
            images={images}
          />
        </DialogContent>
      </Dialog>

      <BulkImportModal
        open={bulkUploadModalOpen}
        onOpenChange={setBulkUploadModalOpen}
        onSuccess={onSuccess}
      />
    </div>
  );
}
