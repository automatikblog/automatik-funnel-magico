
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  options: string[];
}

interface QuestionStepProps {
  question: Question;
  onAnswer: (field: string, answer: string) => void;
  onPrevious?: () => void;
  selectedAnswer?: string;
}

const QuestionStep: React.FC<QuestionStepProps> = ({ 
  question, 
  onAnswer, 
  onPrevious,
  selectedAnswer 
}) => {
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
          {question.title}
        </h2>
        <p className="text-gray-400">Selecione uma opção para continuar</p>
      </div>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(question.id, option)}
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
      </div>
    </div>
  );
};

export default QuestionStep;
