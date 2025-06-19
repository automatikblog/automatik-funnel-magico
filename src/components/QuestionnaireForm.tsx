
import React, { useState } from 'react';
import { useFormData } from '../hooks/useFormData';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';
import ContactForm from './ContactForm';
import ThankYouMessage from './ThankYouMessage';
import WelcomeScreen from './WelcomeScreen';
import DisqualifiedScreen from './DisqualifiedScreen';

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
  },
  {
    id: 'investimento',
    title: 'Nossos planos variam entre R$67 e R$1.299 por mês, dependendo do volume de artigos, integrações e recursos avançados. Se você enxergar valor no que a Automatik Blog oferece — e isso fizer sentido pro crescimento do seu blog ou agência — você estaria disposto a fazer esse investimento?',
    options: [
      'Sim',
      'Talvez',
      'Não'
    ]
  }
];

const QuestionnaireForm: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showDisqualified, setShowDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [isWordPress, setIsWordPress] = useState(false);
  const [wordPressChecked, setWordPressChecked] = useState(false);
  
  const { formData, updateField, updateWordPressStatus, submitForm, isQualified } = useFormData();

  const totalSteps = questions.length + 1;

  const handleStart = () => {
    setShowWelcome(false);
  };

  const checkForDisqualification = (field: string, answer: string) => {
    const disqualifyingAnswers = {
      frequencia: ['Não publico, mas quero automatizar isso', 'Não publico e não tenho planos', 'Estou planejando começar'],
      familiaridade: ['Não tenho interesse'],
      faturamento: ['Não faturo'],
      investimento: ['Não']
    };

    if (disqualifyingAnswers[field as keyof typeof disqualifyingAnswers]?.includes(answer)) {
      return field;
    }
    return null;
  };

  const handleQuestionAnswer = (field: string, answer: string) => {
    updateField(field as keyof typeof formData, answer);
    
    // Verificar se a resposta desqualifica o lead
    const disqualificationReason = checkForDisqualification(field, answer);
    if (disqualificationReason) {
      setDisqualificationReason(disqualificationReason);
      setTimeout(() => {
        setShowDisqualified(true);
      }, 300);
      return;
    }
    
    // Não avançar automaticamente se for "Outro(a)" na pergunta 1
    if (field === 'area' && answer === 'Outro(a)') {
      return;
    }
    
    handleNext();
  };

  const handleNext = () => {
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

  const handleTextFieldUpdate = (field: string, value: string) => {
    updateField(field as keyof typeof formData, value);
  };

  const handleContactSubmit = async () => {
    const success = await submitForm();
    if (success) {
      setShowThankYou(true);
    }
  };

  const handleDisqualify = (reason: string) => {
    setDisqualificationReason(reason);
    setShowDisqualified(true);
  };

  const handleWordPressStatusUpdate = (status: boolean) => {
    setIsWordPress(status);
    setWordPressChecked(true);
    updateWordPressStatus(status);
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

  const canAdvanceFromTextInput = () => {
    return formData.area === 'Outro(a)' && formData.areaOutra.trim().length > 0;
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (showDisqualified) {
    return <DisqualifiedScreen reason={disqualificationReason} />;
  }

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
            updateWordPressStatus={handleWordPressStatusUpdate}
            onSubmit={handleContactSubmit}
            onPrevious={handlePrevious}
            onDisqualify={handleDisqualify}
            isWordPress={isWordPress}
            wordPressChecked={wordPressChecked}
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
          onTextFieldUpdate={handleTextFieldUpdate}
          onPrevious={currentStep > 0 ? handlePrevious : undefined}
          onNext={handleNext}
          selectedAnswer={formData[questions[currentStep].id as keyof typeof formData]}
          textFieldValue={formData.areaOutra}
          canAdvance={canAdvanceFromTextInput()}
        />
      </div>
    </div>
  );
};

export default QuestionnaireForm;
