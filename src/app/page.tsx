import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PsiBuilder - Crie seu Site Profissional de Psicologia em Minutos",
  description:
    "Plataforma completa para psicólogos criarem sites profissionais. Sem código, sem complicação. Comece gratuitamente.",
  keywords: "site para psicólogo, plataforma psicologia, site profissional psicólogo, criar site psicólogo",
  openGraph: {
    title: "PsiBuilder - Sites Profissionais para Psicólogos",
    description: "Crie seu site profissional em minutos. Sem código, sem complicação.",
    type: "website",
  },
};

// Ícones SVG inline
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold text-gray-900">PsiBuilder</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#para-quem" className="text-gray-600 hover:text-gray-900 text-sm">
                Para quem
              </a>
              <a href="#como-funciona" className="text-gray-600 hover:text-gray-900 text-sm">
                Como funciona
              </a>
              <a href="#planos" className="text-gray-600 hover:text-gray-900 text-sm">
                Planos
              </a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 text-sm">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Criar meu site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge GRÁTIS destacado (Melhoria 3) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold border-2 border-green-200">
                🏆 SEMPRE GRÁTIS - Para sempre
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                Adequado às normas do CRP
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Tenha sua agenda cheia e mais autoridade com um{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                site profissional
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Seu site perfeito em qualquer celular ou computador.
              Pare de perder pacientes por não ter presença online.
              Com o PsiBuilder, você cria um site bonito e profissional sem precisar de conhecimento técnico.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/cadastro"
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
              >
                Quero meu site agora
              </Link>
              <a
                href="#preview"
                className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Ver exemplo de site
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Pronto em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema vs Solução (Melhoria 4) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Problema */}
            <div className="bg-white rounded-2xl p-8 border-2 border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sem site profissional</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Pacientes pesquisam no Google e não te encontram</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Depende apenas de indicações para crescer</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Parece menos profissional que concorrentes</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Agenda com horários vazios</span>
                </li>
              </ul>
            </div>

            {/* Solução */}
            <div className="bg-white rounded-2xl p-8 border-2 border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Com PsiBuilder</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Apareça no Google para pacientes da sua cidade</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Atraia novos pacientes todos os dias</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Transmita credibilidade e profissionalismo</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Agenda cheia de novos pacientes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Para quem é (Melhoria 1) */}
      <section id="para-quem" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O PsiBuilder é para você se...
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reconhece alguma dessas situações?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Perfil 1 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                📅
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Agenda com horários vazios
              </h3>
              <p className="text-gray-600">
                Você depende de indicações que não vêm com frequência suficiente.
                Quer atrair mais pacientes mas não sabe como.
              </p>
            </div>

            {/* Perfil 2 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-100">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                💸
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cansado de agências caras
              </h3>
              <p className="text-gray-600">
                Já pagou milhares para agências ou desenvolvedores que não
                trouxeram resultados. Quer algo simples e acessível.
              </p>
            </div>

            {/* Perfil 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                🌐
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sem presença online
              </h3>
              <p className="text-gray-600">
                Seus concorrentes aparecem no Google e você não.
                Precisa construir sua presença digital do zero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator (Melhoria 2) */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Faça as contas 🧮
          </h2>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-green-200 text-sm mb-2">Valor médio de uma sessão</p>
                <p className="text-4xl font-bold">R$ 200</p>
              </div>
              <div>
                <p className="text-green-200 text-sm mb-2">Se 2 novos pacientes te encontrarem</p>
                <p className="text-4xl font-bold">R$ 400/mês</p>
              </div>
              <div>
                <p className="text-green-200 text-sm mb-2">Plano Pro do PsiBuilder</p>
                <p className="text-4xl font-bold">R$ 49/mês</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold mb-2">
              Retorno de <span className="text-5xl">8x</span> o investimento
            </p>
            <p className="text-green-200 max-w-xl">
              E se você conseguir 5 novos pacientes? Ou 10?
              O site se paga logo no primeiro paciente que te encontra.
            </p>
          </div>
        </div>
      </section>

      {/* Preview do Site (Melhoria 5) */}
      <section id="preview" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veja como seu site pode ficar
            </h2>
            <p className="text-xl text-gray-600">
              Exemplo real de site criado com PsiBuilder
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              {/* Browser Header */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-lg px-4 py-1 text-sm text-gray-500 border">
                    dra-maria-silva.psibuilder.com.br
                  </div>
                </div>
              </div>

              {/* Site Preview */}
              <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 p-8 flex items-center">
                <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                  <div>
                    <p className="text-indigo-600 font-medium mb-2">CRP 06/123456</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Dra. Maria Silva
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Psicóloga Clínica especializada em Terapia Cognitivo-Comportamental (TCC),
                      Ansiedade e Depressão.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        Ansiedade
                      </span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        Depressão
                      </span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        TCC
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <div className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium">
                        📱 WhatsApp
                      </div>
                      <div className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium">
                        Agendar Consulta
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center text-6xl">
                      👩‍⚕️
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-500 mt-6">
              * Este é um exemplo. Você personaliza cores, textos e imagens do seu jeito.
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que psicólogos escolhem o PsiBuilder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Entendemos as necessidades específicas da sua profissão
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefício 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pronto em 5 minutos</h3>
              <p className="text-gray-600">
                Sem complicação. Preencha suas informações e seu site está no ar.
                Enquanto você toma um café, seu site já está recebendo visitantes.
              </p>
            </div>

            {/* Benefício 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Feito para psicólogos</h3>
              <p className="text-gray-600">
                Design pensado para transmitir acolhimento e profissionalismo.
                Suas especialidades e CRP em destaque, como deve ser.
              </p>
            </div>

            {/* Benefício 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">WhatsApp integrado</h3>
              <p className="text-gray-600">
                Botão de contato sempre visível. Pacientes clicam e já conversam
                com você no WhatsApp. Mais fácil impossível.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Três passos simples para ter seu site no ar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta gratuitamente em menos de 1 minuto.
                Sem burocracia, sem complicação.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalize</h3>
              <p className="text-gray-600">
                Adicione sua foto, bio, especialidades e escolha as cores.
                Tudo de forma visual e intuitiva.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Publique</h3>
              <p className="text-gray-600">
                Clique em publicar e pronto! Seu site está no ar com endereço
                personalizado, pronto para receber pacientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">CRP</p>
              <p className="text-indigo-200">Adequado às normas</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">5min</p>
              <p className="text-indigo-200">Tempo médio de criação</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">Foco</p>
              <p className="text-indigo-200">Total no paciente</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">100%</p>
              <p className="text-indigo-200">Segurança de dados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-600">
              Comece gratuito, evolua quando precisar
            </p>
          </div>

          {/* Banner de Urgência */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="animate-pulse">🔥</span>
                <span className="font-bold">OFERTA DE LANÇAMENTO</span>
                <span className="animate-pulse">🔥</span>
              </div>
              <p className="text-sm opacity-90">
                Preço promocional por tempo limitado. Pode voltar ao valor original a qualquer momento.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Gratuito */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
              <p className="text-gray-600 mb-6">Perfeito para começar</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-gray-900">R$ 0</span>
                <span className="text-gray-500">/mês</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-gray-700">Site profissional completo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-gray-700">Subdomínio personalizado</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-gray-700">Até 3 especialidades</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-gray-700">WhatsApp integrado</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-gray-700">Estatísticas básicas</span>
                </li>
                <li className="flex items-center gap-3">
                  <XIcon />
                  <span className="text-gray-400">Domínio próprio</span>
                </li>
                <li className="flex items-center gap-3">
                  <XIcon />
                  <span className="text-gray-400">Remover marca PsiBuilder</span>
                </li>
              </ul>

              <Link
                href="/cadastro"
                className="block w-full py-4 text-center bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Começar grátis
              </Link>
            </div>

            {/* Plano Profissional */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                Mais popular
              </div>

              <h3 className="text-2xl font-bold mb-2">Profissional</h3>
              <p className="text-indigo-200 mb-4">Tudo que você precisa</p>

              {/* Ancoragem de Preço */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full">Oferta Especial</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">R$ 49</span>
                  <span className="text-indigo-200">/mês</span>
                </div>
                <p className="text-xs text-indigo-300 mt-2">💎 Menos de 1/4 do valor de uma sessão</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span>Tudo do plano gratuito</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span>Domínio próprio (.com.br)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span>Especialidades ilimitadas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span>Blog integrado</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span>Estatísticas completas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span>Remover marca PsiBuilder</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon />
                  <span>Suporte prioritário</span>
                </li>
              </ul>

              <Link
                href="/cadastro"
                className="block w-full py-4 text-center bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Começar agora
              </Link>
            </div>
          </div>

          {/* Garantia (Melhoria 6) */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-green-50 border border-green-200 rounded-xl">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold text-green-800">Garantia total - Sem risco!</p>
                <p className="text-sm text-green-700">Não gostou? Cancele quando quiser e volte para o plano gratuito. Sem burocracia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Depoimento 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                &quot;Finalmente consegui ter um site profissional sem gastar uma fortuna.
                Em 10 minutos meu site estava no ar e já recebi meu primeiro contato no mesmo dia!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                  AP
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ana Paula</p>
                  <p className="text-sm text-gray-500">Psicóloga Clínica - SP</p>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                &quot;O que mais gostei foi a integração com WhatsApp. Meus pacientes
                clicam e já conversam comigo direto. Aumentou muito meus atendimentos.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                  RS
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ricardo Santos</p>
                  <p className="text-sm text-gray-500">Psicólogo Organizacional - RJ</p>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                &quot;Tentei fazer um site sozinha e desisti. Com o PsiBuilder foi
                tão fácil que até minha mãe conseguiria. Recomendo demais!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                  ML
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mariana Lima</p>
                  <p className="text-sm text-gray-500">Neuropsicóloga - MG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="group bg-gray-50 rounded-xl">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-900">
                Preciso saber programar?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-gray-600">
                Não! O PsiBuilder foi feito para ser fácil. Você só precisa preencher
                suas informações e escolher as cores. Tudo é visual, como editar um documento do Word.
              </p>
            </details>

            {/* FAQ 2 */}
            <details className="group bg-gray-50 rounded-xl">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-900">
                Posso usar meu próprio domínio?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-gray-600">
                Sim! No plano Profissional você pode conectar seu próprio domínio (ex: www.seusite.com.br).
                Nós até ajudamos você a configurar.
              </p>
            </details>

            {/* FAQ 3 */}
            <details className="group bg-gray-50 rounded-xl">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-900">
                Posso cancelar quando quiser?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-gray-600">
                Com certeza! Não existe fidelidade. Você pode cancelar quando quiser
                e seu site volta para o plano gratuito automaticamente.
              </p>
            </details>

            {/* FAQ 4 */}
            <details className="group bg-gray-50 rounded-xl">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-900">
                O site fica fora do ar alguma vez?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-gray-600">
                Nossos servidores têm 99,9% de disponibilidade. Usamos a mesma
                infraestrutura de grandes empresas como Netflix e Airbnb.
              </p>
            </details>

            {/* FAQ 5 */}
            <details className="group bg-gray-50 rounded-xl">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-900">
                Como funciona o suporte?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-gray-600">
                Temos suporte por email para todos os planos. No plano Profissional,
                você tem prioridade e resposta em até 4 horas úteis.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para ter seu site profissional?
          </h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de psicólogos que já estão atraindo mais pacientes
            com um site profissional e bonito.
          </p>
          <Link
            href="/cadastro"
            className="inline-block px-10 py-5 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
          >
            Quero meu site agora
          </Link>

          <p className="mt-6 text-indigo-200 text-sm">
            Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
                <span className="text-xl font-bold text-white">PsiBuilder</span>
              </div>
              <p className="text-gray-400 text-sm">
                A plataforma mais fácil para psicólogos criarem sites profissionais.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#para-quem" className="text-gray-400 hover:text-white">Para quem</a></li>
                <li><a href="#como-funciona" className="text-gray-400 hover:text-white">Como funciona</a></li>
                <li><a href="#planos" className="text-gray-400 hover:text-white">Planos</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/termos" className="text-gray-400 hover:text-white">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="text-gray-400 hover:text-white">Privacidade</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:contato@psibuilder.com.br" className="text-gray-400 hover:text-white">contato@psibuilder.com.br</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} PsiBuilder. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
