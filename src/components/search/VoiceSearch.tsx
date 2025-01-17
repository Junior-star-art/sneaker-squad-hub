import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VoiceSearch = ({ onResult }: { onResult: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          onResult(text);
          setIsListening(false);
          navigator.vibrate(50); // Haptic feedback
        };
        recognition.onerror = () => {
          toast.error("Error occurred in voice recognition");
          setIsListening(false);
        };
        setRecognition(recognition);
      }
    }
  }, [onResult]);

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      navigator.vibrate(50); // Haptic feedback
    }
    setIsListening(!isListening);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleListening}
      className="relative"
    >
      {isListening ? (
        <MicOff className="h-5 w-5 text-red-500 animate-pulse" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceSearch;