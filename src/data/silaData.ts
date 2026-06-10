import { Province, ProblemMetric, FucMilestone, StudentJourneyStep, EducationCapability, PilotPhase } from '../types';

export const PROVINCES_DATA: Province[] = [
  { id: 'huambo', name: 'Huambo', capital: 'Huambo', x: 42, y: 55, schools: 420, students: 125000, teachers: 4300, isActive: true },
  { id: 'luanda', name: 'Luanda', capital: 'Luanda', x: 26, y: 22, schools: 1100, students: 480000, teachers: 15200, isActive: false },
  { id: 'benguela', name: 'Benguela', capital: 'Benguela', x: 24, y: 56, schools: 650, students: 240000, teachers: 7100, isActive: false },
  { id: 'cabinda', name: 'Cabinda', capital: 'Cabinda', x: 19, y: 3, schools: 180, students: 58000, teachers: 2100, isActive: false },
  { id: 'huila', name: 'Huíla', capital: 'Lubango', x: 34, y: 75, schools: 580, students: 190000, teachers: 6200, isActive: false },
  { id: 'uige', name: 'Uíge', capital: 'Uíge', x: 40, y: 15, schools: 490, students: 135000, teachers: 3900, isActive: false },
  { id: 'moxico', name: 'Moxico', capital: 'Luena', x: 75, y: 52, schools: 310, students: 85000, teachers: 2600, isActive: false },
  { id: 'namibe', name: 'Namibe', capital: 'Moçâmedes', x: 18, y: 78, schools: 140, students: 42000, teachers: 1400, isActive: false },
];

export const PROBLEM_METRICS: ProblemMetric[] = [
  {
    id: 'fragmentados',
    title: 'Dados Fragmentados',
    metric: '18+',
    description: 'Bases de dados isoladas por província e ministério sem comunicação mútua.',
    iconName: 'DatabaseOff',
  },
  {
    id: 'conflito',
    title: 'Processos Manuais',
    metric: '85%',
    description: 'Do fluxo de matrícula e emissão de certificados civis e escolares assenta em papel.',
    iconName: 'FileText',
  },
  {
    id: 'duplicidade',
    title: 'Duplicação Crítica',
    metric: '4.2x',
    description: 'Vezes em que o cidadão precisa fornecer os mesmos documentos a instituições do Estado.',
    iconName: 'Copy',
  },
  {
    id: 'isolamento',
    title: 'Interoperabilidade Zero',
    metric: 'Nula',
    description: 'Incapacidade técnica dos sistemas escolares falarem com o registo civil nacional.',
    iconName: 'ZapOff',
  },
];

export const FUC_MILESTONES: FucMilestone[] = [
  {
    id: 'nascimento',
    phase: 'Registo Inicial',
    age: '0 Anos',
    label: 'Nascimento Monitorizado',
    description: 'Abertura imediata da Ficha Única na Maternidade. Gerado o Número de Identificação Único (NIU) que acompanhará o cidadão por toda a vida.',
    dataRegistered: ['Nome Completo', 'Filiação Estrita', 'D.N. e Local de Nascimento', 'Coordenadas do Hospital'],
    systemIntegration: 'Ministério da Justiça e Direitos Humanos (Registo Civil)',
    color: '#0066FF',
  },
  {
    id: 'identidade',
    phase: 'Atribuição Jurídica',
    age: '5 Anos',
    label: 'B.I. Simplificado',
    description: 'Emissão descomplicada do Bilhete de Identidade. Não há preenchimento manual de dados: o sistema herda com precisão o histórico civil e recolhe apenas a biometria.',
    dataRegistered: ['Foto Digitalizada', 'Impressões Digitais', 'Validação de Residência Local'],
    systemIntegration: 'Direção Nacional de Identificação Civil (DNIC)',
    color: '#00D8F6',
  },
  {
    id: 'educacao',
    phase: 'Início Pedagógico',
    age: '6 Anos',
    label: 'Matrícula Escolar Única',
    description: 'Ingresso automático no Ensino Primário. Com base na residência registada na FUC, o sistema sugere vagas e o encarregado aprova a matrícula via sms ou balcão.',
    dataRegistered: ['Nível Escolar Inicial', 'Escola Atribuída', 'Encarregado de Educação'],
    systemIntegration: 'SILA Educação x Ministério da Educação (MED)',
    color: '#FFB800',
  },
  {
    id: 'saude',
    phase: 'Acompanhamento',
    age: 'Frequente',
    label: 'Prontuário Médico Nacional',
    description: 'Histórico de saúde interligado. Calendário de vacinação em dia e alertas automáticos de consultas ligadas à FICHA ÚNICA do aluno.',
    dataRegistered: ['Plano de Vacinas', 'Alergias e Restrições', 'Índice de Desenvolvimento Nutricional'],
    systemIntegration: 'Ministério da Saúde (MINSA)',
    color: '#10B981',
  },
  {
    id: 'trabalho',
    phase: 'Inserção Ativa',
    age: '18 Anos',
    label: 'Diploma e Mercado',
    description: 'Comprovação académica instantânea. Empresas e órgãos públicos validam certificados do SILA imediatamente, eliminando falsificações e tempos de espera.',
    dataRegistered: ['Histórico Escolar Completo', 'Grau Académico Autenticado', 'NIF Ativo Oficial'],
    systemIntegration: 'Registo Nacional de Graus Académicos / AGT',
    color: '#8B5CF6',
  },
  {
    id: 'apoio',
    phase: 'Coesão Social',
    age: 'Qualquer',
    label: 'Proteção Social Ativa',
    description: 'Mapeamento de vulnerabilidade territorial. Auxílios do Estado são concedidos de forma inteligente e oportuna a quem realmente necessita.',
    dataRegistered: ['Agrupadora Familiar', 'Índice de Renda Estimado', 'Subsídios Atribuídos'],
    systemIntegration: 'Ministério da Ação Social, Família e Promoção da Mulher (MASFAMU)',
    color: '#EC4899',
  },
  {
    id: 'reforma',
    phase: 'Segurança Futura',
    age: '60+ Anos',
    label: 'Reforma Inteligente',
    description: 'Aposentadoria automática sem papelada. Toda a contribuição ao longo da vida e histórico de registos SILA consolidam o benefício instantaneamente.',
    dataRegistered: ['Tempo de Contribuição Consolidado', 'Dados de Recebimento de Pensão'],
    systemIntegration: 'Instituto Nacional de Segurança Social (INSS)',
    color: '#D97706',
  },
];

