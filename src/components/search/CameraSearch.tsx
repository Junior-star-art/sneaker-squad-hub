import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface CameraSearchProps {
  onCapture: (image: string) => void;
}

const CameraSearch = ({ onCapture }: CameraSearchProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [hasFlash, setHasFlash] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      navigator.vibrate(50); // Haptic feedback
      toast.success("Image captured successfully");
    }
  }, [onCapture]);

  const handleCameraSwitch = useCallback(() => {
    setIsFrontCamera(!isFrontCamera);
    navigator.vibrate(50); // Haptic feedback
  }, [isFrontCamera]);

  const checkFlashAvailability = useCallback(async (stream: MediaStream) => {
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    // Check if torch is available without type assertion
    setHasFlash('torch' in capabilities);
  }, []);

  const toggleFlash = useCallback(async () => {
    if (!webcamRef.current) return;
    
    const stream = webcamRef.current.stream;
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    
    try {
      // Cast the constraints to any to bypass TypeScript checking
      // This is safe because we know the torch property exists on supported devices
      await track.applyConstraints({
        advanced: [{ torch: !isFlashOn }] as any
      });
      setIsFlashOn(!isFlashOn);
      navigator.vibrate(50);
    } catch (err) {
      console.error('Error toggling flash:', err);
      toast.error("Failed to toggle flash");
    }
  }, [isFlashOn]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: isFrontCamera ? 'user' : 'environment'
          }}
          onUserMedia={checkFlashAvailability}
          className="w-full"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleCameraSwitch}
            className="rounded-full"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleCapture}
            className="rounded-full"
          >
            <Camera className="h-4 w-4" />
          </Button>
          {hasFlash && (
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleFlash}
              className={`rounded-full ${isFlashOn ? 'bg-yellow-400' : ''}`}
            >
              <span className="block h-4 w-4">⚡</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraSearch;