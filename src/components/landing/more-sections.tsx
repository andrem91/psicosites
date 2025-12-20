export function PreviewSection() {
    return (
        <section id="preview" className="py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Veja como seu site pode ficar
                    </h2>
                    <p className="text-xl text-gray-600">
                        Exemplo real de site criado com PsicoSites
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
                                    dra-maria-silva.psicosites.com.br
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
    );
}

export function BenefitsSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Por que psicólogos escolhem o PsicoSites?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Entendemos as necessidades específicas da sua profissão
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Acesso pelo seu site</h3>
                        <p className="text-gray-600">
                            Gerencie seu painel diretamente pelo seu site. Sem precisar
                            lembrar de outro endereço. Tudo na sua marca.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function HowItWorksSection() {
    return (
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
    );
}

export function StatsSection() {
    return (
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
    );
}