export const STUDENT_JOURNEY_STEPS: StudentJourneyStep[] = [
  {
    id: 1,
    stage: 'ETAPA 01',
    age: '0 Anos',
    title: 'Nascimento Digitalizado',
    narrative: 'Carlos nasce no Hospital Geral do Huambo. Imediatamente a unidade de saúde emite uma declaração eletrónica que sincroniza com o registo civil.',
    systemAction: 'Geração imediata do NIU (Número de Identificação Único) na Ficha Única do Carlos.',
    visualState: 'birth',
    dataPayload: {
      'Cidadão': 'Carlos Manuel Neto',
      'NIU': 'AO-2026-9874-H',
      'Naturalidade': 'Huambo, Angola',
      'Pai': 'Mateus Neto',
      'Mãe': 'Sofia Manuel Neto'
    }
  },
  {
    id: 2,
    stage: 'ETAPA 02',
    age: '5 Anos',
    title: 'Emissão Biométrica',
    narrative: 'Carlos completa 5 anos. Na delegação do MAT/DNIC local, o atendente faz a leitura digital do NIU. A foto e impressões digitais são anexadas diretamente ao perfil existente.',
    systemAction: 'Validação e acionamento automático do Bilhete de Identidade com base na certidão unificada.',
    visualState: 'nif',
    dataPayload: {
      'Status B.I.': 'Emitido Física e Digitalmente',
      'Número B.I.': '009874213HA048',
      'NIF': '5009874213',
      'Biometria': 'Registada 10/10 Pontos'
    }
  },
  {
    id: 3,
    stage: 'ETAPA 03',
    age: '6 Anos',
    title: 'Matrícula Automática',
    narrative: 'No primeiro ano do ensino primário, o encarregado do Carlos recebe um SMS informando que a Escola Primária Nº 44 (próxima da sua casa) tem uma vaga reservada. Ele apenas confirma via SMS.',
    systemAction: 'O SILA Educação liga a base de dados de residência civil da FUC para sugerir a melhor vaga escolar.',
    visualState: 'school',
    dataPayload: {
      'Escola': 'Escola Primária Nº 44 - Huambo',
      'Ano Letivo': '2032',
      'Classe': '1ª Classe',
      'Encarregado': 'Mateus Neto (Pai)'
    }
  },
  {
    id: 4,
    stage: 'ETAPA 04',
    age: '8 Anos',
    title: 'Acompanhamento Diário',
    narrative: 'O professor do Carlos utiliza o Módulo Escolar SILA num computador portátil para registar avaliações, notas e presenças diárias. Não há pautas em papel suscetíveis a extravios ou rasuras.',
    systemAction: 'Sincronização em tempo real das pautas letivas locais com a Secretaria Provincial.',
    visualState: 'class',
    dataPayload: {
      'Turma': 'Sala 4 - Período Manhã',
      'Frequência': '98.5%',
      'Nota Matemática': '17 / 20',
      'Nota Língua Por.': '18 / 20'
    }
  },
  {
    id: 5,
    stage: 'ETAPA 05',
    age: '12 Anos',
    title: 'Certificação Digital',
    narrative: 'Ao concluir o ensino primário, o SILA gera automaticamente o Certificado de Habilitações com assinatura criptográfica governamental. O documento é adicionado ao portfólio digital da sua FUC.',
    systemAction: 'Emissão e assinatura eletrónica do certificado, livre de fraudes e cartórios.',
    visualState: 'grade',
    dataPayload: {
      'Habilitação': 'Ensino Primário Concluído',
      'Média Final': '17.5 Valores',
      'Hash de Segurança': 'sha256-f8e2...a01',
      'Emitente': 'República de Angola - SILA'
    }
  },
  {
    id: 6,
    stage: 'ETAPA 06',
    age: '14 Anos',
    title: 'Soberania Territorial',
    narrative: 'A família do Carlos muda-se para Luanda em busca de novos rumos profissionais. Na Escola Secundária de Luanda, o diretor escolar introduz o NIF ou NIU do Carlos. Todo o histórico letivo de anos letivos do Huambo aparece de forma instantânea, viabilizando a nova matrícula sem perda de tempo.',
    systemAction: 'Verificação da FUC e transferência eletrónica homologada em 20 segundos.',
    visualState: 'transfer',
    dataPayload: {
      'Status': 'Transferência Sincronizada',
      'Origem': 'DPE Huambo (Escola Nº 44)',
      'Destino': 'DPE Luanda (Complexo Caxito)',
      'Tempo de Transação': '18 Segundos'
    }
  }
];

export const EDUCATION_CAPABILITIES: EducationCapability[] = [
  {
    id: 'escolas',
    title: 'Cadastro de Escolas',
    category: 'Gestão',
    description: 'Levantamento georreferenciado e infraestrutural de todas as unidades escolares do território.',
    detailedScope: ['Mapeamento Geográfico por GPS', 'Capacidade de turmas e salas', 'Inventário de infraestruturas (Água, Luz, Internet)', 'Histórico de Inspeções'],
    iconName: 'School',
  },
  {
    id: 'matriculas',
    title: 'Gestão de Matrículas',
    category: 'Secretaria',
    description: 'Processo fluído e automatizado sem pautas manuais de inscrição pública.',
    detailedScope: ['Inscrição e reserva via SMS / Web', 'Distribuição inteligente de vagas por geolocalização', 'Alocação de prioridade social', 'Matrículas de transição automáticas'],
    iconName: 'UserCheck',
  },
  {
    id: 'alunos',
    title: 'Gestão de Alunos',
    category: 'Pedagógico',
    description: 'Perfil pedagógico estrito do aluno conectado diretamente ao número civil (NIU).',
    detailedScope: ['Histórico multidisciplinar', 'Registo de assiduidade biométrico ou diário', 'Alertas de abandono escolar preventivo', 'Necessidades educativas especiais associadas'],
    iconName: 'Users',
  },
  {
    id: 'professores',
    title: 'Gestão de Professores',
    category: 'Gestão',
    description: 'Sincronização da folha local de professores com qualificações e turmas atribuídas.',
    detailedScope: ['Sumário de carga horária letiva', 'Validação de especialidade e diplomas', 'Transferência de quadro de docentes', 'Registo de assiduidade e pontualidade'],
    iconName: 'GraduationCap',
  },
  {
    id: 'turmas',
    title: 'Gestão de Turmas',
    category: 'Pedagógico',
    description: 'Organização estruturada de disciplinas, horários e docentes por sala.',
    detailedScope: ['Criação de disciplinas dinâmicas', 'Calendários letivos inteligentes', 'Mapas de aulas semanais', 'Lotação máxima parametrizável'],
    iconName: 'Layers',
  },
  {
    id: 'vagas',
    title: 'Gestão de Vagas',
    category: 'Secretaria',
    description: 'Painel unificado em tempo real evitando superlotação das salas de aula.',
    detailedScope: ['Indicador de vagas ociosas regionais', 'Previsão de evasão letiva', 'Fenda de oferta vs procura territorial', 'Remanejamento estratégico de turmas'],
    iconName: 'CheckSquare',
  },
  {
    id: 'boletins',
    title: 'Boletins Digitais',
    category: 'Pedagógico',
    description: 'Lançamento de notas em tempo real visível instantaneamente para encarregados.',
    detailedScope: ['Pautas eletrónicas unificadas', 'Médias calculadas de forma automática', 'Assinatura digital dos professores', 'Visualização mobile simplificada'],
    iconName: 'ClipboardList',
  },
  {
    id: 'certificados',
    title: 'Certificados Digitais',
    category: 'Secretaria',
    description: 'Emissão instantânea de equivalências e certificados de habitações com integridade total.',
    detailedScope: ['Geração em PDF com código QR de validação', 'Assinatura eletrónica ICP-Angola', 'Dispensa de autenticação fiduciária física', 'Histórico inalterável em Blockchain local'],
    iconName: 'Award',
  },
  {
    id: 'transferencias',
    title: 'Transferências Rápidas',
    category: 'Secretaria',
    description: 'Migração direta de alunos entre províncias ou escolas sem recomeçar o processo do zero.',
    detailedScope: ['Validação automática de vaga na escola de destino', 'Envio eletrónico de dossiê académico', 'Historial disciplinar integral exportado', 'Aprovação célere das Direções Provinciais'],
    iconName: 'ArrowLeftRight',
  },
  {
    id: 'inspecao',
    title: 'Inspeção Escolar',
    category: 'Supervisão',
    description: 'Sistemas dedicados para monitoras de educação e equipas de auditoria do MAT.',
    detailedScope: ['Relatórios de inspeção pedagógica padronizados', 'Controlo de cumprimento curricular', 'Auditoria de verbas locais directas', 'Avaliação de desempenho institucional'],
    iconName: 'ShieldAlert',
  },
  {
    id: 'estatisticas',
    title: 'Estatísticas Provinciais',
    category: 'Supervisão',
    description: 'Painéis consolidados para Governadores e Diretores de Educação do que ocorre na Província.',
    detailedScope: ['Taxa de alfabetização real', 'Rácio aluno/professor por município', 'Índices de aproveitamento letivo', 'Alertas de falhas de abastecimento escolar'],
    iconName: 'BarChart3',
  },
  {
    id: 'relatorios',
    title: 'Relatórios Executivos',
    category: 'Supervisão',
    description: 'Modelos automatizados prontos para audiência ministerial e órgãos de soberania.',
    detailedScope: ['Exportação de dados abertos compatíveis com o INE', 'Infográficos estruturais e demográficos', 'Indicadores de metas do Plano Nacional de Desenvolvimento', 'Auditorias de impacto social'],
    iconName: 'FileSpreadsheet',
  },
];

