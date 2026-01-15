import { useState, useEffect, useCallback } from 'react';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text) => {
    if (!text) return;

    // specific behavior: if already speaking, stop.
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      // If we just wanted to stop, we return. 
      // But usually "Read" button means "Start Reading".
      // We will handle the toggle logic in the UI component, 
      // but here we ensure a clean slate.
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, cancel, isSpeaking };
}
