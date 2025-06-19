
import { useState, useCallback } from 'react';

export interface WordPressDetectionResult {
  isWordPress: boolean;
  isLoading: boolean;
  error: string | null;
  checked: boolean;
}

export const useWordPressDetection = () => {
  const [results, setResults] = useState<Record<string, WordPressDetectionResult>>({});

  const detectWordPress = useCallback(async (url: string): Promise<WordPressDetectionResult> => {
    if (!url || !url.trim()) {
      return { isWordPress: false, isLoading: false, error: null, checked: false };
    }

    // Normalizar URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    setResults(prev => ({
      ...prev,
      [url]: { isWordPress: false, isLoading: true, error: null, checked: false }
    }));

    try {
      // Método 1: Verificar REST API do WordPress
      const wpApiUrl = normalizedUrl.endsWith('/') 
        ? normalizedUrl + 'wp-json/wp/v2/' 
        : normalizedUrl + '/wp-json/wp/v2/';
      
      try {
        const apiResponse = await fetch(wpApiUrl, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        
        // Se chegou aqui sem erro, provavelmente é WordPress
        const result = { isWordPress: true, isLoading: false, error: null, checked: true };
        setResults(prev => ({ ...prev, [url]: result }));
        return result;
      } catch (apiError) {
        // Continue para outras verificações
      }

      // Método 2: Verificar URLs típicas do WordPress
      const wpPaths = ['/wp-content/', '/wp-includes/', '/wp-admin/'];
      const hasWpPath = wpPaths.some(path => normalizedUrl.includes(path));
      
      if (hasWpPath) {
        const result = { isWordPress: true, isLoading: false, error: null, checked: true };
        setResults(prev => ({ ...prev, [url]: result }));
        return result;
      }

      // Método 3: Tentar acessar a página principal e verificar no HTML
      try {
        const response = await fetch(normalizedUrl, { 
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const html = await response.text();
          
          // Verificar indicadores comuns do WordPress
          const wpIndicators = [
            /wp-content/i,
            /wp-includes/i,
            /generator.*wordpress/i,
            /class.*wp-/i,
            /wp-json/i,
            /wp_enqueue_script/i
          ];
          
          const isWordPress = wpIndicators.some(pattern => pattern.test(html));
          const result = { isWordPress, isLoading: false, error: null, checked: true };
          setResults(prev => ({ ...prev, [url]: result }));
          return result;
        }
      } catch (corsError) {
        // CORS bloqueou, mas isso é normal
        console.log('CORS blocked, using fallback detection');
      }

      // Fallback: Verificar apenas pela URL
      const urlBasedDetection = /wordpress|wp-|/wp/i.test(normalizedUrl);
      const result = { isWordPress: urlBasedDetection, isLoading: false, error: null, checked: true };
      setResults(prev => ({ ...prev, [url]: result }));
      return result;

    } catch (error) {
      const result = { 
        isWordPress: false, 
        isLoading: false, 
        error: 'Não foi possível verificar o site', 
        checked: true 
      };
      setResults(prev => ({ ...prev, [url]: result }));
      return result;
    }
  }, []);

  const getResult = (url: string): WordPressDetectionResult => {
    return results[url] || { isWordPress: false, isLoading: false, error: null, checked: false };
  };

  return { detectWordPress, getResult };
};
