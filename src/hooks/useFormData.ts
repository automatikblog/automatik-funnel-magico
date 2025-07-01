import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface FormData {
  area: string;
  areaOutra: string;
  frequencia: string;
  familiaridade: string;
  papel: string;
  quantidadeBlogs: string;
  investimento: string;
  nome: string;
  email: string;
  telefone: string;
  blogLink: string;
}

export interface EnrichedData extends FormData {
  cidade?: string;
  estado?: string;
  pais?: string;
  dispositivo: string;
  utms: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
  url_pagina: string;
  data_submissao: string;
  ip?: string;
  user_agent: string;
  clickid?: string;
  form: string;
  isWordPress?: boolean;
  isQualified?: boolean;
  submission_id?: string;
}

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    area: '',
    areaOutra: '',
    frequencia: '',
    familiaridade: '',
    papel: '',
    quantidadeBlogs: '',
    investimento: '',
    nome: '',
    email: '',
    telefone: '',
    blogLink: ''
  });

  const [isWordPress, setIsWordPress] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<{ cidade?: string; estado?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>('');

  // Capturar localização quando o componente for montado
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        console.log('Tentando capturar localização...');
        
        // Tentar usar a API do ipinfo.io (gratuita)
        const response = await fetch('https://ipinfo.io/json?token=');
        if (response.ok) {
          const data = await response.json();
          console.log('Dados de localização capturados:', data);
          
          setLocationData({
            cidade: data.city,
            estado: data.region
          });
        } else {
          console.log('Erro ao capturar localização via ipinfo.io');
        }
      } catch (error) {
        console.log('Erro ao capturar localização:', error);
        
        // Fallback: tentar uma API alternativa
        try {
          const fallbackResponse = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('Dados de localização (fallback) capturados:', fallbackData);
            
            setLocationData({
              cidade: fallbackData.city,
              estado: fallbackData.state_prov
            });
          }
        } catch (fallbackError) {
          console.log('Erro no fallback de localização:', fallbackError);
        }
      }
    };

    fetchLocation();
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateWordPressStatus = (status: boolean) => {
    console.log('WordPress status atualizado para:', status);
    setIsWordPress(status);
  };

  const isQualified = () => {
    // Verificar se as respostas desqualificam o lead
    const disqualifyingAnswers = [
      'Não publico, mas quero automatizar isso',
      'Não publico e não tenho planos',
      'Estou planejando começar',
      'Não tenho interesse',
      'Está parado / sem uso no momento',
      'Ainda não tenho blog, mas pretendo começar',
      'Ainda não tenho retorno, mas quero transformar isso',
      'Ainda não publicamos, mas queremos começar',
      'Não publicamos e não temos planos',
      'Não'
    ];

    const answers = [
      formData.frequencia,
      formData.familiaridade,
      formData.papel,
      formData.investimento
    ];

    return !answers.some(answer => disqualifyingAnswers.includes(answer));
  };

  // Função para ler o cookie exatamente como no exemplo que funciona
  const getCookieRaw = (name: string) => {
    console.log('=== CAPTURANDO COOKIE COM MÉTODO DO EXEMPLO ===');
    console.log('Document.cookie completo:', document.cookie);
    console.log('Procurando cookie:', name);
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    console.log('Value processado:', value);
    console.log('Parts após split:', parts);
    console.log('Parts.length:', parts.length);
    
    const result = (parts.length === 2) ? parts.pop()?.split(';').shift() : '';
    
    console.log('Resultado bruto:', result);
    console.log('Tipo do resultado:', typeof result);
    console.log('Resultado é string vazia?', result === '');
    console.log('Resultado é undefined?', result === undefined);
    
    return result;
  };

  const getEnrichedData = (): EnrichedData => {
    const urlParams = new URLSearchParams(window.location.search);
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Generate unique submission ID if not exists
    const currentSubmissionId = submissionId || uuidv4();
    if (!submissionId) {
      setSubmissionId(currentSubmissionId);
    }
    
    // Capturar o cookie rtkclickid-store no momento do envio usando o método que funciona
    console.log('=== CAPTURANDO CLICKID NO MOMENTO DO ENVIO ===');
    const clickidRaw = getCookieRaw('rtkclickid-store');
    const clickid = clickidRaw || undefined;
    
    console.log('Clickid capturado (raw):', clickidRaw);
    console.log('Clickid final:', clickid);
    console.log('Tipo do clickid final:', typeof clickid);
    console.log('Dados de localização incluídos:', locationData);
    
    return {
      ...formData,
      cidade: locationData.cidade,
      estado: locationData.estado,
      dispositivo: isMobile ? 'mobile' : 'desktop',
      utms: {
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
      },
      url_pagina: window.location.href,
      data_submissao: new Date().toISOString(),
      user_agent: userAgent,
      pais: 'Brasil',
      clickid: clickid,
      form: 'lovableform',
      isWordPress: isWordPress,
      isQualified: isQualified(),
      submission_id: currentSubmissionId
    };
  };

  const submitForm = async (): Promise<boolean> => {
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('=== TENTATIVA DE SUBMISSÃO DUPLICADA BLOQUEADA ===');
      console.log('Status atual de submissão:', isSubmitting);
      return false;
    }

    try {
      setIsSubmitting(true);
      const enrichedData = getEnrichedData();
      
      console.log('=== INICIANDO SUBMISSÃO ÚNICA ===');
      console.log('ID da submissão:', enrichedData.submission_id);
      console.log('Timestamp:', enrichedData.data_submissao);
      console.log('Status isSubmitting:', isSubmitting);
      
      const response = await fetch('https://webhooks.automatiklabs.com/webhook/cap-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedData)
      });

      if (response.ok) {
        console.log('=== FORMULÁRIO ENVIADO COM SUCESSO ===');
        console.log('ID da submissão enviada:', enrichedData.submission_id);
        return true;
      } else {
        console.error('Erro ao enviar formulário:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      return false;
    } finally {
      // Reset submission state after a delay to prevent immediate re-submissions
      setTimeout(() => {
        setIsSubmitting(false);
        console.log('Status de submissão resetado');
      }, 2000);
    }
  };

  return {
    formData,
    updateField,
    updateWordPressStatus,
    submitForm,
    getEnrichedData,
    isQualified: isQualified(),
    isSubmitting
  };
};
