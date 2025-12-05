import { Github, Mail, Store } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e descrição */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Store className="w-6 h-6" />
              M-Commerce
            </div>
            <p className="text-sm text-gray-400">
              Sua plataforma de e-commerce completa. Compre e venda produtos com
              segurança e praticidade.
            </p>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:contato@mcommerce.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                contato@mcommerce.com
              </a>
              <a
                href="https://github.com/samuelftlz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub do Projeto
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} M-Commerce. Todos os direitos
            reservados.
          </p>
          <p className="mt-1">
            Projeto acadêmico desenvolvido com React + TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};
