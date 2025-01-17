import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, Flashlight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface CameraSearchProps {
  onCapture: (image: string) => void;
}

// Extended type definitions for MediaTrackCapabilities and MediaTrackConstraintSet
interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

const CameraSearch = ({ onCapture }: CameraSearchProps) => {
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    facingMode: isFrontCamera ? "user" : "environment",
    width: 1280,
    height: 720
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
        navigator.vibrate(100); // Haptic feedback
        toast.success("Photo captured!");
      }
    }
  }, [onCapture]);

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    navigator.vibrate(50); // Haptic feedback
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
    navigator.vibrate(50); // Haptic feedback
    
    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      if (stream) {
        const track = stream.getVideoTracks()[0];
        const capabilities = track?.getCapabilities() as ExtendedMediaTrackCapabilities;
        
        if (capabilities?.torch) {
          const constraints: ExtendedMediaTrackConstraintSet = {
            advanced: [{ torch: !isFlashOn }]
          };
          
          track.applyConstraints(constraints as MediaTrackConstraints).catch(() => {
            toast.error("Flash control not supported on this device");
          });
        } else {
          toast.error("Flash control not supported on this device");
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full"
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFlash}
            className="rounded-full bg-black/50 backdrop-blur-sm"
          >
            <Flashlight className={`h-5 w-5 ${isFlashOn ? 'text-yellow-300' : 'text-white'}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={capture}
            className="rounded-full bg-black/50 backdrop-blur-sm"
          >
            <Camera className="h-5 w-5 text-white" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleCamera}
            className="rounded-full bg-black/50 backdrop-blur-sm"
          >
            <RotateCcw className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraSearch;