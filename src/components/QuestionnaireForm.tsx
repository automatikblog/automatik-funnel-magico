
import React, { useState } from 'react';
import { useFormData } from '../hooks/useFormData';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';
import ContactForm from './ContactForm';
import ThankYouMessage from './ThankYouMessage';

const questions = [
  {
    id: 'area',
    title: 'Em qual destas áreas você atua atualmente?',
    options: [
      'Profissional de SEO',
      'Redator(a) ou criador de conteúdo',
      'Dono(a) de blog ou portal de notícias',
      'Agência de marketing ou publicidade',
      'Empresário ou gestor de marketing',
      'Outro(a)'
    ]
  },
  {
    id: 'frequencia',
    title: 'Com que frequência você publica artigos ou conteúdos no seu site/blog?',
    options: [
      'Público com frequência (mais de 15/mês)',
      'Publico de vez em quando (2 a 6/mês)',
      'Estou planejando começar',
      'Não publico, mas quero automatizar isso',
      'Não publico e não tenho planos'
    ]
  },
  {
    id: 'familiaridade',
    title: 'Qual o seu nível de familiaridade com ferramentas de IA para criação de conteúdo?',
    options: [
      'Já uso e quero escalar',
      'Conheço, mas nunca usei',
      'Nunca ouvi falar, mas tenho interesse',
      'Não tenho interesse'
    ]
  },
  {
    id: 'faturamento',
    title: 'Quanto você fatura com seu blog ou site atualmente?',
    options: [
      'Não faturo',
      'De R$ 1 a R$ 500',
      'De R$ 500 a R$ 2.000',
      'De R$ 2.000 a R$ 5.000',
      'De R$ 5.000 a R$ 10.000',
      'Acima de R$ 10.000'
    ]
  }
];

const QuestionnaireForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const { formData, updateField, submitForm } = useFormData();

  const totalSteps = questions.length + 1; // +1 para o formulário de contato

  const handleQuestionAnswer = (field: string, answer: string) => {
    updateField(field as keyof typeof formData, answer);
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setShowContactForm(true);
      }, 300);
    }
  };

  const handleContactSubmit = async () => {
    const success = await submitForm();
    if (success) {
      setShowThankYou(true);
    }
  };

  const handlePrevious = () => {
    if (showContactForm) {
      setShowContactForm(false);
      return;
    }
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (showThankYou) {
    return <ThankYouMessage />;
  }

  if (showContactForm) {
    return (
      <div className="min-h-screen bg-automatik-dark flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <ProgressBar currentStep={totalSteps} totalSteps={totalSteps} />
          <ContactForm 
            formData={formData}
            updateField={updateField}
            onSubmit={handleContactSubmit}
            onPrevious={handlePrevious}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-automatik-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />
        <QuestionStep
          question={questions[currentStep]}
          onAnswer={handleQuestionAnswer}
          onPrevious={currentStep > 0 ? handlePrevious : undefined}
          selectedAnswer={formData[questions[currentStep].id as keyof typeof formData]}
        />
      </div>
    </div>
  );
};

export default QuestionnaireForm;
