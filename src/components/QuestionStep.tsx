
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  options: string[];
}

interface QuestionStepProps {
  question: Question;
  onAnswer: (field: string, answer: string) => void;
  onTextFieldUpdate?: (field: string, value: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  selectedAnswer?: string;
  textFieldValue?: string;
  canAdvance?: boolean;
}

const QuestionStep: React.FC<QuestionStepProps> = ({ 
  question, 
  onAnswer, 
  onTextFieldUpdate,
  onPrevious,
  onNext,
  selectedAnswer,
  textFieldValue,
  canAdvance = false
}) => {
  const showTextInput = question.id === 'area' && selectedAnswer === 'Outro(a)';
  const isQuestion5 = question.id === 'investimento';

  const formatQuestion5Text = (text: string) => {
    if (!isQuestion5) return text;
    
    return (
      <div className="space-y-4">
        <p>Nossos planos variam entre <span className="font-bold text-automatik-turquoise">R$67 e R$1.299 por mês</span>, dependendo do volume de artigos, integrações e recursos avançados.</p>
        <p>Se você enxergar valor no que a Automatik Blog oferece — e isso fizer sentido pro crescimento do seu blog ou agência — você estaria disposto a fazer esse investimento?</p>
      </div>
    );
  };

  const handleOptionClick = (option: string) => {
    onAnswer(question.id, option);
    
    // Não avançar automaticamente se for "Outro(a)" na pergunta 1
    if (question.id === 'area' && option === 'Outro(a)') {
      return;
    }
    
    // Para outras perguntas, não avançar automaticamente
    // O avanço será controlado pelo componente pai
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="flex items-center text-gray-400 hover:text-automatik-turquoise transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
          {isQuestion5 ? 'Sobre o investimento:' : question.title}
        </h2>
        {isQuestion5 ? (
          <div className="text-gray-400 text-lg leading-relaxed">
            {formatQuestion5Text(question.title)}
          </div>
        ) : (
          <p className="text-gray-400">Selecione uma opção para continuar</p>
        )}
      </div>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`question-option ${selectedAnswer === option ? 'selected' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-left">{option}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedAnswer === option 
                  ? 'border-automatik-turquoise bg-automatik-turquoise' 
                  : 'border-gray-400'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </button>
        ))}

        {showTextInput && onTextFieldUpdate && (
          <div className="mt-6 animate-fade-in-up">
            <label htmlFor="areaOutra" className="block text-sm font-medium text-gray-300 mb-2">
              Especifique sua área de atuação:
            </label>
            <input
              type="text"
              id="areaOutra"
              value={textFieldValue || ''}
              onChange={(e) => onTextFieldUpdate('areaOutra', e.target.value)}
              className="w-full px-4 py-3 bg-automatik-dark-secondary border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-automatik-turquoise focus:ring-1 focus:ring-automatik-turquoise focus:outline-none transition-colors"
              placeholder="Digite sua área de atuação"
            />
            
            {canAdvance && onNext && (
              <button
                onClick={onNext}
                className="mt-4 flex items-center px-6 py-3 bg-automatik-turquoise text-automatik-dark font-semibold rounded-xl hover:bg-automatik-turquoise/90 transition-all"
              >
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        )}

        {selectedAnswer && !showTextInput && onNext && (
          <button
            onClick={onNext}
            className="mt-6 flex items-center px-6 py-3 bg-automatik-turquoise text-automatik-dark font-semibold rounded-xl hover:bg-automatik-turquoise/90 transition-all"
          >
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionStep;
