declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
  interface UserMetadata {
    full_name?: string;
    avatar_url?: string;
  }
}

export {};