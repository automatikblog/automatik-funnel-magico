
import React, { useEffect, useState } from 'react';
import { useWordPressDetection } from '../hooks/useWordPressDetection';
import { Loader2, CheckCircle, XCircle, Globe } from 'lucide-react';

interface WordPressDetectorProps {
  url: string;
  onUrlChange: (url: string) => void;
  onWordPressDetected: (isWordPress: boolean) => void;
}

const WordPressDetector: React.FC<WordPressDetectorProps> = ({ 
  url, 
  onUrlChange, 
  onWordPressDetected 
}) => {
  const { detectWordPress, getResult } = useWordPressDetection();
  const [debouncedUrl, setDebouncedUrl] = useState(url);
  const result = getResult(url);

  // Debounce URL changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUrl(url);
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);

  // Trigger detection when debounced URL changes
  useEffect(() => {
    if (debouncedUrl && debouncedUrl.trim() && !result.checked) {
      detectWordPress(debouncedUrl).then((detectionResult) => {
        onWordPressDetected(detectionResult.isWordPress);
      });
    }
  }, [debouncedUrl, detectWordPress, onWordPressDetected, result.checked]);

  const getStatusIcon = () => {
    if (result.isLoading) {
      return <Loader2 className="w-5 h-5 text-automatik-turquoise animate-spin" />;
    }
    
    if (result.error) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    
    if (result.checked) {
      return result.isWordPress 
        ? <CheckCircle className="w-5 h-5 text-green-400" />
        : <XCircle className="w-5 h-5 text-yellow-400" />;
    }
    
    return <Globe className="w-5 h-5 text-gray-400" />;
  };

  const getStatusText = () => {
    if (result.isLoading) {
      return 'Verificando...';
    }
    
    if (result.error) {
      return result.error;
    }
    
    if (result.checked) {
      return result.isWordPress 
        ? '✅ WordPress detectado'
        : '⚠️ Não é WordPress';
    }
    
    return '';
  };

  const getStatusColor = () => {
    if (result.isLoading) return 'text-automatik-turquoise';
    if (result.error) return 'text-red-400';
    if (result.checked) {
      return result.isWordPress ? 'text-green-400' : 'text-yellow-400';
    }
    return 'text-gray-400';
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full px-4 py-3 pr-12 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
          placeholder="https://seublog.com.br"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getStatusIcon()}
        </div>
      </div>
      
      {(result.checked || result.isLoading || result.error) && (
        <div className={`text-sm ${getStatusColor()} animate-fade-in-up`}>
          {getStatusText()}
        </div>
      )}
    </div>
  );
};

export default WordPressDetector;
