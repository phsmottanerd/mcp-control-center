import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Gauge,
  HardDrive,
  LayoutDashboard,
  Menu,
  Pencil,
  Play,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Terminal,
  Trash2,
  Users,
  X,
  RotateCw,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";

const menuItems = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["professores", "Professores", Users],
  ["jobs", "Jobs", Terminal],
  ["cobol", "COBOL Batch", Database],
  ["analytics", "Analytics", BarChart3],
  ["logs", "Logs", FileText],
  ["config", "Configurações", Settings],
];

const emptyForm = {
  nome: "",
  email: "",
  especialidade: "",
  cargaHoraria: "40",
};

function App() {
  const [professores, setProfessores] = useState([]);
  const [section, setSection] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(true);
  const [status, setStatus] = useState("READY");
  const [output, setOutput] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState(["SYSTEM ONLINE"]);

  const addLog = (msg) => {
    setLogs((old) => [
      `${new Date().toLocaleTimeString("pt-BR")} • ${msg}`,
      ...old,
    ].slice(0, 20));
  };

  const carregar = async () => {
    try {
      const response = await fetch("/professores");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProfessores(data);
      addLog(`DATABASE • ${data.length} REGISTRO(S)`);
    } catch {
      setProfessores([]);
      addLog("ERROR • API /professores");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const totalCarga = useMemo(
    () =>
      professores.reduce(
        (total, p) => total + Number(p.cargaHoraria || 0),
        0
      ),
    [professores]
  );

  const especialidades = useMemo(() => {
    const map = {};
    professores.forEach((p) => {
      const nome = p.especialidade || "Sem especialidade";
      map[nome] = (map[nome] || 0) + 1;
    });
    return Object.entries(map).map(([nome, total]) => ({ nome, total }));
  }, [professores]);

  const navegar = (id) => {
    setSection(id);
    addLog(`NAVIGATION • ${id.toUpperCase()}`);
  };

  const novoProfessor = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const editarProfessor = (p) => {
    setEditingId(p.id);
    setForm({
      nome: p.nome || "",
      email: p.email || "",
      especialidade: p.especialidade || "",
      cargaHoraria: String(p.cargaHoraria ?? ""),
    });
    setModal(true);
  };

  const salvarProfessor = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `/professores/${editingId}`
        : "/professores";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          especialidade: form.especialidade.trim(),
          cargaHoraria: Number(form.cargaHoraria),
        }),
      });

      if (!response.ok) throw new Error();

      await carregar();
      addLog(
        editingId
          ? `CRUD • #${editingId} ATUALIZADO`
          : "CRUD • PROFESSOR CRIADO"
      );

      setForm(emptyForm);
      setEditingId(null);
      setModal(false);
    } catch {
      addLog("ERROR • FALHA NO SAVE");
      window.alert("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  const excluirProfessor = async (id) => {
    if (!window.confirm(`Excluir professor #${id}?`)) return;

    try {
      const response = await fetch(`/professores/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      await carregar();
      addLog(`CRUD • #${id} EXCLUÍDO`);
    } catch {
      addLog(`ERROR • FALHA AO EXCLUIR #${id}`);
      window.alert("Não foi possível excluir.");
    }
  };

  const executarCobol = async () => {
    setStatus("RUNNING");
    setOutput("");
    addLog("COBOL • PROFPROC STARTED");

    try {
      const response = await fetch("/jobs/cobol/professores", {
        method: "POST",
      });

      const text = await response.text();

      if (!response.ok) throw new Error();

      setOutput(text);
      setStatus("COMPLETED");
      addLog("COBOL • PROFPROC COMPLETED");
    } catch {
      setStatus("ERROR");
      setOutput("Falha na execução do job.");
      addLog("ERROR • COBOL PROFPROC FAILED");
    }
  };

  const renderTabela = (compact = false) => (
    <section className="panel table-panel">
      <div className="panel-header">
        <div>
          <span className="panel-label">DATABASE</span>
          <h3>{compact ? "Professores registrados" : "Gestão de Professores"}</h3>
        </div>

        <div className="panel-actions">
          <button className="icon-button" onClick={carregar} title="Atualizar">
            <RotateCw size={18} />
          </button>

          <button className="run-button compact-button" onClick={novoProfessor}>
            <Plus size={17} />
            NOVO PROFESSOR
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME</th>
              <th>E-MAIL</th>
              <th>ESPECIALIDADE</th>
              <th>CARGA</th>
              <th>AÇÕES</th>
            </tr>
          </thead>

          <tbody>
            {professores.map((p) => (
              <tr key={p.id}>
                <td>#{String(p.id).padStart(3, "0")}</td>
                <td>{p.nome}</td>
                <td>{p.email}</td>
                <td>{p.especialidade}</td>
                <td>{p.cargaHoraria}h</td>

                <td>
                  <div className="row-actions">
                    <button
                      className="table-action edit"
                      onClick={() => editarProfessor(p)}
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      className="table-action delete"
                      onClick={() => excluirProfessor(p.id)}
                      title="Excluir"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!professores.length && (
              <tr>
                <td colSpan="6" className="empty">
                  Nenhum registro carregado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderDashboard = () => (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">
            MAINFRAME • LINUX • AUTOMATION
          </span>

          <h2>Control Center</h2>

          <p>
            Monitoramento operacional, processamento COBOL e gestão de dados
            em um único centro de controle.
          </p>

          <div className="hero-actions">
            <button
              className="run-button hero-button"
              onClick={() => navegar("professores")}
            >
              <Users size={18} />
              GERENCIAR PROFESSORES
            </button>

            <button className="secondary-button" onClick={executarCobol}>
              <Play size={17} fill="currentColor" />
              EXECUTAR BATCH
            </button>
          </div>
        </div>

        <div className="hero-core">
          <div className="core-ring ring-one"></div>
          <div className="core-ring ring-two"></div>

          <div className="core-center">
            <Cpu size={34} />
            <span>CORE</span>
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <Users size={21} />
          </div>
          <div>
            <span>TOTAL PROFESSORES</span>
            <strong>{professores.length}</strong>
          </div>
          <small>DATABASE</small>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Gauge size={21} />
          </div>
          <div>
            <span>CARGA HORÁRIA</span>
            <strong>{totalCarga}h</strong>
          </div>
          <small>REGISTERED</small>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Activity size={21} />
          </div>
          <div>
            <span>COBOL BATCH</span>
            <strong>{status}</strong>
          </div>
          <small>JOB STATUS</small>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <HardDrive size={21} />
          </div>
          <div>
            <span>API STATUS</span>
            <strong>ONLINE</strong>
          </div>
          <small>SPRING BOOT</small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">ANALYTICS</span>
              <h3>Especialidades</h3>
            </div>
            <BarChart3 size={21} />
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={especialidades}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="nome"
                  tick={{ fill: "#999", fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#999", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#181818",
                    border: "1px solid #444",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="#d4af37"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel cobol-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">BATCH ENGINE</span>
              <h3>COBOL Processor</h3>
            </div>
            <Terminal size={21} />
          </div>

          <div className="processor">
            <div className={`processor-core ${status.toLowerCase()}`}>
              {status === "COMPLETED" ? (
                <CheckCircle2 size={39} />
              ) : (
                <Cpu size={39} />
              )}
              <span>{status}</span>
            </div>

            <div className="processor-info">
              <div>
                <span>PROGRAM</span>
                <strong>PROFPROC</strong>
              </div>

              <div>
                <span>ENGINE</span>
                <strong>GNU COBOL</strong>
              </div>

              <div>
                <span>INPUT</span>
                <strong>PROFESSORES.CSV</strong>
              </div>
            </div>
          </div>

          <button
            className="run-button"
            onClick={executarCobol}
            disabled={status === "RUNNING"}
          >
            <Play size={18} fill="currentColor" />
            {status === "RUNNING"
              ? "PROCESSANDO..."
              : "EXECUTAR COBOL JOB"}
          </button>

          {output && <pre className="job-output">{output}</pre>}
        </div>
      </section>

      {renderTabela(true)}
    </>
  );

  const renderJobs = () => (
    <section className="content-stack">
      <div className="section-heading">
        <span className="eyebrow">OPERATIONS</span>
        <h2>Jobs</h2>
        <p>Execução dos processos disponíveis no sistema.</p>
      </div>

      <div className="jobs-grid">
        <div className="panel job-card">
          <span className="panel-label">COBOL</span>
          <h3>PROFPROC</h3>
          <p>Processamento batch dos registros de professores.</p>

          <button className="run-button" onClick={executarCobol}>
            <Play size={17} fill="currentColor" />
            EXECUTAR JOB
          </button>
        </div>

        <div className="panel job-card crud-visual-card">
          <div className="crud-card-top">
            <div>
              <span className="panel-label">SPRING BOOT</span>
              <h3>PROFESSOR CRUD</h3>
            </div>

            <div className="api-status-badge">
              <span></span>
              API ONLINE
            </div>
          </div>

          <p>Cadastro integrado diretamente à API REST.</p>

          <div className="crud-metrics">
            <div className="crud-metric">
              <span>REGISTROS</span>
              <strong>{professores.length}</strong>
            </div>

            <div className="crud-metric">
              <span>CARGA TOTAL</span>
              <strong>{totalCarga}h</strong>
            </div>

            <div className="crud-metric">
              <span>ESPECIALIDADES</span>
              <strong>{especialidades.length}</strong>
            </div>
          </div>

          <div className="crud-chart">
            <div className="crud-chart-header">
              <span>DISTRIBUIÇÃO</span>
              <small>REAL TIME DATA</small>
            </div>

            {especialidades.length > 0 ? (
              especialidades.slice(0, 5).map((item) => {
                const max = Math.max(
                  ...especialidades.map((x) => x.total),
                  1
                );

                return (
                  <div className="crud-bar-row" key={item.nome}>
                    <div className="crud-bar-label">
                      <span>{item.nome}</span>
                      <strong>{item.total}</strong>
                    </div>

                    <div className="crud-bar-track">
                      <div
                        className="crud-bar-fill"
                        style={{
                          width: `${(item.total / max) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="crud-empty-chart">
                Aguardando dados da API...
              </div>
            )}
          </div>

          <div className="crud-card-footer">
            <div className="api-flow">
              <span className="flow-node"></span>
              <span className="flow-line"></span>
              <span className="flow-node"></span>
              <span className="flow-line"></span>
              <span className="flow-node active"></span>
              <small>CLIENT → REST → DATABASE</small>
            </div>

            <button
              className="secondary-button"
              onClick={() => navegar("professores")}
            >
              <Users size={17} />
              ABRIR CRUD
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderCobol = () => (
    <section className="content-stack">
      <div className="section-heading">
        <span className="eyebrow">MAINFRAME PROCESSING</span>
        <h2>COBOL Batch</h2>
        <p>Execução real do programa PROFPROC.</p>
      </div>

      <div className="panel cobol-detail">
        <div className={`processor-core large ${status.toLowerCase()}`}>
          {status === "COMPLETED" ? (
            <CheckCircle2 size={52} />
          ) : (
            <Cpu size={52} />
          )}
          <span>{status}</span>
        </div>

        <div className="detail-grid">
          <div>
            <span>PROGRAM</span>
            <strong>PROFPROC</strong>
          </div>
          <div>
            <span>INPUT</span>
            <strong>professores.csv</strong>
          </div>
          <div>
            <span>OUTPUT</span>
            <strong>relatorio.txt</strong>
          </div>
          <div>
            <span>ENGINE</span>
            <strong>GNU COBOL</strong>
          </div>
        </div>

        <button
          className="run-button"
          onClick={executarCobol}
          disabled={status === "RUNNING"}
        >
          <Play size={19} fill="currentColor" />
          EXECUTAR PROFPROC
        </button>

        {output && <pre className="job-output">{output}</pre>}
      </div>
    </section>
  );

  const renderAnalytics = () => (
    <section className="content-stack">
      <div className="section-heading">
        <span className="eyebrow">BUSINESS INTELLIGENCE</span>
        <h2>Analytics</h2>
        <p>Indicadores baseados nos dados reais do sistema.</p>
      </div>

      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><Users size={21} /></div>
          <div><span>REGISTROS</span><strong>{professores.length}</strong></div>
          <small>ATIVOS</small>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><Gauge size={21} /></div>
          <div><span>CARGA TOTAL</span><strong>{totalCarga}h</strong></div>
          <small>HORAS</small>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><BarChart3 size={21} /></div>
          <div><span>ESPECIALIDADES</span><strong>{especialidades.length}</strong></div>
          <small>CATEGORIAS</small>
        </div>
      </section>

      <div className="panel chart-panel analytics-full">
        <div className="panel-header">
          <div>
            <span className="panel-label">DISTRIBUIÇÃO</span>
            <h3>Professores por especialidade</h3>
          </div>
          <BarChart3 size={21} />
        </div>

        <div className="chart-area tall-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={especialidades}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="nome" tick={{ fill: "#999", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#999", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#181818",
                  border: "1px solid #444",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="total" fill="#d4af37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );

  const renderLogs = () => (
    <section className="content-stack">
      <div className="section-heading">
        <span className="eyebrow">SYSTEM MONITORING</span>
        <h2>Logs</h2>
        <p>Eventos recentes da operação.</p>
      </div>

      <div className="panel logs-panel">
        {logs.map((log, index) => (
          <div className="log-line" key={index}>
            <span className="log-led"></span>
            <code>{log}</code>
          </div>
        ))}
      </div>
    </section>
  );

  const renderConfig = () => (
    <section className="content-stack">
      <div className="section-heading">
        <span className="eyebrow">SYSTEM SETTINGS</span>
        <h2>Configurações</h2>
        <p>Status dos componentes do ambiente.</p>
      </div>

      <div className="settings-grid">
        <div className="panel setting-card">
          <Cpu size={22} />
          <span>BACKEND</span>
          <strong>Spring Boot • 8080</strong>
          <small>ONLINE</small>
        </div>

        <div className="panel setting-card">
          <HardDrive size={22} />
          <span>FRONTEND</span>
          <strong>React + Vite • 5173</strong>
          <small>ONLINE</small>
        </div>

        <div className="panel setting-card">
          <Database size={22} />
          <span>DATABASE</span>
          <strong>H2 In-Memory</strong>
          <small>JPA / HIBERNATE</small>
        </div>

        <div className="panel setting-card">
          <Terminal size={22} />
          <span>BATCH ENGINE</span>
          <strong>GNU COBOL / PROFPROC</strong>
          <small>READY</small>
        </div>
      </div>
    </section>
  );

  const renderSection = () => {
    if (section === "professores") return renderTabela(false);
    if (section === "jobs") return renderJobs();
    if (section === "cobol") return renderCobol();
    if (section === "analytics") return renderAnalytics();
    if (section === "logs") return renderLogs();
    if (section === "config") return renderConfig();
    return renderDashboard();
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : "closed"}`}>
        <div className="brand">
          <div className="brand-core">
            <Cpu size={25} />
          </div>

          {menuOpen && (
            <div>
              <h1>MCP</h1>
              <span>CONTROL CENTER</span>
            </div>
          )}
        </div>

        <nav>
          <div className="menu-section">MAIN SYSTEM</div>

          {menuItems.slice(0, 4).map(([id, label, Icon]) => (
            <button
              key={id}
              className={`menu-item ${section === id ? "active" : ""}`}
              onClick={() => navegar(id)}
            >
              <Icon size={19} />
              {menuOpen && <span>{label}</span>}
            </button>
          ))}

          <div className="menu-section">MONITORING</div>

          {menuItems.slice(4).map(([id, label, Icon]) => (
            <button
              key={id}
              className={`menu-item ${section === id ? "active" : ""}`}
              onClick={() => navegar(id)}
            >
              <Icon size={19} />
              {menuOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <ShieldCheck size={18} />
          {menuOpen && <span>SECURE SYSTEM</span>}
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={21} />
          </button>

          <div className="system-title">
            <span>INFRASTRUCTURE CONTROL</span>
            <strong>MCP CONTROL CENTER</strong>
          </div>

          <div className="system-status">
            <span className="status-dot"></span>
            SYSTEM ONLINE
          </div>
        </header>

        <div className="page-content">
          {section !== "dashboard" && (
            <div className="breadcrumb">
              <span>MCP CONTROL CENTER</span>
              <strong>/ {menuItems.find((x) => x[0] === section)?.[1]}</strong>
            </div>
          )}

          {renderSection()}
        </div>

        <div className="control-deck">
          <div className="deck-label">MCP CONTROL DECK</div>

          <div className="keyboard">
            {["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"].map((key) => (
              <button
                className="key"
                key={key}
                onClick={() => addLog(`CONTROL DECK • ${key} PRESSED`)}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="deck-status">
            <span></span>
            SYSTEM READY
          </div>
        </div>
      </main>

      {modal && (
        <div className="modal-backdrop" onClick={() => !saving && setModal(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="panel-label">CRUD</span>
                <h3>{editingId ? "Editar Professor" : "Novo Professor"}</h3>
              </div>

              <button
                className="icon-button"
                onClick={() => setModal(false)}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            <form className="professor-form" onSubmit={salvarProfessor}>
              <label>
                Nome
                <input
                  required
                  value={form.nome}
                  onChange={(e) =>
                    setForm({ ...form, nome: e.target.value })
                  }
                />
              </label>

              <label>
                E-mail
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </label>

              <label>
                Especialidade
                <input
                  required
                  value={form.especialidade}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      especialidade: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Carga horária
                <input
                  required
                  min="1"
                  type="number"
                  value={form.cargaHoraria}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cargaHoraria: e.target.value,
                    })
                  }
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModal(false)}
                  disabled={saving}
                >
                  CANCELAR
                </button>

                <button
                  type="submit"
                  className="run-button"
                  disabled={saving}
                >
                  <Save size={17} />
                  {saving ? "SALVANDO..." : "SALVAR PROFESSOR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
