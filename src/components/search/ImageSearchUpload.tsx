import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageSearchUploadProps {
  onImageSelect: (image: string) => void;
}

const ImageSearchUpload = ({ onImageSelect }: ImageSearchUploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setShowCropper(true);
        navigator.vibrate(50); // Haptic feedback
      };
      reader.readAsDataURL(file);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(0), 500);
        }
      }, 100);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1
  });

  const handleCrop = (cropper: any) => {
    const canvas = cropper.getCanvas();
    if (canvas) {
      const croppedImage = canvas.toDataURL();
      onImageSelect(croppedImage);
      setShowCropper(false);
      setImage(null);
      toast.success("Image cropped successfully");
      navigator.vibrate([50, 50]); // Haptic feedback pattern
    }
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop an image here, or click to select
        </p>
      </div>

      {uploadProgress > 0 && (
        <Progress value={uploadProgress} className="mt-4" />
      )}

      {image && (
        <Dialog open={showCropper} onOpenChange={setShowCropper}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Crop Image</DialogTitle>
            </DialogHeader>
            <div className="h-[400px]">
              <Cropper
                src={image}
                className="h-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCropper(false);
                  setImage(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCrop}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ImageSearchUpload;