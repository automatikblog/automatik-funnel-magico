
import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

interface DisqualifiedScreenProps {
  reason: string;
}

const DisqualifiedScreen: React.FC<DisqualifiedScreenProps> = ({ reason }) => {
  const getReasonMessage = () => {
    switch (reason) {
      case 'frequencia':
        return 'Entendemos que você ainda está começando ou planejando sua jornada de criação de conteúdo.';
      case 'familiaridade':
        return 'Percebemos que você não tem interesse em ferramentas de IA para criação de conteúdo no momento.';
      case 'faturamento':
        return 'Entendemos que seu blog ainda não gera receita direta.';
      case 'investimento':
        return 'Respeitamos sua decisão sobre o investimento em ferramentas de automação.';
      case 'wordpress':
        return 'Nossa solução foi desenvolvida especificamente para sites WordPress.';
      default:
        return 'Entendemos seu momento atual na criação de conteúdo.';
    }
  };

  return (
    <div className="min-h-screen bg-automatik-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center animate-fade-in-up">
        <div className="mb-8">
          <BookOpen className="w-20 h-20 text-automatik-purple mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Obrigado pela sua sinceridade! 📚
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {getReasonMessage()}
          </p>
        </div>

        <div className="bg-automatik-dark-secondary rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Temos algo especial para você!
          </h2>
          <p className="text-gray-300 mb-6">
            Mesmo que nossa ferramenta não seja ideal para seu momento atual, queremos te ajudar a crescer. 
            Conheça nosso e-book com estratégias comprovadas para blogs.
          </p>
          
          <div className="bg-gradient-to-r from-automatik-purple to-automatik-turquoise p-6 rounded-xl mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              E-book: Estratégias para Blogs de Sucesso
            </h3>
            <p className="text-white/90 text-sm mb-3">
              Descubra técnicas comprovadas para fazer seu blog decolar, independente da sua situação atual.
            </p>
            <div className="flex items-center justify-center space-x-4 text-white">
              <span className="text-lg font-bold">R$ 47,00</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded">7 dias de garantia</span>
            </div>
          </div>

          <a 
            href="https://cadz.automatikblog.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-automatik-purple text-white font-semibold rounded-xl hover:bg-automatik-purple/90 hover:scale-105 transition-all duration-300 text-lg"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Adquirir E-book
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Quando estiver pronto para automatizar seu blog WordPress, estaremos aqui!
          </p>
          <a 
            href="https://automatikblog.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-automatik-turquoise hover:text-automatik-turquoise/80 transition-colors"
          >
            Conhecer a Automatik Blog
          </a>
        </div>
      </div>
    </div>
  );
};

export default DisqualifiedScreen;
