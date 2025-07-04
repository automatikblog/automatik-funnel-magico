
import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { FormData } from '../hooks/useFormData';
import WordPressDetector from './WordPressDetector';

interface ContactFormProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: string) => void;
  updateWordPressStatus: (status: boolean) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  isWordPress: boolean;
  wordPressChecked: boolean;
  isSubmitting?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  formData, 
  updateField, 
  updateWordPressStatus,
  onSubmit, 
  onPrevious,
  isWordPress,
  wordPressChecked,
  isSubmitting = false
}) => {
  const [submitClicked, setSubmitClicked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple clicks
    if (submitClicked || isSubmitting) {
      console.log('=== TENTATIVA DE CLIQUE DUPLICADO BLOQUEADA ===');
      console.log('submitClicked:', submitClicked);
      console.log('isSubmitting:', isSubmitting);
      return;
    }

    console.log('=== INICIANDO SUBMISSÃO DO FORMULÁRIO ===');
    setSubmitClicked(true);
    
    try {
      await onSubmit();
    } finally {
      // Reset after a delay to prevent rapid clicks
      setTimeout(() => {
        setSubmitClicked(false);
      }, 3000);
    }
  };

  const areFieldsFilled = formData.nome && formData.email && formData.telefone && formData.blogLink;
  const isFormValid = areFieldsFilled && wordPressChecked && isWordPress;
  const shouldShowError = wordPressChecked && !isWordPress && formData.blogLink.trim();
  const isButtonDisabled = !isFormValid || isSubmitting || submitClicked;

  console.log('=== ContactForm State Debug ===');
  console.log('isFormValid:', isFormValid);
  console.log('isSubmitting:', isSubmitting);
  console.log('submitClicked:', submitClicked);
  console.log('isButtonDisabled:', isButtonDisabled);

  const getButtonText = () => {
    if (isSubmitting || submitClicked) return 'Enviando...';
    if (!areFieldsFilled) return 'Preencha todos os campos';
    if (!wordPressChecked && formData.blogLink.trim()) return 'Verificando blog...';
    if (shouldShowError) return 'Site não compatível';
    if (isFormValid) return 'Finalizar cadastro';
    return 'Aguardando verificação';
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <button
          onClick={onPrevious}
          className="flex items-center text-gray-400 hover:text-automatik-turquoise transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </button>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
          Quase lá! Vamos finalizar seu cadastro
        </h2>
        <p className="text-gray-400">
          Preencha seus dados para que possamos entrar em contato
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
            Nome completo *
          </label>
          <input
            type="text"
            id="nome"
            required
            value={formData.nome}
            onChange={(e) => updateField('nome', e.target.value)}
            className="w-full px-4 py-3 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-4 py-3 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
            WhatsApp *
          </label>
          <InputMask
            mask="(99) 99999-9999"
            value={formData.telefone}
            onChange={(e) => updateField('telefone', e.target.value)}
          >
            {(inputProps: any) => (
              <input
                {...inputProps}
                type="tel"
                id="telefone"
                required
                className="w-full px-4 py-3 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
                placeholder="(11) 99999-9999"
              />
            )}
          </InputMask>
        </div>

        <div>
          <label htmlFor="blogLink" className="block text-sm font-medium text-gray-300 mb-2">
            Link do seu site/blog *
          </label>
          <WordPressDetector
            url={formData.blogLink}
            onUrlChange={(url) => updateField('blogLink', url)}
            onWordPressDetected={updateWordPressStatus}
          />
          
          {shouldShowError && (
            <div className="mt-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-400">Site não compatível</h4>
                  <p className="text-red-300 text-sm mt-1">
                    Nossa solução foi desenvolvida especificamente para sites WordPress. 
                    Infelizmente não conseguimos ajudar com outros tipos de sites no momento.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center ${
            isFormValid && !isSubmitting && !submitClicked
              ? 'bg-automatik-turquoise text-automatik-dark hover:bg-automatik-turquoise/90 transform hover:scale-[1.02]'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {(isSubmitting || submitClicked) && (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          )}
          {getButtonText()}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
