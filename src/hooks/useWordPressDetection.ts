
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
      let isWordPress = false;

      // Método 1: Tentar acessar a página principal e verificar no HTML
      try {
        console.log('Tentando acessar HTML da página:', normalizedUrl);
        const response = await fetch(normalizedUrl, { 
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const html = await response.text();
          console.log('HTML obtido, verificando indicadores WordPress...');
          
          // Verificar indicadores mais específicos do WordPress
          const wpIndicators = [
            /wp-content\/themes/i,
            /wp-content\/plugins/i,
            /wp-includes\/js/i,
            /<meta[^>]*generator[^>]*wordpress/i,
            /wp-json\/wp\/v2/i,
            /wp_enqueue_script/i,
            /class=[^>]*wp-/i
          ];
          
          isWordPress = wpIndicators.some(pattern => {
            const match = pattern.test(html);
            if (match) {
              console.log('Indicador WordPress encontrado:', pattern);
            }
            return match;
          });
        }
      } catch (corsError) {
        console.log('CORS bloqueou acesso ao HTML, tentando outros métodos');
      }

      // Método 2: Verificar REST API do WordPress (apenas se HTML não funcionou)
      if (!isWordPress) {
        try {
          const wpApiUrl = normalizedUrl.endsWith('/') 
            ? normalizedUrl + 'wp-json/wp/v2/' 
            : normalizedUrl + '/wp-json/wp/v2/';
          
          console.log('Tentando acessar WordPress REST API:', wpApiUrl);
          const apiResponse = await fetch(wpApiUrl, { 
            method: 'GET',
            mode: 'cors'
          });
          
          if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            // Verificar se a resposta contém estrutura típica da API do WordPress
            if (apiData && (apiData.namespace || apiData.routes || Array.isArray(apiData))) {
              console.log('WordPress REST API detectada');
              isWordPress = true;
            }
          }
        } catch (apiError) {
          console.log('Erro ao acessar WordPress REST API:', apiError);
        }
      }

      // Método 3: Verificar URLs típicas do WordPress (apenas se outros métodos falharam)
      if (!isWordPress) {
        const wpPaths = ['/wp-content/', '/wp-includes/', '/wp-admin/'];
        const hasWpPath = wpPaths.some(path => normalizedUrl.includes(path));
        
        if (hasWpPath) {
          console.log('Path típico do WordPress encontrado na URL');
          isWordPress = true;
        }
      }

      const result = { isWordPress, isLoading: false, error: null, checked: true };
      setResults(prev => ({ ...prev, [url]: result }));
      return result;

    } catch (error) {
      console.error('Erro na detecção de WordPress:', error);
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
