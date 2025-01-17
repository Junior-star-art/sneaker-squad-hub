import { useState } from "react";
import { Camera, Image as ImageIcon, Palette, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface VisualSearchProps {
  onSearch: (searchData: { type: string; data: string }) => void;
}

const VisualSearch = ({ onSearch }: VisualSearchProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const handleSearch = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        onSearch({ type: searchType, data: base64data });
        setIsDialogOpen(false);
        setSelectedFile(null);
        setPreviewUrl("");
      };
    } catch (error) {
      toast.error("Error processing image");
    } finally {
      setIsLoading(false);
    }
  };

  const startVisualSearch = (type: string) => {
    setSearchType(type);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => startVisualSearch("image")}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Image Search
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => startVisualSearch("color")}
        >
          <Palette className="w-4 h-4 mr-2" />
          Color Search
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => startVisualSearch("style")}
        >
          <Camera className="w-4 h-4 mr-2" />
          Style Match
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => startVisualSearch("barcode")}
        >
          <Scan className="w-4 h-4 mr-2" />
          Scan Barcode
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {searchType === "image" && "Image Search"}
              {searchType === "color" && "Color-based Search"}
              {searchType === "style" && "Style Matching"}
              {searchType === "barcode" && "Barcode Scanning"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Upload Image</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>

            {previewUrl && (
              <div className="relative aspect-square w-full max-w-sm mx-auto">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleSearch}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? "Processing..." : "Search"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisualSearch;