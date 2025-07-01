import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useFormData } from '../hooks/useFormData';
import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionStep';
import WelcomeScreen from './WelcomeScreen';

// Lazy load components que não são críticos para o primeiro carregamento
const ContactForm = lazy(() => import('./ContactForm'));
const ThankYouMessage = lazy(() => import('./ThankYouMessage'));
const DisqualifiedScreen = lazy(() => import('./DisqualifiedScreen'));

// Loading component simples e leve
const LoadingSpinner = () => (
  <div className="min-h-screen bg-automatik-dark flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-automatik-turquoise border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
    title: 'Com que frequência você (ou sua empresa) publica artigos — no seu blog ou nos dos seus clientes?',
    options: [
      'Publicamos com frequência (15 ou mais por mês)',
      'Publicamos de vez em quando (até 14 por mês)',
      'Já publicamos, mas queremos escalar a produção',
      'Ainda não publicamos, mas queremos começar',
      'Não publicamos e não temos planos'
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
    id: 'papel',
    title: 'Qual é o papel do seu blog ou dos blogs que você gerencia hoje?',
    options: [
      'É um dos principais canais de faturamento (meu ou dos meus clientes)',
      'Uso como canal de atração de clientes ou geração de autoridade',
      'Ainda não tenho retorno, mas quero transformar isso',
      'Está parado / sem uso no momento',
      'Ainda não tenho blog, mas pretendo começar'
    ]
  },
  {
    id: 'quantidadeBlogs',
    title: 'Você gerencia quantos blogs atualmente (seja seu ou de clientes)?',
    options: [
      'Apenas 1 blog',
      'De 2 a 3 blogs',
      'De 4 a 10 blogs',
      'Mais de 10 blogs'
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
  const [showAlreadySubmitted, setShowAlreadySubmitted] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [isWordPress, setIsWordPress] = useState(false);
  const [wordPressChecked, setWordPressChecked] = useState(false);
  
  const { formData, updateField, updateWordPressStatus, submitForm, isQualified, isSubmitting } = useFormData();

  const totalSteps = questions.length + 1;

  // Verificar se já preencheu na última semana ou foi desqualificado
  useEffect(() => {
    const lastSubmission = localStorage.getItem('automatik-form-submission');
    const disqualificationData = localStorage.getItem('automatik-disqualification');
    
    if (lastSubmission) {
      const submissionDate = new Date(lastSubmission);
      const today = new Date();
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Verificar se foi preenchido na última semana
      if (submissionDate > oneWeekAgo) {
        // Se foi desqualificado, mostrar tela de desqualificação
        if (disqualificationData) {
          const disqualificationInfo = JSON.parse(disqualificationData);
          setDisqualificationReason(disqualificationInfo.reason);
          setShowDisqualified(true);
        } else {
          // Se foi qualificado, mostrar tela de obrigado
          setShowAlreadySubmitted(true);
        }
        return;
      } else {
        // Se passou mais de uma semana, limpar os dados
        localStorage.removeItem('automatik-form-submission');
        localStorage.removeItem('automatik-disqualification');
      }
    }
  }, []);

  const handleStart = () => {
    setShowWelcome(false);
  };

  const checkForQualification = () => {
    const disqualifyingAnswers = {
      frequencia: ['Ainda não publicamos, mas queremos começar', 'Não publicamos e não temos planos'],
      familiaridade: ['Não tenho interesse'],
      papel: ['Está parado / sem uso no momento', 'Ainda não tenho blog, mas pretendo começar', 'Ainda não tenho retorno, mas quero transformar isso'],
      investimento: ['Não']
    };

    for (const [field, answers] of Object.entries(disqualifyingAnswers)) {
      if (answers.includes(formData[field as keyof typeof formData])) {
        return field;
      }
    }
    return null;
  };

  const shouldSkipQuantidadeBlogsQuestion = (currentPapelValue: string) => {
    console.log('Verificando se deve pular pergunta de quantidade de blogs:', currentPapelValue);
    return currentPapelValue === 'Ainda não tenho blog, mas pretendo começar';
  };

  const shouldGoDirectToEbook = (currentPapelValue: string) => {
    console.log('Verificando se deve ir direto para e-book:', currentPapelValue);
    return currentPapelValue === 'Ainda não tenho blog, mas pretendo começar';
  };

  const getNextStep = (currentIndex: number, currentAnswer?: string) => {
    console.log('getNextStep chamado:', { currentIndex, currentAnswer, currentPapel: formData.papel });
    
    // Se estamos na pergunta do papel (índice 3) e a resposta foi "Ainda não tenho blog"
    if (currentIndex === 3) {
      const papelValue = currentAnswer || formData.papel;
      if (shouldGoDirectToEbook(papelValue)) {
        console.log('Indo direto para e-book');
        // Marcar submissão e desqualificação
        localStorage.setItem('automatik-form-submission', new Date().toISOString());
        localStorage.setItem('automatik-disqualification', JSON.stringify({
          reason: 'papel',
          date: new Date().toISOString()
        }));
        setDisqualificationReason('papel');
        setShowDisqualified(true);
        return currentIndex; // Não avançar passo
      }
      if (shouldSkipQuantidadeBlogsQuestion(papelValue)) {
        console.log('Pulando pergunta de quantidade de blogs');
        return 5; // Pular para a pergunta do investimento (índice 5)
      }
    }
    return currentIndex + 1;
  };

  const getPreviousStep = (currentIndex: number) => {
    // Se estamos na pergunta do investimento (índice 5) e devemos pular quantidade de blogs
    if (currentIndex === 5 && shouldSkipQuantidadeBlogsQuestion(formData.papel)) {
      return 3; // Voltar para a pergunta do papel (índice 3)
    }
    return currentIndex - 1;
  };

  const handleQuestionAnswer = (field: string, answer: string) => {
    console.log('Resposta selecionada:', { field, answer });
    updateField(field as keyof typeof formData, answer);
    
    // Não avançar automaticamente se for "Outro(a)" na pergunta 1
    if (field === 'area' && answer === 'Outro(a)') {
      return;
    }
    
    // Para outras perguntas, avançar automaticamente após um delay
    setTimeout(() => {
      handleNext(field === 'papel' ? answer : undefined);
    }, 300);
  };

  const handleNext = (currentAnswer?: string) => {
    const nextStep = getNextStep(currentStep, currentAnswer);
    console.log('Próximo passo calculado:', nextStep);
    
    // Se não mudou o passo, significa que foi para e-book
    if (nextStep === currentStep && showDisqualified) {
      return;
    }
    
    if (nextStep < questions.length) {
      setCurrentStep(nextStep);
    } else {
      setShowContactForm(true);
    }
  };

  const handleTextFieldUpdate = (field: string, value: string) => {
    updateField(field as keyof typeof formData, value);
  };

  const handleContactSubmit = async () => {
    console.log('=== handleContactSubmit Debug ===');
    console.log('isWordPress:', isWordPress);
    console.log('wordPressChecked:', wordPressChecked);
    console.log('blogLink:', formData.blogLink);
    
    // Verificar qualificação antes de enviar
    const disqualificationReason = checkForQualification();
    
    // Verificar se não é WordPress
    if (!isWordPress && wordPressChecked) {
      console.log('Desqualificado: não é WordPress');
      localStorage.setItem('automatik-form-submission', new Date().toISOString());
      localStorage.setItem('automatik-disqualification', JSON.stringify({
        reason: 'wordpress',
        date: new Date().toISOString()
      }));
      setDisqualificationReason('wordpress');
      setShowDisqualified(true);
      return;
    }
    
    // Se foi desqualificado por outras razões
    if (disqualificationReason) {
      console.log('Desqualificado por:', disqualificationReason);
      localStorage.setItem('automatik-form-submission', new Date().toISOString());
      localStorage.setItem('automatik-disqualification', JSON.stringify({
        reason: disqualificationReason,
        date: new Date().toISOString()
      }));
      setDisqualificationReason(disqualificationReason);
      setShowDisqualified(true);
      return;
    }
    
    console.log('Enviando formulário...');
    const success = await submitForm();
    if (success) {
      // Marcar como preenchido - qualificado (sem desqualificação)
      localStorage.setItem('automatik-form-submission', new Date().toISOString());
      setShowThankYou(true);
    }
  };

  const handleWordPressStatusUpdate = (status: boolean) => {
    console.log('=== WordPress Status Update ===');
    console.log('Novo status:', status);
    console.log('Status anterior:', isWordPress);
    
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
      const prevStep = getPreviousStep(currentStep);
      setCurrentStep(prevStep);
    }
  };

  const canAdvanceFromTextInput = () => {
    return formData.area === 'Outro(a)' && formData.areaOutra.trim().length > 0;
  };

  if (showAlreadySubmitted) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ThankYouMessage />
      </Suspense>
    );
  }

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (showDisqualified) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <DisqualifiedScreen reason={disqualificationReason} />
      </Suspense>
    );
  }

  if (showThankYou) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ThankYouMessage />
      </Suspense>
    );
  }

  if (showContactForm) {
    return (
      <div className="min-h-screen bg-automatik-dark flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <ProgressBar currentStep={totalSteps} totalSteps={totalSteps} />
          <Suspense fallback={<LoadingSpinner />}>
            <ContactForm 
              formData={formData}
              updateField={updateField}
              updateWordPressStatus={handleWordPressStatusUpdate}
              onSubmit={handleContactSubmit}
              onPrevious={handlePrevious}
              isWordPress={isWordPress}
              wordPressChecked={wordPressChecked}
              isSubmitting={isSubmitting}
            />
          </Suspense>
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
