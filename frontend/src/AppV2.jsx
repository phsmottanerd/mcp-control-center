import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, BarChart3, CheckCircle2,
  ChevronRight, Cpu, CreditCard, Database, FileText, Gauge, HardDrive,
  LayoutDashboard, Menu, Pencil, Play, Plus, Receipt, RefreshCw, Save,
  Search, Settings, ShieldCheck, Terminal, Trash2, Users, Wallet, X,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import "./AppV2.css";

const menuItems = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["professores", "Professores", Users],
  ["jobs", "Jobs", Terminal],
  ["cobol", "COBOL CRUD", Database],
  ["analytics", "Analytics", BarChart3],
  ["logs", "Logs", FileText],
  ["config", "Configurações", Settings],
];

const emptyForm = { nome: "", email: "", especialidade: "", cargaHoraria: "40" };
const emptyAccountForm = { cliente: "", tipoConta: "CORRENTE", numeroConta: "", agencia: "", saldoInicial: "0.00", dataAbertura: new Date().toISOString().slice(0, 10) };
const chartColors = ["#6dd4ff", "#7c9cff", "#7ee0c5", "#d7b7ff", "#f5d77a", "#ff9b7a"];
const formatarMoeda = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor || 0));

async function lerRespostaApi(response, fallback) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensagem || data.message || data.detail || fallback);
  return data;
}