export const PILOT_PHASES: PilotPhase[] = [
  {
    id: 1,
    phase: 'FASE 1',
    title: 'Consolidação de Controlo',
    status: 'Pronto',
    locationName: 'Província do Huambo',
    scope: 'Implementação integral do módulo Educação com intersecção direta das maternidades e identificação civil na província modelo.',
    timeline: 'Meses 1 a 6',
    metrics: [
      { label: 'Municípios Piloto', value: '11' },
      { label: 'Escolas Integradas', value: '420' },
      { label: 'Estimativa de Alunos', value: '125 Mil' },
      { label: 'Docentes Formados', value: '4.3 Mil' }
    ]
  },
  {
    id: 2,
    phase: 'FASE 2',
    title: 'Expansão Controlada',
    status: 'Planeado',
    locationName: 'Municípios Selecionados de Angola',
    scope: 'Alargamento da experiência e testes de interoperabilidade regional em zonas industriais e litorais de grande afluência.',
    timeline: 'Meses 6 a 12',
    metrics: [
      { label: 'Zonas Adicionais', value: '3 Províncias' },
      { label: 'Municípios Filtro', value: '14' },
      { label: 'Estimativa de Alunos', value: '450 Mil' },
      { label: 'Infraestruturas', value: 'Acelerada' }
    ]
  },
  {
    id: 3,
    phase: 'FASE 3',
    title: 'Escalabilidade Soberana',
    status: 'Planeado',
    locationName: 'Sincronização Nacional de Angola',
    scope: 'Transposição de todos os dados regionais para o Core Nacional SILA, abrindo frentes automáticas de Saúde e Justiça.',
    timeline: 'Meses 12 a 24',
    metrics: [
      { label: 'Províncias Unidas', value: '18 / 18' },
      { label: 'Cidadãos na FUC', value: '12+ Milhões' },
      { label: 'Total de Escolas', value: '12.000+' },
      { label: 'Sinergias de Ministérios', value: '6 Integrados' }
    ]
  }
];
