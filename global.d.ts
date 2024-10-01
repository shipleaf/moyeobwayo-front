// global.d.ts
interface Kakao {
    init: (key: string) => void;
    isInitialized: () => boolean;
    Auth: {
      authorize: (options: { redirectUri: string; scope?: string }) => void;
    };
  }
  
  interface Window {
    Kakao?: Kakao;
  }
