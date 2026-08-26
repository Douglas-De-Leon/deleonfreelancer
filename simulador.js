/**
 * DE LEON OS · Simulador Interativo das 6 Soluções de IA
 * Arquivo: simulador.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // NAVEGAÇÃO ENTRE AS 6 SOLUÇÕES
    // ==========================================
    const navItems = document.querySelectorAll('.sim-nav-item');
    const panes = document.querySelectorAll('.sim-pane');
    const currentTitle = document.getElementById('simCurrentViewTitle');

    const appTitles = [
        '01 · Atendimento & Triagem 24/7 (WhatsApp AI)',
        '02 · Leitura de Notas & Conciliação (Smart OCR)',
        '03 · Agendamento Autônomo & Lembrete Anti-Falta',
        '04 · Gerador Instantâneo de Propostas & Contratos',
        '05 · Qualificação de Leads & CRM Preditivo',
        '06 · Dashboard Executivo & Briefing Diário'
    ];

    const switchApp = (index) => {
        const appIdx = parseInt(index, 10);
        if (isNaN(appIdx) || appIdx < 0 || appIdx > 5) return;

        navItems.forEach((btn, i) => {
            btn.classList.toggle('is-active', i === appIdx);
            btn.setAttribute('aria-selected', i === appIdx ? 'true' : 'false');
        });

        panes.forEach((pane, i) => {
            pane.classList.toggle('is-active', i === appIdx);
        });

        if (currentTitle && appTitles[appIdx]) {
            currentTitle.textContent = appTitles[appIdx];
        }

        // Atualiza URL sem recarregar a página
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('app', appIdx);
        window.history.replaceState({}, '', newUrl);
    };

    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            switchApp(btn.dataset.app);
        });
    });

    // Ler parâmetro da URL na abertura (?app=0..5)
    const urlParams = new URLSearchParams(window.location.search);
    const initialApp = urlParams.get('app');
    if (initialApp !== null) {
        switchApp(initialApp);
    }


    // ==============================================================
    // SOLUÇÃO 1: CHATBOT DE ATENDIMENTO 24/7
    // ==============================================================
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatList = document.getElementById('chatMessageList');
    const btnClearChat = document.getElementById('btnClearChat');
    const telemetryIntent = document.getElementById('telemetryIntent');
    const telemetryConfidence = document.getElementById('telemetryConfidence');
    const telemetrySentiment = document.getElementById('telemetrySentiment');
    const telemetryAction = document.getElementById('telemetryAction');

    const getSimulatedAiResponse = (msg) => {
        const lower = msg.toLowerCase();
        
        if (lower.includes('preço') || lower.includes('valor') || lower.includes('custa') || lower.includes('investimento') || lower.includes('orçamento')) {
            return {
                text: 'Os projetos de implementação de IA da DE LEON são personalizados para o porte da sua empresa. Nossos pacotes de automação iniciam a partir de R$ 3.800,00 com retorno sobre o investimento estimado em menos de 30 dias. Gostaria de agendar um diagnóstico gratuito de 30 minutos para mapear o seu negócio?',
                intent: 'Consulta Comercial / Preços',
                confidence: '99.4%',
                sentiment: 'Alto Interesse',
                action: 'Apresentação de Valores + Convite Demo'
            };
        }

        if (lower.includes('agendar') || lower.includes('reunião') || lower.includes('demonstração') || lower.includes('demo') || lower.includes('terça') || lower.includes('horário')) {
            return {
                text: 'Perfeito! Temos horários disponíveis para reunião de Diagnóstico com o Douglas De Leon amanhã às 09:30 ou às 14:00. Qual desses horários fica melhor para você? Se preferir, posso enviar o link direto para escolha na agenda!',
                intent: 'Agendamento de Reunião',
                confidence: '98.9%',
                sentiment: 'Positivo / Decisor',
                action: 'Oferta de Slots no Calendário'
            };
        }

        if (lower.includes('serviço') || lower.includes('oferece') || lower.includes('faz') || lower.includes('soluções') || lower.includes('como funciona')) {
            return {
                text: 'Desenvolvemos sistemas e agentes de IA sob medida: 1) Atendimento 24/7 no WhatsApp, 2) Leitura e conciliação automática de Notas Fiscais, 3) Qualificação e prospecção de leads para seu CRM, e 4) Dashboards executivos com resumos automáticos. Qual desses processos mais toma o tempo da sua equipe hoje?',
                intent: 'Apresentação de Soluções',
                confidence: '99.7%',
                sentiment: 'Exploratório',
                action: 'Exposição de Catálogo + Qualificação'
            };
        }

        if (lower.includes('crm') || lower.includes('integr') || lower.includes('bling') || lower.includes('contaazul') || lower.includes('hubspot') || lower.includes('rd station')) {
            return {
                text: 'Sim! Nossas automações integram nativamente via API e Webhooks com Bling, ContaAzul, RD Station, HubSpot, Google Workspace, sistemas ERP locais e bancos de dados SQL/Postgres. Tudo roda de forma invisível e segura.',
                intent: 'Viabilidade Técnica / Integrações',
                confidence: '97.8%',
                sentiment: 'Técnico / Positivo',
                action: 'Confirmação de Compatibilidade'
            };
        }

        if (lower.includes('humano') || lower.includes('atendente') || lower.includes('pessoa') || lower.includes('urgente') || lower.includes('falar com')) {
            return {
                text: 'Com certeza! Já notifiquei o Douglas De Leon e a equipe de especialistas. Em instantes um consultor humano entrará nesta conversa. Enquanto isso, qual o principal objetivo que gostaria de tratar?',
                intent: 'Transbordo para Humano',
                confidence: '99.9%',
                sentiment: 'Urgência',
                action: 'Alerta Disparado no WhatsApp do Especialista'
            };
        }

        // Resposta genérica inteligente
        return {
            text: `Entendi perfeitamente sua mensagem sobre "${msg.slice(0, 40)}...". Nossos agentes de inteligência artificial são construídos exatamente para resolver esse tipo de demanda em segundos, eliminando trabalho repetitivo e aumentando o faturamento da sua empresa. Gostaria de ver isso rodando no seu negócio?`,
            intent: 'Dúvida Geral / Negócios',
            confidence: '96.5%',
            sentiment: 'Positivo',
            action: 'Engajamento Inteligente'
        };
    };

    const appendMessage = (text, isUser = false) => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const msgDiv = document.createElement('div');
        msgDiv.className = `sim-msg ${isUser ? 'sim-msg-out' : 'sim-msg-in'}`;
        
        msgDiv.innerHTML = `
            <div class="sim-msg-bubble">
                <p>${text}</p>
                <span class="sim-msg-time">${timeStr} ${isUser ? '<svg viewBox="0 0 16 15" width="16" height="15"><path fill="#53bdeb" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/></svg>' : ''}</span>
            </div>
        `;

        chatList.appendChild(msgDiv);
        chatList.scrollTop = chatList.scrollHeight;
    };

    const handleSendMessage = (text) => {
        if (!text || !text.trim()) return;
        appendMessage(text.trim(), true);

        // Feedback de digitação da IA
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'sim-msg sim-msg-in sim-typing-msg';
        typingIndicator.innerHTML = `
            <div class="sim-msg-bubble sim-bubble-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        chatList.appendChild(typingIndicator);
        chatList.scrollTop = chatList.scrollHeight;

        const res = getSimulatedAiResponse(text);

        // Atualiza métricas na sidebar
        if (telemetryIntent) telemetryIntent.textContent = res.intent;
        if (telemetryConfidence) telemetryConfidence.textContent = res.confidence;
        if (telemetrySentiment) telemetrySentiment.textContent = res.sentiment;
        if (telemetryAction) telemetryAction.textContent = res.action;

        setTimeout(() => {
            typingIndicator.remove();
            appendMessage(res.text, false);
        }, 800);
    };

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = chatInput.value;
            chatInput.value = '';
            handleSendMessage(val);
        });
    }

    // Chips de perguntas rápidas
    document.querySelectorAll('.sim-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.dataset.prompt;
            if (prompt) handleSendMessage(prompt);
        });
    });

    if (btnClearChat) {
        btnClearChat.addEventListener('click', () => {
            chatList.innerHTML = `
                <div class="sim-chat-date"><span>Hoje</span></div>
                <div class="sim-msg sim-msg-in">
                    <div class="sim-msg-bubble">
                        <p>Conversa reiniciada. Como a inteligência artificial pode acelerar sua empresa hoje?</p>
                        <span class="sim-msg-time">Agora</span>
                    </div>
                </div>
            `;
        });
    }


    // ==============================================================
    // SOLUÇÃO 2: LEITURA DE NOTAS & CONCILIAÇÃO OCR
    // ==============================================================
    const ocrPresets = [
        {
            title: 'NFS-e 004829 · Serviços de TI',
            issuer: 'DE LEON DESENVOLVIMENTO LTDA',
            cnpjIssuer: '48.912.440/0001-82',
            client: 'LOGTECH TRANSPORTES E LOGÍSTICA S/A',
            cnpjClient: '12.345.678/0001-90',
            date: '24/08/2026',
            grossValue: 'R$ 14.850,00',
            taxes: 'R$ 742,50 (ISS 5%)',
            netValue: 'R$ 14.107,50',
            serviceCode: '01.07 - Suporte Técnico e Automação de IA',
            reconciliationCode: 'LANC-2026-NFS-04829',
            category: 'Despesas com Tecnologia / Software'
        },
        {
            title: 'NF-e 0019482 · Equipamentos & Servidores',
            issuer: 'DELL COMPUTADORES DO BRASIL LTDA',
            cnpjIssuer: '72.381.189/0001-10',
            client: 'NEXUS TECH SOLUÇÕES DIGITAIS',
            cnpjClient: '28.910.443/0001-55',
            date: '25/08/2026',
            grossValue: 'R$ 42.300,00',
            taxes: 'R$ 5.076,00 (ICMS + IPI)',
            netValue: 'R$ 42.300,00',
            serviceCode: 'NCM 8471.50.10 - Servidor de Alta Performance',
            reconciliationCode: 'LANC-2026-NFE-19482',
            category: 'Ativo Imobilizado / Hardware'
        },
        {
            title: 'Recibo Comercial 08/2026 · Aluguel Sede',
            issuer: 'IMOBILIÁRIA CENTRAL PAULISTA',
            cnpjIssuer: '04.182.930/0001-44',
            client: 'GROWTHCORP ACADEMY LTDA',
            cnpjClient: '34.891.002/0001-78',
            date: '20/08/2026',
            grossValue: 'R$ 3.800,00',
            taxes: 'R$ 0,00 (Isento)',
            netValue: 'R$ 3.800,00',
            serviceCode: 'Locação de Imóvel Comercial',
            reconciliationCode: 'LANC-2026-REC-00820',
            category: 'Custos Operacionais / Aluguel'
        }
    ];

    let currentDocIndex = 0;
    const mockInvoiceEl = document.getElementById('mockInvoiceContent');
    const ocrExtractedEl = document.getElementById('ocrExtractedData');
    const ocrJsonEl = document.getElementById('ocrJsonOutput');
    const scanLaser = document.getElementById('scanLaser');
    const btnRunOcr = document.getElementById('btnRunOcr');
    const docBtns = document.querySelectorAll('.sim-doc-btn');
    const ocrStatusBadge = document.getElementById('ocrStatusBadge');

    const renderMockInvoice = (idx) => {
        const doc = ocrPresets[idx];
        if (!mockInvoiceEl) return;

        mockInvoiceEl.innerHTML = `
            <div class="mock-inv-header">
                <div class="mock-inv-title">${doc.title}</div>
                <div class="mock-inv-badge">AUTENTICIDADE COMPROVADA</div>
            </div>
            <div class="mock-inv-body">
                <div class="mock-inv-row"><strong>Prestador / Emitente:</strong> ${doc.issuer} (${doc.cnpjIssuer})</div>
                <div class="mock-inv-row"><strong>Tomador / Destinatário:</strong> ${doc.client} (${doc.cnpjClient})</div>
                <div class="mock-inv-row"><strong>Data de Emissão:</strong> ${doc.date}</div>
                <div class="mock-inv-row"><strong>Descrição:</strong> ${doc.serviceCode}</div>
                <div class="mock-inv-row highlight"><strong>Valor Total:</strong> ${doc.grossValue} · <strong>Líquido:</strong> ${doc.netValue}</div>
            </div>
        `;
    };

    const renderExtractedOcr = (idx) => {
        const doc = ocrPresets[idx];
        if (!ocrExtractedEl) return;

        ocrExtractedEl.innerHTML = `
            <div class="sim-ext-field">
                <span class="sim-ext-k">Razão Social Emitente</span>
                <span class="sim-ext-v">${doc.issuer}</span>
            </div>
            <div class="sim-ext-field">
                <span class="sim-ext-k">CNPJ Emitente</span>
                <span class="sim-ext-v">${doc.cnpjIssuer}</span>
            </div>
            <div class="sim-ext-field">
                <span class="sim-ext-k">Valor Bruto</span>
                <span class="sim-ext-v text-emerald">${doc.grossValue}</span>
            </div>
            <div class="sim-ext-field">
                <span class="sim-ext-k">Impostos Calculados</span>
                <span class="sim-ext-v">${doc.taxes}</span>
            </div>
            <div class="sim-ext-field">
                <span class="sim-ext-k">Valor Líquido</span>
                <span class="sim-ext-v text-emerald font-bold">${doc.netValue}</span>
            </div>
            <div class="sim-ext-field">
                <span class="sim-ext-k">Classificação Contábil</span>
                <span class="sim-ext-v sim-tag-cyan">${doc.category}</span>
            </div>
        `;

        if (ocrJsonEl) {
            const jsonSample = {
                id_conciliacao: doc.reconciliationCode,
                status: "CONCILIADO_AUTOMATICO",
                documento: doc.title,
                cnpj_prestador: doc.cnpjIssuer,
                cnpj_tomador: doc.cnpjClient,
                valor_bruto: doc.grossValue,
                valor_liquido: doc.netValue,
                categoria: doc.category,
                data_lancamento: doc.date,
                hash_validacao: "a8f9c2d7e1b409823f99e01"
            };
            ocrJsonEl.textContent = JSON.stringify(jsonSample, null, 2);
        }
    };

    docBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            docBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentDocIndex = i;
            renderMockInvoice(i);
            runOcrScan(i);
        });
    });

    const runOcrScan = (idx) => {
        if (scanLaser) {
            scanLaser.style.display = 'block';
            scanLaser.classList.remove('is-scanning');
            void scanLaser.offsetWidth; // trigger reflow
            scanLaser.classList.add('is-scanning');
        }
        if (ocrStatusBadge) ocrStatusBadge.textContent = 'Processando OCR com IA...';

        setTimeout(() => {
            if (scanLaser) scanLaser.style.display = 'none';
            if (ocrStatusBadge) ocrStatusBadge.textContent = 'Concluído (0.9s · 100% Precisão)';
            renderExtractedOcr(idx);
        }, 900);
    };

    if (btnRunOcr) {
        btnRunOcr.addEventListener('click', () => {
            runOcrScan(currentDocIndex);
        });
    }

    renderMockInvoice(0);
    renderExtractedOcr(0);

    const btnCopyOcr = document.getElementById('btnCopyOcr');
    if (btnCopyOcr && ocrJsonEl) {
        btnCopyOcr.addEventListener('click', () => {
            navigator.clipboard.writeText(ocrJsonEl.textContent).then(() => {
                const prev = btnCopyOcr.innerHTML;
                btnCopyOcr.innerHTML = '✅ JSON Copiado!';
                setTimeout(() => { btnCopyOcr.innerHTML = prev; }, 2000);
            });
        });
    }

    const btnExportOcr = document.getElementById('btnExportOcr');
    if (btnExportOcr) {
        btnExportOcr.addEventListener('click', () => {
            alert('Sucesso! O lançamento de conciliação contábil foi transmitido com sucesso para a planilha / ERP simulado.');
        });
    }


    // ==============================================================
    // SOLUÇÃO 3: AGENDAMENTO AUTÔNOMO & CALENDÁRIO
    // ==============================================================
    const slotBtns = document.querySelectorAll('.sim-slot-btn');
    const btnConfirmBooking = document.getElementById('btnConfirmBooking');
    const bookNameInput = document.getElementById('bookName');
    const bookCompanyInput = document.getElementById('bookCompany');
    const resService = document.getElementById('resService');
    const resTime = document.getElementById('resTime');
    const resClient = document.getElementById('resClient');
    const bookingWaPreview = document.getElementById('bookingWaPreview');

    let selectedTime = 'Amanhã às 09:30';

    slotBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            slotBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            selectedTime = btn.dataset.time || btn.textContent;
        });
    });

    if (btnConfirmBooking) {
        btnConfirmBooking.addEventListener('click', () => {
            const name = (bookNameInput && bookNameInput.value) ? bookNameInput.value : 'Cliente';
            const company = (bookCompanyInput && bookCompanyInput.value) ? bookCompanyInput.value : 'Empresa';
            const serviceTypeRadio = document.querySelector('input[name="serviceType"]:checked');
            const serviceName = serviceTypeRadio && serviceTypeRadio.value === 'demo' ? 'Demonstração Técnica da Solução' : 'Diagnóstico de IA & Processos';

            if (resService) resService.textContent = serviceName;
            if (resTime) resTime.textContent = selectedTime;
            if (resClient) resClient.textContent = `${name} (${company})`;

            if (bookingWaPreview) {
                bookingWaPreview.innerHTML = `
                    <p>Olá <strong>${name}</strong>! Tudo bem?</p>
                    <p>Aqui é o assistente da <strong>DE LEON AI</strong>. Sua reunião de <strong>${serviceName}</strong> está confirmada para <strong>${selectedTime}</strong> com Douglas De Leon.</p>
                    <p>🔗 Link da sala: <u>meet.google.com/del-eon-ai</u></p>
                    <p><em>Enviaremos um lembrete 1 hora antes para sua comodidade!</em></p>
                `;
            }

            btnConfirmBooking.textContent = '✅ Reunião Agendada com Sucesso!';
            setTimeout(() => {
                btnConfirmBooking.textContent = 'Confirmar Agendamento com IA';
            }, 2500);
        });
    }


    // ==============================================================
    // SOLUÇÃO 4: GERADOR DE PROPOSTAS & CONTRATOS
    // ==============================================================
    const btnGenerateProposal = document.getElementById('btnGenerateProposal');
    const propClientInput = document.getElementById('propClient');
    const propServiceSelect = document.getElementById('propServiceType');
    const propTimelineInput = document.getElementById('propTimeline');
    const propPriceInput = document.getElementById('propPrice');

    const pdfClientName = document.getElementById('pdfClientName');
    const pdfObjective = document.getElementById('pdfObjective');
    const pdfDeliverables = document.getElementById('pdfDeliverables');
    const pdfPriceDisplay = document.getElementById('pdfPriceDisplay');
    const pdfTimelineDisplay = document.getElementById('pdfTimelineDisplay');
    const pdfSigClient = document.getElementById('pdfSigClient');

    const serviceTemplates = {
        complete: {
            obj: 'Implementação de ecossistema autônomo com agentes inteligentes para eliminar gargalos de tempo e alavancar a capacidade produtiva da empresa contratante.',
            deliv: [
                'Configuração de infraestrutura de IA e agentes com latência ultra-baixa;',
                'Integração direta com o WhatsApp corporativo e sincronização com banco de dados;',
                'Treinamento com documentação e políticas internas da empresa;',
                'Dashboard de acompanhamento de métricas e suporte dedicado pós-lançamento.'
            ]
        },
        whatsapp: {
            obj: 'Desenvolvimento e ativação de agente conversacional de vendas e triagem 24/7 no WhatsApp integrado com CRM.',
            deliv: [
                'Mapeamento dos fluxos de atendimento, FAQs e matriz de objeções;',
                'Conexão oficial da API do WhatsApp Business;',
                'Sistema de qualificação de leads e transbordo inteligente para equipe humana;',
                'Painel de telemetria e análise de conversões.'
            ]
        },
        financial: {
            obj: 'Automatização do setor fiscal e financeiro com leitura ótica de notas (OCR) e conciliação bancária automática.',
            deliv: [
                'Pipeline de captura e extração de dados em PDFs e cupons fiscais;',
                'Validação tributária de CNPJs e cálculo de impostos retidos;',
                'Exportação em tempo real para o ERP / software de contabilidade;',
                'Geração de relatórios de auditoria e redução de 90% no tempo de digitação.'
            ]
        },
        custom: {
            obj: 'Consultoria estratégica de inteligência artificial com imersão e desenvolvimento de soluções proprietárias para a diretoria.',
            deliv: [
                'Auditoria de processos críticos e mapeamento de ineficiências;',
                'Workshops práticos de capacitação para a equipe executiva;',
                'Prototipação rápida de ferramentas internas com IA;',
                'Acompanhamento semanal de métricas de produtividade e ROI.'
            ]
        }
    };

    const updateProposalDoc = () => {
        const client = (propClientInput && propClientInput.value) ? propClientInput.value : 'Empresa Cliente';
        const sType = (propServiceSelect && propServiceSelect.value) ? propServiceSelect.value : 'complete';
        const price = (propPriceInput && propPriceInput.value) ? propPriceInput.value : 'R$ 7.800,00';
        const timeline = (propTimelineInput && propTimelineInput.value) ? propTimelineInput.value : '10 a 14 dias úteis';

        const tmpl = serviceTemplates[sType] || serviceTemplates.complete;

        if (pdfClientName) pdfClientName.textContent = client;
        if (pdfSigClient) pdfSigClient.textContent = client;
        if (pdfPriceDisplay) pdfPriceDisplay.textContent = price;
        if (pdfTimelineDisplay) pdfTimelineDisplay.textContent = timeline;
        if (pdfObjective) pdfObjective.textContent = tmpl.obj;

        if (pdfDeliverables) {
            pdfDeliverables.innerHTML = tmpl.deliv.map(d => `<li>${d}</li>`).join('');
        }
    };

    if (btnGenerateProposal) {
        btnGenerateProposal.addEventListener('click', () => {
            btnGenerateProposal.innerHTML = '⚙️ Compilando Proposta com IA...';
            setTimeout(() => {
                updateProposalDoc();
                btnGenerateProposal.innerHTML = '✅ Proposta Gerada com Sucesso!';
                setTimeout(() => {
                    btnGenerateProposal.innerHTML = `
                        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                        Compilar Proposta & Contrato com IA
                    `;
                }, 2000);
            }, 600);
        });
    }

    const btnPrintProposal = document.getElementById('btnPrintProposal');
    if (btnPrintProposal) {
        btnPrintProposal.addEventListener('click', () => {
            window.print();
        });
    }


    // ==============================================================
    // SOLUÇÃO 5: QUALIFICAÇÃO DE LEADS & CRM PREDITIVO
    // ==============================================================
    const sampleLeads = [
        {
            id: 1,
            name: 'Roberto Vieira',
            company: 'OmniScale Log',
            col: 'hot',
            score: 98,
            statusTag: '🔥 Lead Quente / Prioridade Máxima',
            pain: 'Equipe de 20 pessoas gastando 3 horas por dia preenchendo relatórios manualmente.',
            fit: 'Altíssimo. Potencial de ROI estimado em menos de 3 semanas.',
            budget: 'R$ 15.000 a R$ 25.000',
            pitch: 'Fala Roberto! Vi que a OmniScale está em forte expansão. Nós desenvolvemos sistemas de automação que eliminam exatamente essas 3 horas de digitação diária da sua equipe, integrando tudo de forma invisível. Que tal vermos uma demonstração prática de 15 minutos amanhã?'
        },
        {
            id: 2,
            name: 'Mariana Silveira',
            company: 'FinScale Consultoria',
            col: 'hot',
            score: 94,
            statusTag: '🔥 Lead Quente / Decisora Pronta',
            pain: 'Perda de 25% de vendas por demora na resposta no WhatsApp aos finais de semana.',
            fit: 'Imediato. O agente 24/7 responde em 2 segundos e agenda no calendário.',
            budget: 'R$ 8.000 a R$ 12.000',
            pitch: 'Olá Mariana! Percebemos o desafio da FinScale em manter o atendimento rápido no WhatsApp fora do expediente. Criamos um assistente de IA que fecha agendamentos em tempo real mesmo às 23h de domingo. Podemos demonstrar como funciona no seu número?'
        },
        {
            id: 3,
            name: 'Carlos Drummond',
            company: 'Clínica Médica Vida',
            col: 'new',
            score: 72,
            statusTag: '⚡ Qualificado / Aguardando Contato',
            pain: 'Falta de confirmação de consultas gerando 18% de absenteísmo.',
            fit: 'Solução padrão de lembrete anti-falta via WhatsApp resolve 100%.',
            budget: 'R$ 4.000 a R$ 6.000',
            pitch: 'Olá Carlos! Nosso sistema de IA reduz as faltas em consultórios de 18% para menos de 3% com confirmação ativa no WhatsApp. Gostaria de receber um estudo de caso rápido?'
        },
        {
            id: 4,
            name: 'Felipe Alencar',
            company: 'Alencar Móveis',
            col: 'neg',
            score: 86,
            statusTag: '💬 Em Negociação de Contrato',
            pain: 'Envio manual de orçamentos em PDF demorando até 24 horas por cliente.',
            fit: 'Gerador de Propostas instantâneo reduz o tempo para 5 segundos.',
            budget: 'R$ 6.500,00',
            pitch: 'Felipe, a proposta do Gerador de Orçamentos já está pronta com o desconto especial de lançamento. Podemos formalizar o início dos trabalhos hoje?'
        }
    ];

    const colNewLeads = document.getElementById('colNewLeads');
    const colHotLeads = document.getElementById('colHotLeads');
    const colNegLeads = document.getElementById('colNegLeads');
    const countNew = document.getElementById('countNew');
    const countHot = document.getElementById('countHot');
    const countNeg = document.getElementById('countNeg');

    const leadScoreCircle = document.getElementById('leadScoreCircle');
    const leadInspectName = document.getElementById('leadInspectName');
    const leadInspectStatus = document.getElementById('leadInspectStatus');
    const leadInspectPain = document.getElementById('leadInspectPain');
    const leadInspectFit = document.getElementById('leadInspectFit');
    const leadInspectBudget = document.getElementById('leadInspectBudget');
    const leadPitchContent = document.getElementById('leadPitchContent');

    const inspectLead = (lead) => {
        if (leadScoreCircle) {
            leadScoreCircle.textContent = lead.score;
            leadScoreCircle.className = `sim-score-circle ${lead.score >= 80 ? 'is-hot' : 'is-warm'}`;
        }
        if (leadInspectName) leadInspectName.textContent = `${lead.name} · ${lead.company}`;
        if (leadInspectStatus) leadInspectStatus.textContent = lead.statusTag;
        if (leadInspectPain) leadInspectPain.textContent = lead.pain;
        if (leadInspectFit) leadInspectFit.textContent = lead.fit;
        if (leadInspectBudget) leadInspectBudget.textContent = lead.budget;
        if (leadPitchContent) leadPitchContent.textContent = lead.pitch;
    };

    const renderKanban = () => {
        if (!colNewLeads || !colHotLeads || !colNegLeads) return;

        colNewLeads.innerHTML = '';
        colHotLeads.innerHTML = '';
        colNegLeads.innerHTML = '';

        let cNew = 0, cHot = 0, cNeg = 0;

        sampleLeads.forEach(lead => {
            const card = document.createElement('div');
            card.className = 'sim-lead-card';
            card.innerHTML = `
                <div class="sim-lc-top">
                    <strong>${lead.name}</strong>
                    <span class="sim-lc-score ${lead.score >= 80 ? 'is-hot' : ''}">${lead.score} pts</span>
                </div>
                <div class="sim-lc-comp">${lead.company}</div>
                <div class="sim-lc-tag">${lead.pain.slice(0, 45)}...</div>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.sim-lead-card').forEach(c => c.classList.remove('is-selected'));
                card.classList.add('is-selected');
                inspectLead(lead);
            });

            if (lead.col === 'new') {
                colNewLeads.appendChild(card);
                cNew++;
            } else if (lead.col === 'hot') {
                colHotLeads.appendChild(card);
                cHot++;
            } else if (lead.col === 'neg') {
                colNegLeads.appendChild(card);
                cNeg++;
            }
        });

        if (countNew) countNew.textContent = cNew;
        if (countHot) countHot.textContent = cHot;
        if (countNeg) countNeg.textContent = cNeg;
    };

    renderKanban();

    const btnAddNewLead = document.getElementById('btnAddNewLead');
    if (btnAddNewLead) {
        btnAddNewLead.addEventListener('click', () => {
            const randomNames = ['Camila Rocha', 'Gustavo Nogueira', 'Tatiane Ramos', 'Bruno Cerqueira'];
            const randomCompanies = ['Solaris Tech', 'AgroNext Brasil', 'Studio Design Pro', 'Alfa Distribuidora'];
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
            const randomComp = randomCompanies[Math.floor(Math.random() * randomCompanies.length)];
            const randomScore = Math.floor(Math.random() * 20) + 80;

            const newLead = {
                id: sampleLeads.length + 1,
                name: randomName,
                company: randomComp,
                col: 'hot',
                score: randomScore,
                statusTag: '🔥 Novo Inbound de Alto Impacto',
                pain: 'Busca solução de inteligência artificial para escalar suporte e diminuir custos.',
                fit: 'Elevado. Alta intenção de contratação imediata.',
                budget: 'R$ 10.000 a R$ 18.000',
                pitch: `Olá ${randomName}! Analisamos a demanda da ${randomComp} e estruturamos um protótipo de automação que pode ser ativado em 5 dias. Quando podemos alinhar os detalhes?`
            };

            sampleLeads.unshift(newLead);
            renderKanban();
            inspectLead(newLead);
        });
    }

    const btnCopyPitch = document.getElementById('btnCopyPitch');
    if (btnCopyPitch && leadPitchContent) {
        btnCopyPitch.addEventListener('click', () => {
            navigator.clipboard.writeText(leadPitchContent.textContent).then(() => {
                const prev = btnCopyPitch.innerHTML;
                btnCopyPitch.innerHTML = '✅ Roteiro Copiado!';
                setTimeout(() => { btnCopyPitch.innerHTML = prev; }, 2000);
            });
        });
    }


    // ==============================================================
    // SOLUÇÃO 6: DASHBOARD EXECUTIVO & BRIEFING DIÁRIO
    // ==============================================================
    const btnGenerateExecutiveDigest = document.getElementById('btnGenerateExecutiveDigest');
    const execDigestOutput = document.getElementById('execDigestOutput');
    const btnCopyExecDigest = document.getElementById('btnCopyExecDigest');

    if (btnGenerateExecutiveDigest && execDigestOutput) {
        btnGenerateExecutiveDigest.addEventListener('click', () => {
            const now = new Date();
            const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            execDigestOutput.textContent = `📊 *RESUMO EXECUTIVO DIÁRIO · DE LEON AI*
📅 *Data:* ${dateStr} · ${timeStr}

🚀 *Desempenho Geral:*
• Faturamento Hoje: *R$ 18.450,00* (Meta atingida: 124%)
• Atendimentos Automatizados: *168 conversas* (Tempo médio resposta: 2.1 seg)
• Reuniões Agendadas com IA: *9 novos diagnósticos*
• Notas Processadas no OCR: *32 faturas conciliadas*

💡 *Ações Recomendadas da IA:*
1. 4 novos leads quentes com Score > 90 aguardando retorno no WhatsApp comercial;
2. Conciliação bancária fechada com 0 erros;
3. Satisfação dos clientes nos atendimentos com nota média de 4.9/5.0.

_Gerado automaticamente pelo sistema DE LEON OS._`;

            btnGenerateExecutiveDigest.innerHTML = '✅ Briefing Atualizado com Sucesso!';
            setTimeout(() => {
                btnGenerateExecutiveDigest.innerHTML = `
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    Gerar Resumo Diário para WhatsApp
                `;
            }, 2000);
        });
    }

    if (btnCopyExecDigest && execDigestOutput) {
        btnCopyExecDigest.addEventListener('click', () => {
            navigator.clipboard.writeText(execDigestOutput.textContent).then(() => {
                const prev = btnCopyExecDigest.innerHTML;
                btnCopyExecDigest.innerHTML = '✅ Briefing Copiado para WhatsApp!';
                setTimeout(() => { btnCopyExecDigest.innerHTML = prev; }, 2000);
            });
        });
    }
});
