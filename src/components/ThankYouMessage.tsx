
import React from 'react';
import { CheckCircle } from 'lucide-react';

const ThankYouMessage: React.FC = () => {
  return (
    <div className="min-h-screen bg-automatik-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center animate-fade-in-up">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-automatik-turquoise mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Obrigado! 🎉
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Já recebemos sua resposta!
          </p>
        </div>

        <div className="bg-automatik-dark-secondary rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            O que acontece agora?
          </h2>
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-automatik-turquoise rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Análise do seu perfil</h3>
                <p className="text-gray-400">
                  Nossa equipe irá analisar suas respostas para entender melhor suas necessidades
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-automatik-purple rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">Contato personalizado</h3>
                <p className="text-gray-400">
                  Entraremos em contato em breve pelo WhatsApp para agendarmos uma demonstração personalizada para seu blog
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-automatik-turquoise to-automatik-purple rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Automatização do seu blog</h3>
                <p className="text-gray-400">
                  Vamos ajudar você a escalar a produção de conteúdo do seu blog com IA
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Enquanto isso, que tal conhecer mais sobre a Automatik Blog?
          </p>
          <a 
            href="https://automatikblog.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-automatik-turquoise to-automatik-purple text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Visitar Automatik Blog
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYouMessage;
