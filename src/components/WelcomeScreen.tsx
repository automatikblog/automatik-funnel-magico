
import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-automatik-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Descubra como a <span className="text-automatik-turquoise">Automatik Blog</span> pode revolucionar seu blog
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Automatize a produção de conteúdo do seu blog com inteligência artificial
          </p>
        </div>

        <div className="bg-automatik-dark-secondary rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Essa ferramenta é para quem:
          </h2>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-automatik-turquoise flex-shrink-0" />
              <span className="text-gray-300 text-lg">
                Já tem blog ou site no WordPress
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-automatik-turquoise flex-shrink-0" />
              <span className="text-gray-300 text-lg">
                Publica conteúdo com frequência
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-automatik-turquoise flex-shrink-0" />
              <span className="text-gray-300 text-lg">
                Quer escalar e automatizar sem perder qualidade
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-400 text-lg mb-6">
            Se é o seu caso, preencha os dados abaixo e veja como a Automatik Blog pode trabalhar por você.
          </p>
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-automatik-turquoise to-automatik-purple text-white font-semibold text-lg rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 space-x-2"
        >
          <span>Iniciar</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