function AppV2() {
  const [professores, setProfessores] = useState([]);
  const [section, setSection] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(true);
  const [status, setStatus] = useState("READY");
  const [output, setOutput] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [logs, setLogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("TODAS");
  const [professorSearch, setProfessorSearch] = useState("");
  const [contas, setContas] = useState([]);
  const [contasResumo, setContasResumo] = useState(null);
  const [contasErro, setContasErro] = useState("");
  const [contasLoading, setContasLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [analyticsMovimentacoes, setAnalyticsMovimentacoes] = useState([]);
  const [analyticsTipoConta, setAnalyticsTipoConta] = useState("");
  const [analyticsOperacao, setAnalyticsOperacao] = useState("");
  const [analyticsPeriodo, setAnalyticsPeriodo] = useState("TODOS");
  const [contaSelecionadaId, setContaSelecionadaId] = useState("");
  const [contaSelecionada, setContaSelecionada] = useState(null);
  const [extrato, setExtrato] = useState([]);
  const [contaForm, setContaForm] = useState(emptyAccountForm);
  const [editandoConta, setEditandoConta] = useState(false);
  const [filtrosContas, setFiltrosContas] = useState({ numeroConta: "", agencia: "", cliente: "", tipoConta: "" });
  const [filtrosExtrato, setFiltrosExtrato] = useState({ tipo: "", de: "", ate: "" });
  const [valorOperacao, setValorOperacao] = useState("");
  const [descricaoOperacao, setDescricaoOperacao] = useState("");
  const [estadoConta, setEstadoConta] = useState("READY");
  const [mensagemConta, setMensagemConta] = useState("");
  const [tipoMensagemConta, setTipoMensagemConta] = useState("info");
  const [operacaoContaBusy, setOperacaoContaBusy] = useState(false);

  const carregarResumoContas = async () => {
    try {
      const response = await fetch("/contas/resumo");
      setContasResumo(await lerRespostaApi(response, "Não foi possível carregar o resumo bancário."));
    } catch {
      setContasResumo(null);
    }
  };

  const carregarContas = async (filtros = filtrosContas) => {
    setContasLoading(true);
    setContasErro("");
    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => { if (value) params.set(key, value); });
      const response = await fetch(`/contas${params.size ? `?${params}` : ""}`);
      setContas(await lerRespostaApi(response, "Não foi possível consultar contas."));
    } catch (error) {
      setContas([]);
      setContasErro(error.message || "API de contas indisponível.");
    } finally {
      setContasLoading(false);
    }
  };

  const carregarContaSelecionada = async (id = contaSelecionadaId) => {
    if (!id) throw new Error("Selecione uma conta para continuar.");
    const response = await fetch(`/contas/${id}`);
    const conta = await lerRespostaApi(response, "Não foi possível consultar a conta.");
    setContaSelecionada(conta);
    return conta;
  };

  const carregarExtrato = async (id = contaSelecionadaId, filtros = filtrosExtrato) => {
    if (!id) throw new Error("Selecione uma conta para consultar o extrato.");
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => { if (value) params.set(key, value); });
    const response = await fetch(`/contas/${id}/extrato${params.size ? `?${params}` : ""}`);
    setExtrato(await lerRespostaApi(response, "Não foi possível carregar o extrato."));
  };

  const atualizarContaDepoisDaOperacao = async (id) => {
    await Promise.all([carregarContas(), carregarResumoContas(), carregarAnalytics()]);
    await carregarContaSelecionada(id);
    await carregarExtrato(id);
  };

  const selecionarConta = async (id) => {
    setContaSelecionadaId(id);
    setContaSelecionada(null);
    setExtrato([]);
    if (!id) return;
    setEstadoConta("PROCESSING");
    try {
      await carregarContaSelecionada(id);
      await carregarExtrato(id);
      setEstadoConta("SUCCESS");
      setMensagemConta("Conta e extrato carregados.");
      setTipoMensagemConta("success");
    } catch (error) {
      setEstadoConta("ERROR");
      setMensagemConta(error.message);
      setTipoMensagemConta("error");
    }
  };

  const salvarConta = async (event) => {
    event.preventDefault();
    setOperacaoContaBusy(true);
    setEstadoConta("PROCESSING");
    setMensagemConta("");
    try {
      const payload = {
        cliente: contaForm.cliente.trim(),
        tipoConta: contaForm.tipoConta,
        numeroConta: contaForm.numeroConta.trim(),
        agencia: contaForm.agencia.trim(),
        dataAbertura: contaForm.dataAbertura,
      };
      const editingId = editandoConta ? contaSelecionadaId : "";
      const response = await fetch(editingId ? `/contas/${editingId}` : "/contas", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? payload : { ...payload, saldoInicial: Number(contaForm.saldoInicial) }),
      });
      const saved = await lerRespostaApi(response, "Não foi possível salvar a conta.");
      setContaSelecionadaId(String(saved.id));
      await atualizarContaDepoisDaOperacao(saved.id);
      setContaForm(emptyAccountForm);
      setEditandoConta(false);
      setEstadoConta("SUCCESS");
      setMensagemConta(editingId ? "Dados da conta atualizados." : "Conta cadastrada com sucesso.");
      setTipoMensagemConta("success");
    } catch (error) {
      setEstadoConta("ERROR");
      setMensagemConta(error.message || "Erro ao salvar conta.");
      setTipoMensagemConta("error");
    } finally {
      setOperacaoContaBusy(false);
    }
  };

  const prepararEdicaoConta = () => {
    if (!contaSelecionada) return;
    setContaForm({
      cliente: contaSelecionada.cliente,
      tipoConta: contaSelecionada.tipoConta,
      numeroConta: contaSelecionada.numeroConta,
      agencia: contaSelecionada.agencia,
      saldoInicial: "0.00",
      dataAbertura: contaSelecionada.dataAbertura,
    });
    setEditandoConta(true);
    setEstadoConta("READY");
    setMensagemConta("Edite os dados cadastrais. O histórico financeiro será preservado.");
    setTipoMensagemConta("info");
  };

  const excluirContaSelecionada = async () => {
    if (!contaSelecionada || !window.confirm(`Excluir a conta ${contaSelecionada.numeroConta}? Contas com histórico não podem ser removidas.`)) return;
    setOperacaoContaBusy(true);
    setEstadoConta("PROCESSING");
    try {
      const response = await fetch(`/contas/${contaSelecionada.id}`, { method: "DELETE" });
      await lerRespostaApi(response, "Não foi possível excluir a conta.");
      setContaSelecionadaId("");
      setContaSelecionada(null);
      setExtrato([]);
      await Promise.all([carregarContas(), carregarResumoContas(), carregarAnalytics()]);
      setEstadoConta("SUCCESS");
      setMensagemConta("Conta excluída.");
      setTipoMensagemConta("success");
    } catch (error) {
      setEstadoConta("ERROR");
      setMensagemConta(error.message || "Erro ao excluir conta.");
      setTipoMensagemConta("error");
    } finally {
      setOperacaoContaBusy(false);
    }
  };

  const executarMovimentacaoConta = async (tipo) => {
    if (!contaSelecionada) {
      setEstadoConta("ERROR");
      setMensagemConta("Selecione uma conta antes de movimentar.");
      setTipoMensagemConta("error");
      return;
    }
    const valor = Number(valorOperacao);
    if (!Number.isFinite(valor) || valor <= 0) {
      setEstadoConta("ERROR");
      setMensagemConta("Informe um valor maior que zero.");
      setTipoMensagemConta("error");
      return;
    }
    setOperacaoContaBusy(true);
    setEstadoConta("PROCESSING");
    setMensagemConta(tipo === "DEPOSITO" ? "Registrando depósito..." : "Validando e registrando saque...");
    setTipoMensagemConta("warning");
    try {
      const response = await fetch(`/contas/${contaSelecionada.id}/${tipo === "DEPOSITO" ? "depositos" : "saques"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor, descricao: descricaoOperacao.trim() || null }),
      });
      await lerRespostaApi(response, "Não foi possível registrar a movimentação.");
      await atualizarContaDepoisDaOperacao(contaSelecionada.id);
      setValorOperacao("");
      setDescricaoOperacao("");
      setEstadoConta("SUCCESS");
      setMensagemConta(`${tipo === "DEPOSITO" ? "Depósito" : "Saque"} registrado; saldo e extrato atualizados.`);
      setTipoMensagemConta("success");
    } catch (error) {
      setEstadoConta("ERROR");
      setMensagemConta(error.message || "Erro ao registrar movimentação.");
      setTipoMensagemConta("error");
    } finally {
      setOperacaoContaBusy(false);
    }
  };

  const alterarStatusConta = async (status) => {
    if (!contaSelecionada) return;
    setOperacaoContaBusy(true);
    setEstadoConta("PROCESSING");
    try {
      const response = await fetch(`/contas/${contaSelecionada.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await lerRespostaApi(response, "Não foi possível alterar o status.");
      await atualizarContaDepoisDaOperacao(contaSelecionada.id);
      setEstadoConta("SUCCESS");
      setMensagemConta(`Status alterado para ${status}.`);
      setTipoMensagemConta("success");
    } catch (error) {
      setEstadoConta("ERROR");
      setMensagemConta(error.message || "Erro ao alterar status.");
      setTipoMensagemConta("error");
    } finally {
      setOperacaoContaBusy(false);
    }
  };

  const consultarSaldoConta = async () => {
    if (!contaSelecionada) return;
    setEstadoConta("PROCESSING");
    try {
      const response = await fetch(`/contas/${contaSelecionada.id}/saldo`);
      const saldoAtual = await lerRespostaApi(response, "Não foi possível consultar o saldo.");
      setContaSelecionada((current) => ({ ...current, saldoAtual }));
      setEstadoConta("SUCCESS");
      setMensagemConta("Saldo consultado na API.");
      setTipoMensagemConta("success");
    } catch (error) {
      setEstadoConta("ERROR");
      setMensagemConta(error.message);
      setTipoMensagemConta("error");
    }
  };

  const addLog = (message, level = "INFO") => {
    setLogs((current) => [{
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      level,
      message,
    }, ...current].slice(0, 15));
  };

  const carregar = async () => {
    setLoading(true);
    setApiError("");
    try {
      const response = await fetch("/professores");
      if (!response.ok) throw new Error(`GET /professores retornou HTTP ${response.status}`);
      const data = await response.json();
      setProfessores(data);
      setApiError("");
      addLog(`${data.length} professor(es) carregado(s)`, "SUCCESS");
    } catch (error) {
      setProfessores([]);
      setApiError(`Não foi possível consultar professores: ${error.message}`);
      addLog(`Falha em GET /professores: ${error.message}`, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  async function carregarAnalytics() {
    setAnalyticsLoading(true);
    setAnalyticsError("");
    try {
      const response = await fetch("/contas");
      const contasAtuais = await lerRespostaApi(response, "Não foi possível consultar as contas para o dashboard.");
      const historicos = await Promise.all(contasAtuais.map(async (conta) => {
        const extratoResponse = await fetch(`/contas/${conta.id}/extrato`);
        const movimentos = await lerRespostaApi(extratoResponse, `Falha ao consultar o extrato da conta ${conta.numeroConta}.`);
        return movimentos.map((movimento) => ({ ...movimento, cliente: conta.cliente, numeroConta: conta.numeroConta, tipoConta: conta.tipoConta }));
      }));
      setContas(contasAtuais);
      setAnalyticsMovimentacoes(historicos.flat());
    } catch (error) {
      setAnalyticsError(error.message || "Não foi possível carregar os dados analíticos.");
      setAnalyticsMovimentacoes([]);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    carregarResumoContas();
    carregarAnalytics();
    addLog("Dashboard iniciado", "INFO");
  }, []);

  const totalCarga = useMemo(() => professores.reduce((total, professor) => total + Number(professor.cargaHoraria || 0), 0), [professores]);
  const filteredProfessores = useMemo(() => professores.filter((professor) => {
    const correspondeEspecialidade = activeFilter === "TODAS" || professor.especialidade === activeFilter;
    const termo = professorSearch.trim().toLocaleLowerCase("pt-BR");
    const correspondeBusca = !termo || [professor.nome, professor.email, professor.especialidade]
      .some((campo) => String(campo || "").toLocaleLowerCase("pt-BR").includes(termo));
    return correspondeEspecialidade && correspondeBusca;
  }), [professores, activeFilter, professorSearch]);
  const especialidades = useMemo(() => Object.entries(filteredProfessores.reduce((map, professor) => {
    const name = professor.especialidade || "Sem especialidade";
    map[name] = (map[name] || 0) + 1;
    return map;
  }, {})).map(([nome, total]) => ({ nome, total })).sort((a, b) => b.total - a.total), [filteredProfessores]);
  const ranking = useMemo(() => [...filteredProfessores].sort((a, b) => Number(b.cargaHoraria || 0) - Number(a.cargaHoraria || 0)).slice(0, 5), [filteredProfessores]);
  const contasFiltradas = useMemo(() => analyticsTipoConta
    ? contas.filter((conta) => conta.tipoConta === analyticsTipoConta)
    : contas, [contas, analyticsTipoConta]);
  const movimentacoesFiltradas = useMemo(() => {
    const limite = analyticsPeriodo === "TODOS" ? null : new Date();
    if (limite) limite.setDate(limite.getDate() - Number(analyticsPeriodo));
    return analyticsMovimentacoes.filter((movimento) => {
      const data = new Date(`${movimento.data}T${movimento.hora || "00:00:00"}`);
      return (!analyticsTipoConta || movimento.tipoConta === analyticsTipoConta)
        && (!analyticsOperacao || movimento.operacao === analyticsOperacao)
        && (!limite || data >= limite);
    });
  }, [analyticsMovimentacoes, analyticsTipoConta, analyticsOperacao, analyticsPeriodo]);
  const contasPorTipo = useMemo(() => ["CORRENTE", "POUPANCA"].map((tipo) => ({
    tipo,
    total: contasFiltradas.filter((conta) => conta.tipoConta === tipo).length,
  })), [contasFiltradas]);
  const totaisMovimentacoes = useMemo(() => ["DEPOSITO", "SAQUE"].map((operacao) => ({
    operacao: operacao === "DEPOSITO" ? "Depósitos" : "Saques",
    total: movimentacoesFiltradas
      .filter((movimento) => movimento.operacao === operacao)
      .reduce((soma, movimento) => soma + Number(movimento.valor || 0), 0),
  })), [movimentacoesFiltradas]);
  const movimentacoesDiarias = useMemo(() => {
    const porData = new Map();
    movimentacoesFiltradas.forEach((movimento) => {
      const item = porData.get(movimento.data) || { data: movimento.data, depositos: 0, saques: 0 };
      if (movimento.operacao === "DEPOSITO") item.depositos += Number(movimento.valor || 0);
      if (movimento.operacao === "SAQUE") item.saques += Number(movimento.valor || 0);
      porData.set(movimento.data, item);
    });
    return [...porData.values()].sort((a, b) => a.data.localeCompare(b.data)).slice(-14);
  }, [movimentacoesFiltradas]);
  const saldoFiltrado = contasFiltradas.reduce((soma, conta) => soma + Number(conta.saldoAtual || 0), 0);
  const atividadeRecente = useMemo(() => [...movimentacoesFiltradas]
    .sort((a, b) => `${b.data}T${b.hora}`.localeCompare(`${a.data}T${a.hora}`))
    .slice(0, 6), [movimentacoesFiltradas]);

  const metricCards = [
    { label: "TOTAL PROFESSORES", value: filteredProfessores.length, icon: Users, color: "cyan", detail: "REGISTROS NO FILTRO" },
    { label: "CARGA HORÁRIA", value: `${filteredProfessores.reduce((total, item) => total + Number(item.cargaHoraria || 0), 0)}h`, icon: Gauge, color: "violet", detail: "TOTAL NO FILTRO" },
    { label: "COBOL BATCH", value: status, icon: Cpu, color: status === "ERROR" ? "red" : "amber", detail: status === "RUNNING" ? "PROCESSANDO" : status === "COMPLETED" ? "CONCLUÍDO" : "PRONTO" },
    { label: "API STATUS", value: loading ? "CHECK" : apiError ? "ERRO" : "ONLINE", icon: HardDrive, color: apiError ? "red" : "green", detail: loading ? "CONSULTANDO" : "SPRING BOOT" },
  ];

  const navegar = (id) => {
    setSection(id);
    if (id === "cobol") {
      carregarContas();
      carregarResumoContas();
    }
    addLog(`Navegação: ${id}`, "INFO");
  };

  const novoProfessor = () => { setEditingId(null); setForm(emptyForm); setModal(true); };
  const editarProfessor = (professor) => { setEditingId(professor.id); setForm({ nome: professor.nome || "", email: professor.email || "", especialidade: professor.especialidade || "", cargaHoraria: String(professor.cargaHoraria ?? "") }); setModal(true); };

  const salvarProfessor = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/professores/${editingId}` : "/professores";
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: form.nome.trim(), email: form.email.trim(), especialidade: form.especialidade.trim(), cargaHoraria: Number(form.cargaHoraria) }),
      });
      await lerRespostaApi(response, `Não foi possível salvar o professor (HTTP ${response.status}).`);
      await carregar();
      addLog(editingId ? `Professor #${editingId} atualizado` : "Professor criado", "SUCCESS");
      setForm(emptyForm); setEditingId(null); setModal(false);
    } catch (error) {
      addLog(`Falha ao salvar professor: ${error.message}`, "ERROR");
    } finally {
      setSaving(false);
    }
  };

  const excluirProfessor = async (id) => {
    if (!window.confirm(`Excluir professor #${id}?`)) return;
    try {
      const response = await fetch(`/professores/${id}`, { method: "DELETE" });
      await lerRespostaApi(response, `DELETE /professores/${id} retornou HTTP ${response.status}.`);
      await carregar();
      addLog(`Professor #${id} excluído`, "SUCCESS");
    } catch (error) {
      addLog(`Falha ao excluir professor #${id}: ${error.message}`, "ERROR");
    }
  };

  const executarCobol = async () => {
    setStatus("RUNNING"); setOutput("");
    addLog("Execução COBOL iniciada", "INFO");
    try {
      const response = await fetch("/jobs/cobol/professores", { method: "POST" });
      const text = await response.text();
      if (!response.ok) throw new Error();
      setOutput(text.trim()); setStatus("COMPLETED");
      addLog("PROFPROC concluído", "SUCCESS");
    } catch {
      setStatus("ERROR"); setOutput("Falha ao executar PROFPROC. Verifique o ambiente GNU COBOL.");
      addLog("PROFPROC falhou", "ERROR");
    }
  };

  const renderDashboard = () => (
    <>
      <section className="hero-panel panel">
        <div className="hero-copy">
          <div className="eyebrow-row"><span className="eyebrow">MAINFRAME · LINUX · AUTOMATION</span><span className={`live-badge ${apiError ? "offline" : ""}`}><span />{loading ? "API CHECK" : apiError ? "API ERROR" : "API ONLINE"}</span></div>
          <h1>MCP Control Center</h1>
          <p>Monitoramento operacional, analytics de dados e processamento COBOL em um único centro de comando tecnológico.</p>
          <div className="hero-stats">
            <div><strong>{loading ? "..." : apiError ? "ERRO" : "API"}</strong><span>{loading ? "VERIFICANDO" : apiError ? "INDISPONÍVEL" : "CONECTADA"}</span></div>
            <div><strong>{professores.length}</strong><span>REGISTROS</span></div>
            <div><strong>{totalCarga}h</strong><span>CARGA TOTAL</span></div>
          </div>
          <div className="hero-actions"><button className="primary-button" onClick={() => navegar("professores")}><Users size={18} /> GERENCIAR PROFESSORES</button><button className="secondary-button" onClick={executarCobol} disabled={status === "RUNNING"}><Play size={17} fill="currentColor" /> {status === "RUNNING" ? "PROCESSANDO..." : "EXECUTAR BATCH"}</button></div>
        </div>
        <div className="hero-visual" aria-label="Processador 3D do MCP Control Center">
          <div className="processor-shadow" />
          <svg className="processor-cables" viewBox="0 0 430 350" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <path id="cable-route-left-1" d="M-4 78 C30 78 42 88 59 103 S82 121 104 121" />
              <path id="cable-route-left-2" d="M-4 119 C27 119 45 112 61 126 S82 143 104 143" />
              <path id="cable-route-left-3" d="M-4 177 C27 177 45 184 61 170 S83 155 104 158" />
              <path id="cable-route-left-4" d="M-4 220 C31 220 44 234 61 218 S83 183 104 174" />
              <path id="cable-route-right-1" d="M434 74 C401 74 389 85 372 100 S349 117 326 117" />
              <path id="cable-route-right-2" d="M434 116 C403 116 388 110 371 124 S348 140 326 140" />
              <path id="cable-route-right-3" d="M434 176 C402 176 389 184 371 169 S349 153 326 155" />
              <path id="cable-route-right-4" d="M434 219 C402 219 389 231 371 216 S349 181 326 174" />
              <linearGradient id="cable-metal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8b8b84" />
                <stop offset="0.35" stopColor="#363a3c" />
                <stop offset="0.68" stopColor="#101214" />
                <stop offset="1" stopColor="#62635f" />
              </linearGradient>
            </defs>
            <g className="cable-housings">
              <use href="#cable-route-left-1" className="cable-shadow" /><use href="#cable-route-left-1" className="cable-jacket" />
              <use href="#cable-route-left-2" className="cable-shadow" /><use href="#cable-route-left-2" className="cable-jacket" />
              <use href="#cable-route-left-3" className="cable-shadow" /><use href="#cable-route-left-3" className="cable-jacket" />
              <use href="#cable-route-left-4" className="cable-shadow" /><use href="#cable-route-left-4" className="cable-jacket" />
              <use href="#cable-route-right-1" className="cable-shadow" /><use href="#cable-route-right-1" className="cable-jacket" />
              <use href="#cable-route-right-2" className="cable-shadow" /><use href="#cable-route-right-2" className="cable-jacket" />
              <use href="#cable-route-right-3" className="cable-shadow" /><use href="#cable-route-right-3" className="cable-jacket" />
              <use href="#cable-route-right-4" className="cable-shadow" /><use href="#cable-route-right-4" className="cable-jacket" />
            </g>
            <g className="cable-braids">
              <use href="#cable-route-left-1" /><use href="#cable-route-left-2" />
              <use href="#cable-route-left-3" /><use href="#cable-route-left-4" />
              <use href="#cable-route-right-1" /><use href="#cable-route-right-2" />
              <use href="#cable-route-right-3" /><use href="#cable-route-right-4" />
            </g>
            <g className="cable-currents">
              <use href="#cable-route-left-1" className="cable-current current-blue" />
              <use href="#cable-route-left-2" className="cable-current current-red" />
              <use href="#cable-route-left-3" className="cable-current current-gold" />
              <use href="#cable-route-left-4" className="cable-current current-blue" />
              <use href="#cable-route-right-1" className="cable-current current-red" />
              <use href="#cable-route-right-2" className="cable-current current-gold" />
              <use href="#cable-route-right-3" className="cable-current current-blue" />
              <use href="#cable-route-right-4" className="cable-current current-red" />
            </g>
          </svg>
          <div className="processor-frame">
            <div className="processor-underbody" aria-hidden="true" />
            <div className="processor-base-deck" aria-hidden="true">
              <span className="deck-edge deck-edge-front" />
              <span className="deck-edge deck-edge-left" />
              <span className="deck-edge deck-edge-right" />
              <span className="deck-component deck-component-a"><i /><i /><i /></span>
              <span className="deck-component deck-component-b"><i /><i /><i /><i /></span>
              <span className="deck-component deck-component-c"><i /><i /></span>
              <span className="deck-contact-row" />
              <span className="deck-fastener fastener-a" />
              <span className="deck-fastener fastener-b" />
              <span className="deck-fastener fastener-c" />
              <span className="deck-fastener fastener-d" />
            </div>
            <svg className="processor-cooling" viewBox="0 0 430 122" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="copper-tube" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffd293" />
                  <stop offset="0.16" stopColor="#bd703d" />
                  <stop offset="0.42" stopColor="#6c3825" />
                  <stop offset="0.68" stopColor="#d28a4b" />
                  <stop offset="1" stopColor="#54291d" />
                </linearGradient>
                <path id="cooling-loop-a" d="M18 39 C34 17 68 13 91 27 L136 56 C157 70 180 70 201 56 L245 28 C270 12 302 17 320 38 C340 60 369 63 400 43" />
                <path id="cooling-loop-b" d="M15 72 C42 92 70 93 94 77 L136 49 C157 35 180 35 201 49 L246 78 C270 95 300 91 321 72 C344 51 369 49 403 70" />
                <path id="cooling-loop-c" d="M72 109 C102 102 119 88 139 78 L174 60 C191 51 210 52 228 64 L268 91 C298 111 323 109 354 92" />
              </defs>
              <g className="cooling-pipe-shadows">
                <use href="#cooling-loop-a" /><use href="#cooling-loop-b" /><use href="#cooling-loop-c" />
              </g>
              <g className="cooling-pipe-bodies">
                <use href="#cooling-loop-a" /><use href="#cooling-loop-b" /><use href="#cooling-loop-c" />
              </g>
              <g className="cooling-pipe-highlights">
                <use href="#cooling-loop-a" /><use href="#cooling-loop-b" /><use href="#cooling-loop-c" />
              </g>
              <g className="coolant-flow">
                <use href="#cooling-loop-a" /><use href="#cooling-loop-b" />
              </g>
            </svg>
            <svg className="processor-facade-lights" viewBox="0 0 430 306" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <path id="facade-route-blue" pathLength="1000" d="M22 38 H390 Q407 38 407 55 V251 Q407 269 390 269 H40 Q22 269 22 251 V55 Q22 38 40 38 H22" />
                <path id="facade-route-red" pathLength="1000" d="M38 57 H373 Q390 57 390 74 V230 Q390 248 373 248 H57 Q40 248 40 230 V75 Q40 57 57 57 H38" />
                <path id="facade-route-amber" pathLength="1000" d="M30 82 H58 Q75 82 87 95 L104 112 V194 Q104 211 89 223 L68 240 H40" />
                <path id="facade-route-cyan" pathLength="1000" d="M46 48 H83 V91 L106 114 M384 48 H347 V91 L324 114 M46 258 H83 V215 L106 194 M384 258 H347 V215 L324 194" />
              </defs>
              <g className="facade-channels">
                <use href="#facade-route-blue" /><use href="#facade-route-red" />
                <use href="#facade-route-amber" /><use href="#facade-route-cyan" />
              </g>
              <g className="facade-flow">
                <use href="#facade-route-blue" className="facade-blue" />
                <use href="#facade-route-red" className="facade-red" />
                <use href="#facade-route-amber" className="facade-amber" />
                <use href="#facade-route-cyan" className="facade-cyan" />
              </g>
              <g className="facade-cores">
                <use href="#facade-route-blue" className="facade-core-blue" />
                <use href="#facade-route-red" className="facade-core-red" />
                <use href="#facade-route-amber" className="facade-core-amber" />
              </g>
            </svg>
            <div className="processor-header">
              <span className="processor-led" />
              <span>PROCESSOR CORE</span>
            </div>
            <div className="processor-body">
              <div className="processor-rail rail-left" aria-hidden="true" />
              <div className="processor-rail rail-right" aria-hidden="true" />
              <div className="processor-module module-a" aria-hidden="true">
                <span className="module-trace trace-a" />
                <span className="module-trace trace-b" />
              </div>
              <div className="processor-module module-b" aria-hidden="true">
                <span className="module-trace trace-c" />
              </div>
              <div className="processor-component component-a" aria-hidden="true"><i /><i /><i /></div>
              <div className="processor-component component-b" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="processor-component component-c" aria-hidden="true"><i /><i /></div>
              <div className="processor-chip">
                <div className="chip-grid" />
                <div className="chip-center"><Cpu size={20} /><span className="chip-owner">PAULO HENRIQUE</span><small>PROGRAMADOR COBOL</small></div>
              </div>
              <div className="processor-heat-sink" aria-hidden="true">
                <span className="heat-fin fin-a" />
                <span className="heat-fin fin-b" />
                <span className="heat-fin fin-c" />
                <span className="heat-fin fin-d" />
                <span className="heat-fan" />
              </div>
              <span className="processor-contact contact-top" aria-hidden="true" />
              <span className="processor-contact contact-bottom" aria-hidden="true" />
              <span className="processor-contact contact-left" aria-hidden="true" />
              <span className="processor-contact contact-right" aria-hidden="true" />
              <span className="processor-side" aria-hidden="true" />
              <span className="processor-pins" aria-hidden="true" />
            </div>
            <div className="processor-security"><ShieldCheck size={13} /><span>SECURE FABRIC</span><i /></div>
          </div>
          <svg className="processor-connectors" viewBox="0 0 430 350" preserveAspectRatio="none" aria-hidden="true">
            <g className="cable-plug plug-left" transform="translate(78 110)"><rect className="plug-body" width="34" height="23" rx="4" /><rect className="plug-collar" x="24" y="3" width="10" height="17" rx="2" /><path className="plug-contacts" d="M27 6v11 M30 6v11" /></g>
            <g className="cable-plug plug-left" transform="translate(78 132)"><rect className="plug-body" width="34" height="23" rx="4" /><rect className="plug-collar" x="24" y="3" width="10" height="17" rx="2" /><path className="plug-contacts" d="M27 6v11 M30 6v11" /></g>
            <g className="cable-plug plug-left" transform="translate(78 147)"><rect className="plug-body" width="34" height="23" rx="4" /><rect className="plug-collar" x="24" y="3" width="10" height="17" rx="2" /><path className="plug-contacts" d="M27 6v11 M30 6v11" /></g>
            <g className="cable-plug plug-left" transform="translate(78 163)"><rect className="plug-body" width="34" height="23" rx="4" /><rect className="plug-collar" x="24" y="3" width="10" height="17" rx="2" /><path className="plug-contacts" d="M27 6v11 M30 6v11" /></g>
            <g className="cable-plug plug-right" transform="translate(318 106)"><rect className="plug-body" width="34" height="23" rx="4" /><rect className="plug-collar" x="0" y="3" width="10" height="17" rx="2" /><path className="plug-contacts" d="M4 6v11 M7 6v11" /></g>
            <g className="cable-plug plug-right" transform="translate(318 129)"><rect className="plug-body" width="34" height="23" rx="4" /><rect className="plug-collar" x="0" y="3" width="10" height="17" rx="2" /><path className="plug-contacts" d="M4 6v11 M7 6v11" /></g>
            <g className="cable-plug plug-right" transform="translate(318 144)"><rect className="plug-body" width="34" height="23" rx="4" /><rect className="plug-collar" x="0" y="3" width="10" height="17" rx="2" /><path className="plug-contacts" d="M4 6v11 M7 6v11" /></g>
            <g className="cable-plug plug-right" transform="translate(318 163)"><rect className="plug-body" width="34" height="23" rx="4" /><rect className="plug-collar" x="0" y="3" width="10" height="17" rx="2" /><path className="plug-contacts" d="M4 6v11 M7 6v11" /></g>
          </svg>
          <div className="processor-data">
            <span>BUS 64 BIT</span>
            <span>SYNC ONLINE</span>
            <span>SECURE CORE</span>
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        {metricCards.map(({ label, value, icon: Icon, color, detail }) => (
          <article className="kpi-card" key={label}><div className={`kpi-icon ${color}`}><Icon size={20} /></div><div className="kpi-body"><span>{label}</span><strong>{value}</strong></div><small>{detail}</small></article>
        ))}
      </section>

      <section className="banking-strip" aria-label="Resumo real do módulo Contas">
        <div className="banking-strip-title"><CreditCard size={16} /><span>INDICADORES BANCÁRIOS · DADOS DA API</span></div>
        <div><span>CONTAS</span><strong>{analyticsLoading ? "…" : analyticsError ? "—" : contasFiltradas.length}</strong></div>
        <div><span>CORRENTE</span><strong>{analyticsLoading ? "…" : contasPorTipo[0].total}</strong></div>
        <div><span>POUPANÇA</span><strong>{analyticsLoading ? "…" : contasPorTipo[1].total}</strong></div>
        <div><span>SALDO FILTRADO</span><strong>{analyticsLoading ? "…" : formatarMoeda(saldoFiltrado)}</strong></div>
        <div><span>DEPÓSITOS</span><strong>{analyticsLoading ? "…" : formatarMoeda(totaisMovimentacoes[0].total)}</strong></div>
        <div><span>SAQUES</span><strong>{analyticsLoading ? "…" : formatarMoeda(totaisMovimentacoes[1].total)}</strong></div>
      </section>

      <section className="panel analytics-panel">
        <div className="section-header"><div><span className="section-kicker">OPERATIONS ANALYTICS</span><h2>Performance operacional</h2></div><div className="analytics-controls"><label>Tipo de conta<select value={analyticsTipoConta} onChange={(event) => setAnalyticsTipoConta(event.target.value)}><option value="">TODAS</option><option value="CORRENTE">CORRENTE</option><option value="POUPANCA">POUPANÇA</option></select></label><label>Período<select value={analyticsPeriodo} onChange={(event) => setAnalyticsPeriodo(event.target.value)}><option value="TODOS">TODO O HISTÓRICO</option><option value="30">ÚLTIMOS 30 DIAS</option><option value="90">ÚLTIMOS 90 DIAS</option></select></label><label>Operação<select value={analyticsOperacao} onChange={(event) => setAnalyticsOperacao(event.target.value)}><option value="">TODAS</option><option value="DEPOSITO">DEPÓSITOS</option><option value="SAQUE">SAQUES</option></select></label><button className="ghost-button" onClick={() => { carregar(); carregarResumoContas(); carregarAnalytics(); }}><RefreshCw size={15} /> ATUALIZAR</button></div></div>
        {analyticsError && <div className="api-banner" role="alert"><AlertTriangle size={16} /> {analyticsError}</div>}
        <div className="overview-grid">
          <div className="chart-card wide"><div className="card-header"><div><span>CAPACIDADE ACADÊMICA</span><h3>Professores por especialidade</h3></div><BarChart3 size={18} /></div>{loading ? <div className="empty-state">Carregando professores…</div> : apiError ? <div className="empty-state">Não foi possível obter dados dos professores.</div> : especialidades.length ? <div className="chart-surface"><ResponsiveContainer width="100%" height="100%"><BarChart data={especialidades}><CartesianGrid strokeDasharray="3 3" stroke="rgba(143,173,255,0.12)" vertical={false} /><XAxis dataKey="nome" tick={{ fill: "#8ba0c2", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: "#8ba0c2", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#0b1b2b", border: "1px solid #2f4d70", borderRadius: 10 }} /><Bar dataKey="total" name="Professores" radius={[6, 6, 0, 0]} fill="#6dd4ff" /></BarChart></ResponsiveContainer></div> : <div className="empty-state">Nenhum professor corresponde aos filtros.</div>}</div>
          <div className="chart-card"><div className="card-header"><div><span>CARTEIRA DE CONTAS</span><h3>Contas por tipo</h3></div><Database size={18} /></div>{analyticsLoading ? <div className="empty-state">Carregando contas…</div> : analyticsError ? <div className="empty-state">Dados bancários indisponíveis.</div> : contasFiltradas.length ? <div className="donut-surface"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={contasPorTipo.filter((item) => item.total > 0)} dataKey="total" nameKey="tipo" innerRadius={42} outerRadius={66} paddingAngle={3}>{contasPorTipo.filter((item) => item.total > 0).map((entry) => <Cell key={entry.tipo} fill={entry.tipo === "CORRENTE" ? "#6dd4ff" : "#d4af37"} />)}</Pie><Tooltip contentStyle={{ background: "#0b1b2b", border: "1px solid #2f4d70", borderRadius: 10 }} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{contasFiltradas.length}</strong><span>CONTAS</span></div></div> : <div className="empty-state">Nenhuma conta para este filtro.</div>}</div>
        </div>
      </section>

      <section className="bottom-grid"><div className="panel chart-card"><div className="card-header"><div><span>EXTRATO REAL · VALORES POR DIA</span><h3>Depósitos e saques recentes</h3></div><Activity size={18} /></div>{analyticsLoading ? <div className="empty-state">Carregando movimentações…</div> : analyticsError ? <div className="empty-state">Movimentações indisponíveis.</div> : movimentacoesDiarias.length ? <div className="chart-surface small"><ResponsiveContainer width="100%" height="100%"><LineChart data={movimentacoesDiarias}><CartesianGrid stroke="rgba(143,173,255,0.12)" vertical={false} /><XAxis dataKey="data" tick={{ fill: "#8ba0c2", fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis tickFormatter={(valor) => formatarMoeda(valor)} tick={{ fill: "#8ba0c2", fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip formatter={(valor) => formatarMoeda(valor)} contentStyle={{ background: "#0b1b2b", border: "1px solid #2f4d70", borderRadius: 10 }} /><Line type="monotone" dataKey="depositos" name="Depósitos" stroke="#67df9d" strokeWidth={3} dot={{ r: 2 }} /><Line type="monotone" dataKey="saques" name="Saques" stroke="#ff6b5d" strokeWidth={3} dot={{ r: 2 }} /></LineChart></ResponsiveContainer></div> : <div className="empty-state">Nenhuma movimentação no período selecionado.</div>}</div><div className="panel pipeline-panel"><div className="card-header"><div><span>PIPELINE · STATUS DE EXECUÇÃO</span><h3>Fluxo operacional</h3></div><ChevronRight size={18} /></div><div className="pipeline"><div className="pipeline-step active"><span className="step-index">01</span><div><strong>API REST</strong><small>{apiError ? "ERRO DE CONEXÃO" : loading ? "CONSULTANDO" : "DADOS LIDOS"}</small></div>{apiError ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}</div><div className="pipeline-line" /><div className="pipeline-step"><span className="step-index">02</span><div><strong>DATABASE</strong><small>{analyticsError ? "ERRO DE LEITURA" : analyticsLoading ? "CONSULTANDO" : `${contas.length} CONTAS`}</small></div><Database size={16} /></div><div className="pipeline-line" /><div className="pipeline-step"><span className="step-index">03</span><div><strong>COBOL</strong><small>{status}</small></div><Cpu size={16} /></div></div></div></section>

      <section className="activity-row"><div className="panel activity-panel"><div className="section-header compact"><div><span className="section-kicker">EXTRATOS · REGISTROS PERSISTIDOS</span><h2>Movimentações recentes</h2></div></div>{analyticsLoading ? <div className="empty-state">Carregando atividade…</div> : analyticsError ? <div className="empty-state">Atividade indisponível.</div> : atividadeRecente.length ? <div className="activity-list">{atividadeRecente.map((entry) => <div className="activity-item" key={entry.id}><div className={`activity-dot ${entry.operacao === "SAQUE" ? "withdrawal" : "deposit"}`} /><div className="activity-copy"><strong>{entry.operacao} · {entry.cliente}</strong><span>Conta {entry.numeroConta} · {entry.data} {entry.hora}</span></div><div className="activity-time"><span>{entry.operacao === "SAQUE" ? "−" : "+"}{formatarMoeda(entry.valor)}</span></div></div>)}</div> : <div className="empty-state">Ainda não há movimentações registradas.</div>}</div><div className="panel ranking-panel"><div className="section-header compact"><div><span className="section-kicker">RANKING</span><h2>Maiores cargas</h2></div></div><div className="ranking-list">{ranking.length ? ranking.map((professor, index) => <div className="ranking-item" key={professor.id}><span className="ranking-number">{String(index + 1).padStart(2, "0")}</span><div><strong>{professor.nome}</strong><small>{professor.especialidade}</small></div><span className="ranking-hours">{professor.cargaHoraria}h</span></div>) : <div className="empty-state">Nenhum professor disponível.</div>}</div></div></section>

      <section className="panel table-panel"><div className="section-header"><div><span className="section-kicker">DATABASE</span><h2>Professores registrados</h2></div><div className="table-tools"><select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} aria-label="Filtrar especialidade"><option value="TODAS">TODAS</option>{[...new Set(professores.map((item) => item.especialidade).filter(Boolean))].map((item) => <option key={item} value={item}>{item}</option>)}</select><button className="primary-button small" onClick={novoProfessor}><Plus size={16} /> NOVO</button></div></div><div className="table-wrapper"><table><thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Especialidade</th><th>Carga</th><th>Ações</th></tr></thead><tbody>{filteredProfessores.map((professor) => <tr key={professor.id}><td>#{String(professor.id).padStart(3, "0")}</td><td>{professor.nome}</td><td>{professor.email}</td><td><span className="tag">{professor.especialidade || "Sem especialidade"}</span></td><td>{professor.cargaHoraria}h</td><td><div className="row-actions"><button className="mini-button edit" onClick={() => editarProfessor(professor)} aria-label={`Editar ${professor.nome}`}><Pencil size={14} /></button><button className="mini-button delete" onClick={() => excluirProfessor(professor.id)} aria-label={`Excluir ${professor.nome}`}><Trash2 size={14} /></button></div></td></tr>)}</tbody></table>{!filteredProfessores.length && !loading && <div className="empty-state">Nenhum professor corresponde ao filtro selecionado.</div>}</div></section>
    </>
  );

  const renderJobs = () => (
    <section className="content-stack"><div className="section-heading"><span className="section-kicker">OPERATIONS</span><h1>Jobs</h1><p>Processos executados por meio da infraestrutura Control Center.</p></div><div className="jobs-grid"><article className="panel job-feature"><div className="job-id"><span className="status-chip success">READY</span><span className="job-type">COBOL</span></div><h2>PROFPROC</h2><p>Processa os registros de professores no arquivo CSV e gera o relatório de saída.</p><div className="job-metadata"><div><span>Engine</span><strong>GNU COBOL</strong></div><div><span>Input</span><strong>professores.csv</strong></div><div><span>Output</span><strong>relatorio.txt</strong></div></div><button className="primary-button full" onClick={executarCobol} disabled={status === "RUNNING"}><Play size={17} fill="currentColor" /> {status === "RUNNING" ? "EXECUTANDO..." : "EXECUTAR JOB"}</button>{output && <pre className="job-output"><strong>Resultado</strong>{output}</pre>}</article><article className="panel job-feature muted"><div className="job-id"><span className="status-chip info">API</span><span className="job-type">REST</span></div><h2>Professor CRUD</h2><p>Operações de criação, consulta, atualização e exclusão conectadas ao backend.</p><div className="job-metrics"><div><span>Registros</span><strong>{professores.length}</strong></div><div><span>Carga</span><strong>{totalCarga}h</strong></div><div><span>Especialidades</span><strong>{especialidades.length}</strong></div></div><button className="secondary-button full" onClick={() => navegar("professores")}><Users size={17} /> ABRIR CRUD</button></article></div></section>
  );

  const renderCobol = () => (
    <section className="content-stack banking-console-page">
      <div className="section-heading"><span className="section-kicker">COBOL CRUD · BANKING TERMINAL</span><h1>Terminal Bancário</h1><p>Operações demonstrativas integradas ao Mainframe e persistidas no sistema.</p></div>

      <div className="atm-layout">
        <section className="panel atm-console">
          <header className="atm-console-header"><div><span className="section-kicker">01 / ENTRADA E OPERAÇÕES</span><h2>Console de operações</h2></div><span className={`atm-state ${estadoConta.toLowerCase()}`}><i />{estadoConta}</span></header>

          <form className="account-form" onSubmit={salvarConta}>
            <div className="atm-section-label"><span>CADASTRO / ATUALIZAÇÃO</span><small>{editandoConta ? "EDIÇÃO" : "NOVA CONTA"}</small></div>
            <div className="account-form-grid">
              <label>Cliente<input required maxLength="120" value={contaForm.cliente} onChange={(event) => setContaForm({ ...contaForm, cliente: event.target.value })} placeholder="Nome do cliente" /></label>
              <label>Tipo de conta<select value={contaForm.tipoConta} onChange={(event) => setContaForm({ ...contaForm, tipoConta: event.target.value })}><option value="CORRENTE">CONTA CORRENTE</option><option value="POUPANCA">CONTA POUPANÇA</option></select></label>
              <label>Número da conta<input required maxLength="24" pattern="([A-Za-z0-9]|-)+" value={contaForm.numeroConta} onChange={(event) => setContaForm({ ...contaForm, numeroConta: event.target.value })} placeholder="Ex.: 000124-5" /></label>
              <label>Agência<input required maxLength="12" pattern="([A-Za-z0-9]|-)+" value={contaForm.agencia} onChange={(event) => setContaForm({ ...contaForm, agencia: event.target.value })} placeholder="Ex.: 0142" /></label>
              {!editandoConta && <label>Saldo inicial<input required type="number" min="0" step="0.01" value={contaForm.saldoInicial} onChange={(event) => setContaForm({ ...contaForm, saldoInicial: event.target.value })} /></label>}
              <label>Data de abertura<input required type="date" value={contaForm.dataAbertura} onChange={(event) => setContaForm({ ...contaForm, dataAbertura: event.target.value })} /></label>
            </div>
            <div className="atm-form-actions"><button className="primary-button small" type="submit" disabled={operacaoContaBusy}><Plus size={15} />{editandoConta ? "ATUALIZAR CONTA" : "CADASTRAR CONTA"}</button>{editandoConta && <button className="ghost-button small" type="button" onClick={() => { setEditandoConta(false); setContaForm(emptyAccountForm); }}>CANCELAR EDIÇÃO</button>}</div>
          </form>

          <div className="atm-search">
            <div className="atm-section-label"><span>LOCALIZAR CONTA</span><small>FILTROS COMBINÁVEIS</small></div>
            <div className="account-search-grid">
              <label>Número<input value={filtrosContas.numeroConta} onChange={(event) => setFiltrosContas({ ...filtrosContas, numeroConta: event.target.value })} placeholder="Número" /></label>
              <label>Agência<input value={filtrosContas.agencia} onChange={(event) => setFiltrosContas({ ...filtrosContas, agencia: event.target.value })} placeholder="Agência" /></label>
              <label>Cliente<input value={filtrosContas.cliente} onChange={(event) => setFiltrosContas({ ...filtrosContas, cliente: event.target.value })} placeholder="Cliente" /></label>
              <label>Tipo<select value={filtrosContas.tipoConta} onChange={(event) => setFiltrosContas({ ...filtrosContas, tipoConta: event.target.value })}><option value="">TODOS</option><option value="CORRENTE">CORRENTE</option><option value="POUPANCA">POUPANÇA</option></select></label>
              <button className="secondary-button small search-submit" type="button" onClick={() => carregarContas(filtrosContas)} disabled={contasLoading}><Search size={15} />{contasLoading ? "CONSULTANDO..." : "PESQUISAR"}</button>
            </div>
            <label className="account-picker">Conta selecionada<select value={contaSelecionadaId} onChange={(event) => selecionarConta(event.target.value)}><option value="">SELECIONE UMA CONTA</option>{contas.map((conta) => <option key={conta.id} value={conta.id}>{conta.numeroConta} · {conta.cliente} · {conta.tipoConta}</option>)}</select></label>
            {contasErro && <div className="account-api-error" role="alert">{contasErro}</div>}
          </div>

          <div className="atm-operations">
            <div className="atm-section-label"><span>02 / EXECUTAR OPERAÇÃO</span><small>{contaSelecionada ? `CONTA ${contaSelecionada.numeroConta}` : "AGUARDANDO SELEÇÃO"}</small></div>
            <label className="operation-value">Valor da operação<input type="number" min="0.01" step="0.01" value={valorOperacao} onChange={(event) => setValorOperacao(event.target.value)} placeholder="0,00" disabled={!contaSelecionada || operacaoContaBusy} /></label>
            <label className="operation-description">Descrição<input maxLength="180" value={descricaoOperacao} onChange={(event) => setDescricaoOperacao(event.target.value)} placeholder="Opcional" disabled={!contaSelecionada || operacaoContaBusy} /></label>
            <div className="atm-action-grid">
              <button className="secondary-button atm-action" type="button" disabled={!contaSelecionada || operacaoContaBusy} onClick={consultarSaldoConta}><Wallet size={16} /> SALDO</button>
              <button className="secondary-button atm-action" type="button" disabled={!contaSelecionada || operacaoContaBusy} onClick={() => carregarExtrato()}><Receipt size={16} /> EXTRATO</button>
              <button className="primary-button atm-action deposit-action" type="button" disabled={!contaSelecionada || operacaoContaBusy} onClick={() => executarMovimentacaoConta("DEPOSITO")}><ArrowDownToLine size={16} /> DEPOSITAR</button>
              <button className="primary-button atm-action withdraw-action" type="button" disabled={!contaSelecionada || operacaoContaBusy} onClick={() => executarMovimentacaoConta("SAQUE")}><ArrowUpFromLine size={16} /> SACAR</button>
            </div>
          </div>
        </section>

        <aside className="atm-display-column">
          <section className="panel atm-balance-panel">
            <div className="atm-section-label"><span>03 / RESULTADO DA API</span><span className={`atm-state ${estadoConta.toLowerCase()}`}><i />{estadoConta}</span></div>
            <div className="atm-balance-screen"><span>SALDO ATUAL</span><strong>{contaSelecionada ? formatarMoeda(contaSelecionada.saldoAtual) : "—"}</strong><small>{contaSelecionada ? contaSelecionada.cliente : "Selecione uma conta para consultar"}</small></div>
            {contaSelecionada ? <dl className="account-facts"><div><dt>CONTA</dt><dd>{contaSelecionada.numeroConta}</dd></div><div><dt>AGÊNCIA</dt><dd>{contaSelecionada.agencia}</dd></div><div><dt>TIPO</dt><dd>{contaSelecionada.tipoConta === "POUPANCA" ? "POUPANÇA" : "CORRENTE"}</dd></div><div><dt>STATUS</dt><dd className={`account-status ${contaSelecionada.status.toLowerCase()}`}>{contaSelecionada.status}</dd></div></dl> : <div className="empty-state atm-empty">Nenhuma conta selecionada.</div>}
            {mensagemConta && <div className={`atm-feedback ${tipoMensagemConta}`} role="status">{mensagemConta}</div>}
            {contaSelecionada && <div className="account-summary-grid"><div><span>DEPOSITADO</span><strong>{formatarMoeda(contaSelecionada.totalDepositado)}</strong></div><div><span>SACADO</span><strong>{formatarMoeda(contaSelecionada.totalSacado)}</strong></div><div><span>MOVIMENTAÇÕES</span><strong>{contaSelecionada.quantidadeMovimentacoes}</strong></div><div><span>ÚLTIMA OPERAÇÃO</span><strong>{contaSelecionada.ultimaMovimentacao ? `${contaSelecionada.ultimaMovimentacao.operacao} · ${contaSelecionada.ultimaMovimentacao.hora}` : "SEM MOVIMENTAÇÃO"}</strong></div></div>}
            {contaSelecionada && <div className="account-maintenance-actions"><button className="ghost-button small" type="button" disabled={operacaoContaBusy} onClick={prepararEdicaoConta}><Pencil size={14} /> ALTERAR</button><button className="ghost-button small" type="button" disabled={operacaoContaBusy || contaSelecionada.status === "ENCERRADA"} onClick={() => alterarStatusConta(contaSelecionada.status === "BLOQUEADA" ? "ATIVA" : "BLOQUEADA")}>{contaSelecionada.status === "BLOQUEADA" ? "DESBLOQUEAR" : "BLOQUEAR"}</button><button className="ghost-button small danger-action" type="button" disabled={operacaoContaBusy || contaSelecionada.status === "ENCERRADA"} onClick={() => alterarStatusConta("ENCERRADA")}>ENCERRAR</button><button className="ghost-button small danger-action" type="button" disabled={operacaoContaBusy} onClick={excluirContaSelecionada}><Trash2 size={14} /> EXCLUIR</button></div>}
          </section>
        </aside>
      </div>

      <section className="panel statement-panel">
        <div className="section-header"><div><span className="section-kicker">04 / MOVIMENTAÇÕES PERSISTIDAS</span><h2>Extrato da conta</h2></div><div className="statement-filters"><label>Operação<select value={filtrosExtrato.tipo} onChange={(event) => setFiltrosExtrato({ ...filtrosExtrato, tipo: event.target.value })}><option value="">TODAS</option><option value="DEPOSITO">DEPÓSITO</option><option value="SAQUE">SAQUE</option></select></label><label>De<input type="date" value={filtrosExtrato.de} onChange={(event) => setFiltrosExtrato({ ...filtrosExtrato, de: event.target.value })} /></label><label>Até<input type="date" value={filtrosExtrato.ate} onChange={(event) => setFiltrosExtrato({ ...filtrosExtrato, ate: event.target.value })} /></label><button className="ghost-button small" type="button" disabled={!contaSelecionada || operacaoContaBusy} onClick={() => carregarExtrato()}><RefreshCw size={14} /> FILTRAR</button></div></div>
        {!contaSelecionada ? <div className="empty-state">Selecione uma conta para visualizar o extrato.</div> : extrato.length ? <div className="table-wrapper"><table className="statement-table"><thead><tr><th>DATA</th><th>HORA</th><th>OPERAÇÃO</th><th>DESCRIÇÃO</th><th>VALOR</th><th>SALDO APÓS</th></tr></thead><tbody>{extrato.map((item) => <tr key={item.id}><td>{item.data}</td><td>{item.hora}</td><td><span className={`statement-type ${item.operacao.toLowerCase()}`}>{item.operacao}</span></td><td>{item.descricao}</td><td className={item.operacao === "DEPOSITO" ? "money-in" : "money-out"}>{item.operacao === "SAQUE" ? "−" : "+"}{formatarMoeda(item.valor)}</td><td>{formatarMoeda(item.saldoAposOperacao)}</td></tr>)}</tbody></table></div> : <div className="empty-state">Nenhuma movimentação registrada para esta conta.</div>}
      </section>

      <section className="panel mainframe-compact">
        <div className={`cobol-status ${status.toLowerCase()}`}><Cpu size={25} /><span>{status}</span></div>
        <div className="mainframe-copy"><span className="section-kicker">05 / MAINFRAME PROCESSING</span><h2>COBOL Batch · PROFPROC</h2><div className="mainframe-meta"><span>ENGINE <strong>GNU COBOL</strong></span><span>INPUT <strong>cobol/data/professores.csv</strong></span><span>OUTPUT <strong>cobol/output/relatorio.txt</strong></span></div>
          {output && <pre className="job-output"><strong>OUTPUT</strong>{output}</pre>}
        </div>
        <button className="primary-button small" onClick={executarCobol} disabled={status === "RUNNING"}><Play size={15} fill="currentColor" />{status === "RUNNING" ? "PROCESSANDO..." : "EXECUTAR PROFPROC"}</button>
      </section>
    </section>
  );

  const renderAnalytics = () => (
    <section className="content-stack"><div className="section-heading"><span className="section-kicker">BUSINESS INTELLIGENCE</span><h1>Analytics</h1><p>Indicadores globais baseados nos dados atuais.</p></div><section className="kpi-grid analytics-kpi">{metricCards.slice(0, 3).map((item) => <article className="kpi-card" key={item.label}><div className={`kpi-icon ${item.color}`}><item.icon size={20} /></div><div className="kpi-body"><span>{item.label}</span><strong>{item.value}</strong></div><small>{item.detail}</small></article>)}</section><div className="panel analytics-full"><div className="section-header"><div><span className="section-kicker">DISTRIBUIÇÃO</span><h2>Professores por especialidade</h2></div><BarChart3 size={18} /></div><div className="chart-surface tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={especialidades}><CartesianGrid strokeDasharray="3 3" stroke="rgba(143,173,255,0.12)" vertical={false} /><XAxis dataKey="nome" tick={{ fill: "#8ba0c2", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: "#8ba0c2", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#0b1b2b", border: "1px solid #2f4d70", borderRadius: 10 }} /><Bar dataKey="total" fill="#8fe3c4" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div></section>
  );

  const renderLogs = () => (
    <section className="content-stack"><div className="section-heading"><span className="section-kicker">SYSTEM MONITORING</span><h1>Logs</h1><p>Eventos recentes da operação.</p></div><div className="panel log-panel"><div className="log-header"><span>Timestamp</span><span>Level</span><span>Componente</span><span>Message</span></div>{logs.length ? logs.map((log) => <div className="log-row" key={log.id}><span>{log.time}</span><span className={`log-level ${log.level.toLowerCase()}`}>{log.level}</span><span>CONTROL CENTER</span><span>{log.message}</span></div>) : <div className="empty-state">Nenhum evento registrado.</div>}</div></section>
  );

  const renderConfig = () => (
    <section className="content-stack"><div className="section-heading"><span className="section-kicker">SYSTEM SETTINGS</span><h1>Configurações</h1><p>Status dos principais componentes do ambiente.</p></div><div className="settings-grid"><div className="panel setting-card"><Cpu size={22} /><span>Backend</span><strong>Spring Boot · 8080</strong><small className={apiError ? "danger" : "success"}>{apiError ? "OFFLINE" : "ONLINE"}</small></div><div className="panel setting-card"><HardDrive size={22} /><span>Frontend</span><strong>React + Vite</strong><small className="success">ONLINE</small></div><div className="panel setting-card"><Database size={22} /><span>Database</span><strong>H2 · JPA</strong><small className={apiError ? "danger" : "success"}>{apiError ? "SYNC ERROR" : "SYNC OK"}</small></div><div className="panel setting-card"><Terminal size={22} /><span>COBOL Engine</span><strong>GNU COBOL · PROFPROC</strong><small className={status === "ERROR" ? "danger" : status === "RUNNING" ? "warning" : "success"}>{status}</small></div></div></section>
  );

  const renderSection = () => {
    if (section === "professores") return renderProfessores();
    if (section === "jobs") return renderJobs();
    if (section === "cobol") return renderCobol();
    if (section === "analytics") return renderAnalytics();
    if (section === "logs") return renderLogs();
    if (section === "config") return renderConfig();
    return renderDashboard();
  };

  const renderProfessores = () => (
    <section className="content-stack">
      <div className="section-heading"><span className="section-kicker">DATABASE</span><h1>Professores</h1><p>Consulta, edição e manutenção dos registros acadêmicos.</p></div>
      <div className="panel table-panel">
        <div className="section-header"><div><span className="section-kicker">REGISTROS</span><h2>Gestão de Professores</h2></div>
          <div className="table-tools">
            <input type="search" value={professorSearch} onChange={(event) => setProfessorSearch(event.target.value)} placeholder="Buscar nome, e-mail ou especialidade" aria-label="Buscar professor" />
            <select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} aria-label="Filtrar especialidade"><option value="TODAS">TODAS</option>{[...new Set(professores.map((item) => item.especialidade).filter(Boolean))].map((item) => <option key={item} value={item}>{item}</option>)}</select>
            <button className="primary-button small" onClick={novoProfessor}><Plus size={16} /> NOVO</button>
          </div>
        </div>
        <div className="table-wrapper"><table><thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Especialidade</th><th>Carga</th><th>Ações</th></tr></thead><tbody>{filteredProfessores.map((professor) => <tr key={professor.id}><td>#{String(professor.id).padStart(3, "0")}</td><td>{professor.nome}</td><td>{professor.email}</td><td><span className="tag">{professor.especialidade || "Sem especialidade"}</span></td><td>{professor.cargaHoraria}h</td><td><div className="row-actions"><button className="mini-button edit" onClick={() => editarProfessor(professor)} aria-label={`Editar ${professor.nome}`}><Pencil size={14} /></button><button className="mini-button delete" onClick={() => excluirProfessor(professor.id)} aria-label={`Excluir ${professor.nome}`}><Trash2 size={14} /></button></div></td></tr>)}</tbody></table>{!filteredProfessores.length && !loading && <div className="empty-state">Nenhum professor corresponde aos filtros de busca.</div>}</div>
      </div>
      <div className="cobol-signature" aria-label="Assinatura COBOL Mainframe"><span className="signature-trace" /><strong>COBOL</strong><span className="signature-caption">MAINFRAME · BATCH SYSTEMS</span><span className="signature-trace" /></div>
    </section>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
        <div className="brand"><div className="brand-core"><Cpu size={23} /></div>{menuOpen && <div className="brand-copy"><strong>MCP</strong><span>CONTROL CENTER</span></div>}</div>
        <nav>{menuItems.map(([id, label, Icon]) => <button key={id} className={`menu-item ${section === id ? "active" : ""}`} onClick={() => navegar(id)}><Icon size={18} />{menuOpen && <span>{label}</span>}</button>)}</nav>
        <div className="sidebar-footer"><ShieldCheck size={16} />{menuOpen && <span>SECURE SYSTEM</span>}</div>
      </aside>
      <main className="main-content">
        <header className="topbar"><button className="icon-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Alternar menu"><Menu size={19} /></button><div className="system-title"><span>INFRASTRUCTURE CONTROL</span><strong>MCP CONTROL CENTER</strong></div><div className="system-status"><span className={`status-dot ${apiError ? "offline" : "online"}`} /> {loading ? "VERIFICANDO API" : apiError ? "API COM ERRO" : "SYSTEM ONLINE"}</div></header>
        <div className="page-content">{section !== "dashboard" && <div className="breadcrumb"><span>MCP CONTROL CENTER</span><ChevronRight size={13} /><strong>{menuItems.find(([id]) => id === section)?.[1]}</strong></div>}{loading && <div className="loading-banner"><RefreshCw size={16} className="spin" /> Carregando dados...</div>}{apiError && <div className="api-banner"><AlertTriangle size={16} /> {apiError}</div>}{renderSection()}</div>
        <div className="control-deck"><div className="deck-header"><span>CONTROL DECK</span><strong>F1-F12</strong></div><div className="keyboard">{["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"].map((key) => <button className="key" key={key} onClick={() => addLog(`Tecla ${key} pressionada`, "INFO")}>{key}</button>)}</div><div className="deck-status"><span /> SYSTEM READY</div></div>
      </main>
      {modal && <div className="modal-backdrop" onClick={() => !saving && setModal(false)}><div className="modal-card" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><span className="section-kicker">CRUD</span><h2>{editingId ? "Editar Professor" : "Novo Professor"}</h2></div><button className="icon-button" onClick={() => setModal(false)} disabled={saving} aria-label="Fechar formulário"><X size={20} /></button></div><form className="professor-form" onSubmit={salvarProfessor}><label>Nome<input required value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} placeholder="Informe o nome completo" /></label><label>E-mail<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="nome@empresa.com" /></label><label>Especialidade<input required value={form.especialidade} onChange={(event) => setForm({ ...form, especialidade: event.target.value })} placeholder="Ex.: Banco de Dados" /></label><label>Carga horária<input required min="1" type="number" value={form.cargaHoraria} onChange={(event) => setForm({ ...form, cargaHoraria: event.target.value })} /></label><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setModal(false)} disabled={saving}>CANCELAR</button><button type="submit" className="primary-button" disabled={saving}><Save size={17} /> {saving ? "SALVANDO..." : "SALVAR PROFESSOR"}</button></div></form></div></div>}
    </div>
  );
}

export default AppV2;
