
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FormData } from '../hooks/useFormData';

interface ContactFormProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onPrevious: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  formData, 
  updateField, 
  onSubmit, 
  onPrevious 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    updateField('telefone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit();
    setIsSubmitting(false);
  };

  const isFormValid = formData.nome && formData.email && formData.telefone;

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
          Quase pronto! 🚀
        </h2>
        <p className="text-gray-400">
          Preencha seus dados para receber o resultado personalizado
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
            value={formData.nome}
            onChange={(e) => updateField('nome', e.target.value)}
            className="w-full px-4 py-3 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-4 py-3 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
            WhatsApp *
          </label>
          <input
            type="tel"
            id="telefone"
            value={formData.telefone}
            onChange={handlePhoneChange}
            className="w-full px-4 py-3 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
            placeholder="(11) 99999-9999"
            required
          />
        </div>

        <div>
          <label htmlFor="blogLink" className="block text-sm font-medium text-gray-300 mb-2">
            Link do seu blog WordPress (opcional)
          </label>
          <input
            type="url"
            id="blogLink"
            value={formData.blogLink}
            onChange={(e) => updateField('blogLink', e.target.value)}
            className="w-full px-4 py-3 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
            placeholder="https://seublog.com.br"
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all duration-300 ${
            isFormValid && !isSubmitting
              ? 'bg-gradient-to-r from-automatik-turquoise to-automatik-purple hover:shadow-lg hover:scale-105' 
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <span>Finalizar questionário</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
