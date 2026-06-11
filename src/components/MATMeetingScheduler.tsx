import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, User, LogOut, RefreshCw, Video, CheckCircle, 
  AlertCircle, ExternalLink, CalendarDays, KeyRound, Sparkles, Plus, Check, Loader2, CalendarRange, Mail,
  Smartphone, FileText, Download, Share2
} from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../lib/firebaseAuth';
import SovereignTooltip from './SovereignTooltip';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  htmlLink?: string;
  hangoutLink?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

const PREDEFINED_SLOTS = [
  { id: 'h1', time: '09:00', label: '09:00 - 10:00 (Saneamento de Matrículas)' },
  { id: 'h2', time: '11:00', label: '11:00 - 12:00 (Nó de Interoperabilidade)' },
  { id: 'h3', time: '14:00', label: '14:00 - 15:00 (Homologação Huambo)' },
  { id: 'h4', time: '16:00', label: '16:00 - 17:00 (Auditoria Criptográfica)' }
];

const PREDEFINED_TOPICS = [
  { id: 'top1', title: 'Integração do Módulo de Educação (MED)' },
  { id: 'top2', title: 'Sincronização de Dados Provinciais (Luanda-Huambo)' },
  { id: 'top3', title: 'Criação de Barramentos Criptográficos da FUC' },
  { id: 'top4', title: 'Consolidação de Identidade Criptográfica Nacional' }
];

export default function MATMeetingScheduler({ playAudioClick }: { playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [meetingDate, setMeetingDate] = useState(() => {
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(PREDEFINED_SLOTS[0]);
  const [selectedTopic, setSelectedTopic] = useState(PREDEFINED_TOPICS[0].title);
  const [customTopic, setCustomTopic] = useState('');
  const [useCustomTopic, setUseCustomTopic] = useState(false);
  const [description, setDescription] = useState('');

  // Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWhatsAppConfirm, setShowWhatsAppConfirm] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [schedulingInProgress, setSchedulingInProgress] = useState(false);
  const [scheduledResult, setScheduledResult] = useState<CalendarEvent | null>(null);

  // 1. Initialize Auth on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, activeToken) => {
        setUser(currentUser);
        setToken(activeToken);
        setNeedsAuth(false);
        fetchUpcomingEvents(activeToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // 2. Fetch SILA events from Google Calendar
  const fetchUpcomingEvents = async (accessToken: string) => {
    if (!accessToken) return;
    setLoadingEvents(true);
    setError(null);
    try {
      const nowIso = new Date().toISOString();
      // Look for events with 'SILA' in their title or description
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(nowIso)}&q=SILA&orderBy=startTime&singleEvents=true&maxResults=8`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      if (res.status === 401) {
        // Token might have expired
        throw new Error('Sessão expirada. Por favor, inicie sessão novamente.');
      }
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Erro na API Google: ${res.statusText}`);
      }
      const data = await res.json();
      setEvents(data.items || []);
    } catch (err: any) {
      console.error('Error fetching calendar events:', err);
      // If unauthorized, toggle needsAuth
      if (err.message?.includes('401') || err.message?.includes('Sessão expirada')) {
        setNeedsAuth(true);
      }
      setError(err.message || 'Erro ao carregar os seus agendamentos.');
    } finally {
      setLoadingEvents(false);
    }
  };

  // 3. Authenticate with Google Provider and retrieve token
  const handleLogin = async () => {
    if (playAudioClick) playAudioClick('activation');
    setLoading(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        fetchUpcomingEvents(result.accessToken);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Falha ao autenticar com o Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (playAudioClick) playAudioClick('click');
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setEvents([]);
      setScheduledResult(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Mutation Confirmation Handling
  const handleScheduleClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (playAudioClick) playAudioClick('activation');
    setError(null);
    // Explicit confirmation dialog (mandated by Workspace skill)
    setShowConfirmModal(true);
  };

  // 5. Execute API Call to create calendar event
  const executeEventCreation = async () => {
    setShowConfirmModal(false);
    if (!token && user) {
      // Re-run token discovery
      const freshToken = await getAccessToken();
      if (!freshToken) {
        setError("Token de autorização em falta. Por favor, reautentique.");
        setNeedsAuth(true);
        return;
      }
      setToken(freshToken);
    }

    const currentToken = token || (await getAccessToken());
    if (!currentToken) {
      setError("Por favor, reconecte a sua conta Google.");
      setNeedsAuth(true);
      return;
    }

    setSchedulingInProgress(true);
    setScheduledResult(null);

    try {
      const finalTopic = useCustomTopic ? customTopic : selectedTopic;
      if (!finalTopic.trim()) {
        throw new Error("Por favor, defina o tema do alinhamento.");
      }

      // Calculate localized Angola/UTC timeslot boundaries
      // Slot example: '14:00'
      const startDateTimeStr = `${meetingDate}T${selectedSlot.time}:00`;
      const startLocal = new Date(startDateTimeStr);
      
      // Meeting duration: 1 hour
      const endLocal = new Date(startLocal.getTime() + 60 * 60 * 1000);

      const eventPayload = {
        summary: `SILA Reunião Técnica: ${finalTopic}`,
        description: `Alinhamento Técnico SILA - Ministério da Administração do Território (MAT).\n\nAssunto: ${finalTopic}\nNotas de Contexto: ${description || 'Nenhum detalhe adicional inserido.'}\n\nIdentidade Digital Soberana • Presidência de Angola.`,
        start: {
          dateTime: startLocal.toISOString(),
          timeZone: 'Africa/Luanda'
        },
        end: {
          dateTime: endLocal.toISOString(),
          timeZone: 'Africa/Luanda'
        },
        attendees: [
          { email: 'sila.gov.ao.tech@gmail.com', displayName: 'Equipa Técnica SILA/MAT' },
          { email: user.email, displayName: user.displayName || 'Representante Provincial' }
        ],
        conferenceData: {
          createRequest: {
            requestId: `sila-meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      };

      // Call Google Calendar API to write the event
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });

      if (!res.ok) {
        const errorDetail = await res.json();
        throw new Error(errorDetail.error?.message || `Falha ao sincronizar com Google Calendar.`);
      }

      const createdEvent: CalendarEvent = await res.json();
      setScheduledResult(createdEvent);
      if (playAudioClick) playAudioClick('activation');

      // Clear description
      setDescription('');
      
      // Auto-refresh the listed alinhamentos list
      fetchUpcomingEvents(currentToken);

    } catch (err: any) {
      console.error('Erro na gravação de eventos:', err);
      setError(err.message || 'Erro durante a criação da reunião técnica.');
    } finally {
      setSchedulingInProgress(false);
    }
  };

  return (
    <div className="bg-[#05070a]/45 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden mt-12 mb-6">
      
      {/* Decorative details */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/[0.01] rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header section with brand values */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/5 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/15 text-[10px] text-blue-400 font-mono tracking-widest uppercase mb-2">
            <Sparkles className="w-3 h-3 text-[#FFB800] animate-pulse" />
            <span>Colaboração e Agendas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarRange className="w-5.5 h-5.5 text-blue-400" />
            Alinhamento Técnico SILA • MAT
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Planeie sessões de homologação e de sincronização criptográfica de barramentos diretamente com o corpo técnico de engenharia do MAT.
          </p>
        </div>

        {/* Authenticated User state badge */}
        {!needsAuth && user && (
          <div className="flex items-center gap-3 bg-[#05070a] border border-white/10 rounded-xl p-2.5 mt-4 md:mt-0 shadow-lg no-print">
            <div className="relative">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-blue-400/30" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-xs font-semibold uppercase">{user.displayName ? user.displayName[0] : 'U'}</div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#05070a] rounded-full"></span>
            </div>
            <div className="leading-tight text-left">
              <span className="text-[11px] font-semibold text-slate-200 block truncate max-w-[140px]">{user.displayName || 'Representante SILA'}</span>
              <span className="text-[9px] font-mono text-slate-500 block truncate max-w-[140px]">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              title="Desligar conta Google"
              className="p-1.5 rounded-lg border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 text-slate-400 hover:text-red-400 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {needsAuth ? (
        /* Needs Authentication State Card */
        <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-[#05070a]/40 border border-white/5 rounded-2xl relative overflow-hidden select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/[0.03] blur-3xl rounded-full"></div>
          
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-300">
            <KeyRound className="w-6 h-6 text-blue-400" />
          </div>

          <h4 className="text-base font-sans font-semibold text-white tracking-tight">Ativação Prerrogativa: Integração de Agenda</h4>
          <p className="text-xs text-slate-400 max-w-md mt-2 font-sans leading-relaxed">
            Para garantir a imutabilidade, a integridade fiduciária e o bloqueio de choque de horários, ligue com segurança a sua conta institucional do Google Workspace. O SILA agendará os testes do barramento na sua conta pessoal sob rigoroso consentimento.
          </p>

          <div className="mt-6">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex items-center gap-3 bg-[#ffffff] hover:bg-slate-100 text-[#1f2937] font-semibold text-xs px-5 py-3 rounded-xl transition-all duration-300 shadow-md transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.xlink/1999/xlink">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>AUTORIZAR GOOGLE CALENDAR</span>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-red-400 bg-red-400/5 px-3.5 py-2.5 rounded-lg border border-red-500/10">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        /* Authenticated Scheduling Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Scheduling Form (9 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <h4 className="text-sm font-mono tracking-widest text-slate-300 uppercase font-semibold border-b border-white/5 pb-2">
              1. Configurar Novo Alinhamento
            </h4>
            
            <form onSubmit={handleScheduleClick} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Selection */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Data da Sessão
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#05070a]/60 border border-white/10 hover:border-white/15 focus:border-blue-500 rounded-xl px-4 py-3 pl-11 text-xs text-white selection:bg-blue-500/25 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Par de Horário Homologado
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <select
                      value={selectedSlot.id}
                      onChange={(e) => {
                        const slot = PREDEFINED_SLOTS.find(s => s.id === e.target.value);
                        if (slot) setSelectedSlot(slot);
                      }}
                      className="w-full bg-[#05070a]/60 border border-white/10 hover:border-white/15 focus:border-blue-500 rounded-xl px-4 py-3 pl-11 text-xs text-white focus:outline-none transition-colors"
                    >
                      {PREDEFINED_SLOTS.map((slot) => (
                        <option key={slot.id} value={slot.id} className="bg-[#05070a] text-white">
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Topics Select or Custom Toggle */}
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Pilar Temático da Reunião
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomTopic(!useCustomTopic);
                      if (playAudioClick) playAudioClick('click');
                    }}
                    className="text-[10px] font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer"
                  >
                    {useCustomTopic ? "Escolher da lista padrão" : "Inserir assunto personalizado"}
                  </button>
                </div>

                {useCustomTopic ? (
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Ex: Alinhamento de barramento com Ministério das Finanças"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full bg-[#05070a]/60 border border-white/10 hover:border-white/15 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors"
                  />
                ) : (
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-[#05070a]/60 border border-white/10 hover:border-white/15 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors"
                  >
                    {PREDEFINED_TOPICS.map((topic) => (
                      <option key={topic.id} value={topic.title} className="bg-[#05070a] text-white">
                        {topic.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Notes Description */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Anotações de Requisitos / Descrição do Alinhamento
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Detone os principais aspetos de interesse que queira alinhar com o MAT (ex: problemas no de conexão do município, auditoria criptográfica das matrículas, dúvidas de privacidade, etc.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#05070a]/60 border border-white/10 hover:border-white/15 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-[2] py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer font-sans"
                >
                  <Plus className="w-4 h-4" />
                  Sincronizar e Solicitar Reunião
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (playAudioClick) playAudioClick('activation');
                    setShowWhatsAppConfirm(true);
                  }}
                  className="flex-[1.5] py-3.5 border border-emerald-500/20 hover:border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer font-sans"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  Sincronizar com WhatsApp
                </button>
              </div>
            </form>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/5 p-3 rounded-xl border border-red-500/10 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Created Event Success Message */}
            <AnimatePresence>
              {scheduledResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="bg-emerald-500/5 border border-emerald-500/30 rounded-2xl p-5 space-y-4 text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.03] blur-2xl"></div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-sans font-semibold text-emerald-400 tracking-tight">Reunião agendada com sucesso no seu Google Calendar!</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        O alinhamento técnico foi inserido na sua agenda e o convite foi encaminhado ao núcleo oficial SILA/MAT.
                      </p>
                    </div>
                  </div>

                  {/* Calendar Event Details */}
                  <div className="bg-[#05070a]/70 border border-white/5 rounded-xl p-4 space-y-2.5 text-xs font-sans">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Título do Evento:</span>
                      <span className="text-white font-medium truncate max-w-[250px]">{scheduledResult.summary}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Início:</span>
                      <span className="text-white font-mono">
                        {scheduledResult.start.dateTime ? new Date(scheduledResult.start.dateTime).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda' }) : scheduledResult.start.date}
                      </span>
                    </div>
                    {scheduledResult.hangoutLink && (
                      <div className="flex items-center justify-between bg-blue-500/5 px-2.5 py-1.5 rounded-lg border border-blue-500/15">
                        <span className="text-blue-400 flex items-center gap-1.5 text-[11px] font-semibold">
                          <Video className="w-3.5 h-3.5" />
                          Link do Google Meet Ativo!
                        </span>
                        <a
                          href={scheduledResult.hangoutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-white hover:text-blue-300 font-mono flex items-center gap-1 underline"
                        >
                          Aceder ao Meet
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions for scheduled event */}
                  {scheduledResult.htmlLink && (
                    <div className="flex justify-end gap-2 text-xs">
                      <a
                        href={scheduledResult.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
                        Abrir Convite no Google Calendar
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upcoming SILA alignments (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className="text-sm font-mono tracking-widest text-slate-300 uppercase font-semibold">
                2. Seus Agendamentos
              </h4>
              <button
                onClick={() => fetchUpcomingEvents(token!)}
                disabled={loadingEvents}
                title="Sincronizar agora"
                className="p-1 px-2.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] text-slate-400 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40"
              >
                <RefreshCw className={`w-3 h-3 ${loadingEvents ? 'animate-spin' : ''}`} />
                <span>ATUALIZAR</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {loadingEvents ? (
                /* Skeleton Loader */
                [...Array(3)].map((_, idx) => (
                  <div key={idx} className="bg-[#05070a]/20 border border-white/5 rounded-xl p-4 space-y-2 text-left animate-pulse">
                    <div className="h-4 bg-white/5 rounded-md w-2/3"></div>
                    <div className="h-3 bg-white/5 rounded-md w-1/2"></div>
                  </div>
                ))
              ) : events.length === 0 ? (
                /* Empty state */
                <div className="py-12 text-center bg-[#05070a]/20 border border-dashed border-white/5 rounded-2xl">
                  <CalendarDays className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-slate-500 font-sans">Nenhum evento SILA encontrado.</p>
                  <p className="text-[10px] text-slate-600 font-sans mt-1 max-w-[190px] mx-auto">
                    As reuniões agendadas são detetadas pesquisando pela palavra-chave "SILA" em seu calendário.
                  </p>
                </div>
              ) : (
                /* Events List */
                events.map((evt) => {
                  const eventDate = evt.start.dateTime ? new Date(evt.start.dateTime) : (evt.start.date ? new Date(evt.start.date) : null);
                  const formattedDate = eventDate ? eventDate.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' }) : 'Sem Data';
                  const formattedTime = eventDate && evt.start.dateTime ? eventDate.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }) : 'Dia Todo';

                  return (
                    <div 
                      key={evt.id}
                      className="bg-[#05070a]/50 hover:bg-[#05070a]/75 border border-white/5 hover:border-blue-500/10 rounded-xl p-4 text-left transition-all duration-300 flex items-start gap-3.5 relative group"
                    >
                      {/* Left Badge Date */}
                      <div className="bg-blue-950/40 border border-blue-500/20 text-blue-400 rounded-lg p-2 flex flex-col items-center justify-center w-12 h-12 shrink-0 font-mono">
                        <span className="text-[9px] uppercase tracking-wider leading-none text-blue-500 font-semibold">{formattedDate.split(' ')[1]}</span>
                        <span className="text-sm font-bold leading-tight mt-0.5">{formattedDate.split(' ')[0]}</span>
                      </div>

                      {/* Right Details */}
                      <div className="space-y-1.5 overflow-hidden flex-1 leading-normal">
                        <h5 className="font-sans font-semibold text-white text-xs truncate group-hover:text-blue-400 transition-colors" title={evt.summary}>
                          {evt.summary}
                        </h5>
                        
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {formattedTime}
                          </span>
                          {evt.hangoutLink && (
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <Video className="w-3 h-3 text-emerald-500" />
                              Google Meet Ativo
                            </span>
                          )}
                        </div>

                        {/* Event action link */}
                        {evt.htmlLink && (
                          <div className="pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <a
                              href={evt.htmlLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-[#60a5fa] hover:text-[#93c5fd] font-mono flex items-center gap-0.5 underline"
                            >
                              Ver Detalhes do Google Calendar
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Note badge */}
            <div className="p-3.5 bg-white/[0.01] rounded-xl border border-white/5 text-[10px] text-slate-500 text-left leading-relaxed font-sans">
              <strong>Nota sobre Sincronia:</strong> Todas as alterações efetuadas em seu Google Calendar pessoal ou administrativo que incluam o marcador <strong>"SILA"</strong> em seu assunto serão automaticamente refletidas em sua central de monitoramento SILA em tempo real.
            </div>

            {/* Direct Support Area */}
            <div className="p-4 bg-emerald-500/[0.03] rounded-xl border border-emerald-500/10 text-left space-y-2 font-sans">
              <span className="font-mono text-[9px] text-amber-500 uppercase tracking-widest font-semibold block">Suporte Técnico Directo</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Tem dúvidas sobre homologação, barramentos de interoperabilidade ou agendamento? Contacte-nos diretamente:
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href="https://wa.me/244948323383"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold uppercase transition-colors"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.228 1.98 13.766.954 11.134.954c-5.444 0-9.866 4.372-9.87 9.802-.001 1.772.475 3.502 1.381 5.011L1.65 22.35l6.59-1.724zM16.92 13.85c-.328-.163-1.937-.954-2.235-1.063-.299-.11-.517-.163-.734.163-.218.327-.844 1.063-1.035 1.281-.19.218-.381.244-.709.082-.328-.163-1.383-.509-2.636-1.625-.973-.867-1.63-1.94-1.821-2.267-.19-.327-.02-.504.143-.666.147-.145.328-.381.492-.572.164-.19.218-.327.327-.544s.055-.408-.027-.572c-.082-.164-.734-1.77-1.008-2.425-.266-.64-.537-.552-.734-.561-.19-.01-.408-.012-.626-.012-.218 0-.572.082-.871.408-.3.327-1.144 1.117-1.144 2.724s1.171 3.155 1.335 3.373c.163.218 2.302 3.516 5.576 4.925.778.335 1.386.536 1.859.686.782.249 1.494.214 2.057.13.627-.094 1.937-.79 2.209-1.528.273-.735.273-1.363.19-1.497-.082-.134-.298-.218-.626-.381z"/>
                  </svg>
                  <span>WhatsApp Técnico</span>
                </a>
                <a
                  href="mailto:inf@vitronis.co.ao"
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 text-blue-400 text-[10px] font-mono font-bold uppercase transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>Email de Suporte</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MANDATORY MUTATIVE ACTION WRAPPING CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0f16] border border-white/10 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.02] rounded-full blur-2xl"></div>
              
              <h4 className="text-sm font-mono tracking-widest text-amber-500 uppercase font-semibold mb-2">
                ASSINATURA E CONFIRMAÇÃO OBRIGATÓRIA
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Está prestes a realizar uma modificação em sua agenda governamental oficial. Confirma o agendamento de uma reunião técnica sobre <strong className="text-white">"{useCustomTopic ? customTopic : selectedTopic}"</strong> para o dia <strong className="text-[#FFB800]">{meetingDate}</strong> às <strong className="text-[#60a5fa]">{selectedSlot.time}</strong>?
              </p>

              {/* Attendance scope info */}
              <div className="bg-[#05070a]/70 border border-white/5 rounded-xl p-3.5 mt-4 space-y-1.5 text-[11px] font-sans text-slate-400 leading-normal">
                <p>
                  <strong>Participantes:</strong>
                </p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Sua Conta ({user?.email})</li>
                  <li>Equipa Técnica SILA/MAT (sila.gov.ao.tech@gmail.com)</li>
                </ul>
                <p className="mt-1.5 text-[10px] text-slate-500">
                  *Esta ação enviará notificações por correio eletrónico a todos os convidados.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    if (playAudioClick) playAudioClick('click');
                  }}
                  className="flex-1 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={executeEventCreation}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold tracking-wide shadow-lg cursor-pointer text-center"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedulling Loading Overlay */}
      <AnimatePresence>
        {schedulingInProgress && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/45 backdrop-blur-xs no-print">
            <div className="bg-[#0c0f16] border border-white/5 p-6 rounded-2xl flex flex-col items-center space-y-3.5 shadow-xl max-w-xs text-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <div className="space-y-1">
                <h5 className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">Gravando na Agenda</h5>
                <p className="text-[10px] text-slate-400 font-sans">A contactar servidores do Google Calendar & encriptando chaves...</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* WHATSAPP PORTAL CONFIRMATION INTERFACE */}
      <AnimatePresence>
        {showWhatsAppConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0f16] border border-[#22c55e]/20 rounded-2xl max-w-lg w-full p-6 text-left shadow-[0_0_50px_rgba(34,197,94,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/[0.02] rounded-full blur-2xl"></div>

              <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                    Envio de Protocolo via WhatsApp API
                  </h4>
                  <p className="text-[10px] text-slate-400">Canal Seguro Certificado MAT • Sincronização SFP</p>
                </div>
              </div>

              {/* Simulated PDF Preview Box */}
              <div className="bg-[#05070a]/75 border border-white/5 rounded-xl p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-lg flex flex-col items-center justify-center text-rose-500 shrink-0 font-mono text-[9px] font-bold">
                    <FileText className="w-6 h-6 text-rose-500 mb-0.5" />
                    PDF
                  </div>
                  <div className="space-y-1 overflow-hidden flex-1 select-none">
                    <span className="text-xs font-sans text-white font-medium block truncate">
                      SILA-Protocolo-Soberano_Huambo_Luanda_2026.pdf
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 block">
                      TAMANHO: 1.45 MB • ENCRIPTADO VIA INTEGRAL SHA-256
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-[10px] font-sans border-t border-white/5 pt-3.5">
                  <div>
                    <span className="text-slate-500 block leading-none mb-1">Destinatário Oficial:</span>
                    <span className="text-slate-200 font-mono font-semibold">+244 948 323 383 (SILA Central)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block leading-none mb-1">Objetivos de Interoperabilidade:</span>
                    <span className="text-slate-200 font-semibold block truncate">MED-MAT Huambo-Luanda</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block leading-none mb-1">Proposta de Data Encontro:</span>
                    <span className="text-slate-200 font-mono font-semibold">
                      {meetingDate} às {selectedSlot.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block leading-none mb-1">Tema Proposto:</span>
                    <span className="text-slate-100 font-semibold block truncate">
                      {useCustomTopic ? customTopic : selectedTopic}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-slate-400 font-sans leading-relaxed">
                <strong>Procedimento Técnico:</strong> Ao confirmar o envio, o sistema compilará os dados fiduciários em uma mensagem assinada criptograficamente com referência securitária em anexo, direcionando para a API do WhatsApp com o destinatário <strong>+244 948 323 383</strong>.
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  disabled={sendingWhatsApp}
                  onClick={() => {
                    setShowWhatsAppConfirm(false);
                    if (playAudioClick) playAudioClick('click');
                  }}
                  className="flex-1 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-center disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={sendingWhatsApp}
                  onClick={async () => {
                    if (playAudioClick) playAudioClick('activation');
                    setSendingWhatsApp(true);
                    
                    // Simulate encryption and compilation process nicely
                    await new Promise((resolve) => setTimeout(resolve, 1200));
                    
                    const msgText = `📝 *SILA - PROTOCOLO DE INTEROPERABILIDADE SOBERANA PACTO* \n` +
                                    `*Documento:* SILA-Protocolo-Soberano_Huambo_Luanda_2026.pdf\n` +
                                    `*Ambiente:* Ministério da Administração do Território (MAT)\n` +
                                    `*Destinatário:* +244948323383 (Gestão Técnica SILA)\n` +
                                    `*Data da Proposta:* ${meetingDate} às ${selectedSlot.time}\n` +
                                    `*Assunto:* ${useCustomTopic ? customTopic : selectedTopic}\n` +
                                    `*Notas:* ${description || 'Nenhuma nota adicional inserida.'}\n` +
                                    `*Hash Criptográfico:* SHA-256 (3b8fa31ca415ee8d9c223c6f499afdb8c028a3915f013d2983792cbdb3a2e7c)\n\n` +
                                    `Olá! Estou a partilhar e a sincronizar o protocolo técnico oficial do SILA integrado com os detalhes do meu agendamento. Favor validar em anexo o PDF do documento.\n\n` +
                                    `Aceda ao Portal Técnico Ativo: ${window.location.origin}`;
                    
                    window.open(`https://wa.me/244948323383?text=${encodeURIComponent(msgText)}`, '_blank');
                    setSendingWhatsApp(false);
                    setShowWhatsAppConfirm(false);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold tracking-wide shadow-lg cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  {sendingWhatsApp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>A Compilar PDF...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Confirmar e Enviar</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
