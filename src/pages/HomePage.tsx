import { Heart, Package, Shield, ShoppingBag, Users, Zap } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redireciona usuários logados para suas respectivas áreas
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "VENDEDOR") {
        navigate("/seller");
      } else {
        navigate("/store");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const features = [
    {
      icon: ShoppingBag,
      title: "Compre com Segurança",
      description:
        "Produtos verificados e transações seguras para sua tranquilidade.",
    },
    {
      icon: Package,
      title: "Venda Seus Produtos",
      description: "Cadastre-se como vendedor e alcance milhares de clientes.",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Faça parte de uma comunidade de compradores e vendedores.",
    },
    {
      icon: Shield,
      title: "Proteção Total",
      description:
        "Suas informações estão protegidas com criptografia de ponta.",
    },
    {
      icon: Zap,
      title: "Rápido e Fácil",
      description: "Interface intuitiva para uma experiência de compra fluida.",
    },
    {
      icon: Heart,
      title: "Suporte Dedicado",
      description: "Equipe pronta para ajudar você a qualquer momento.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bem-vindo ao{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
                M-Commerce
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-10">
              Sua plataforma completa de e-commerce. Compre e venda produtos com
              facilidade e segurança.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Criar Conta Grátis
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Por que escolher o M-Commerce?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Oferecemos a melhor experiência de compra e venda online com
              recursos pensados para você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Cadastre-se agora e comece a explorar milhares de produtos ou venda
            os seus próprios!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors"
            >
              Quero ser Cliente
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Quero ser Vendedor
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              🧪 Credenciais de Teste (Desenvolvimento)
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-800 mb-2">👨‍💼 Vendedor</p>
                <p className="text-gray-600">Email: vendedor@email.com</p>
                <p className="text-gray-600">Senha: senha123</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">🛒 Cliente</p>
                <p className="text-gray-600">Email: cliente@email.com</p>
                <p className="text-gray-600">Senha: senha123</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
