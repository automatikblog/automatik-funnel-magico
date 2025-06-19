
import { useState } from 'react';

export interface FormData {
  area: string;
  areaOutra: string;
  frequencia: string;
  familiaridade: string;
  faturamento: string;
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
}

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    area: '',
    areaOutra: '',
    frequencia: '',
    familiaridade: '',
    faturamento: '',
    investimento: '',
    nome: '',
    email: '',
    telefone: '',
    blogLink: ''
  });

  const [isWordPress, setIsWordPress] = useState<boolean>(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateWordPressStatus = (status: boolean) => {
    setIsWordPress(status);
  };

  const isQualified = () => {
    // Verificar se as respostas desqualificam o lead
    const disqualifyingAnswers = [
      'Não publico, mas quero automatizar isso',
      'Não publico e não tenho planos',
      'Estou planejando começar',
      'Não tenho interesse',
      'Não faturo',
      'Não'
    ];

    const answers = [
      formData.frequencia,
      formData.familiaridade,
      formData.faturamento,
      formData.investimento
    ];

    return !answers.some(answer => disqualifyingAnswers.includes(answer));
  };

  const getCookieValue = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  };

  const getEnrichedData = (): EnrichedData => {
    const urlParams = new URLSearchParams(window.location.search);
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const clickid = getCookieValue('rtkclickid-store');
    
    return {
      ...formData,
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
      isQualified: isQualified()
    };
  };

  const submitForm = async (): Promise<boolean> => {
    try {
      const enrichedData = getEnrichedData();
      
      console.log('Enviando dados:', enrichedData);
      
      const response = await fetch('https://webhooks.automatiklabs.com/webhook/cap-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedData)
      });

      if (response.ok) {
        console.log('Formulário enviado com sucesso!');
        return true;
      } else {
        console.error('Erro ao enviar formulário:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      return false;
    }
  };

  return {
    formData,
    updateField,
    updateWordPressStatus,
    submitForm,
    getEnrichedData,
    isQualified: isQualified()
  };
};
