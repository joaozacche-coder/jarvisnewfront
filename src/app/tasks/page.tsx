"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, Flag, Calendar, MoreHorizontal, CheckCircle2,
  AlertCircle, Clock, Tag, X, Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = "high" | "medium" | "low";
type Tab = "todas" | "hoje" | "semana" | "concluidas";

interface DBTask {
  id: string;
  title: string;
  status: string;
  priority: number;
  due_date: string | null;
  tags: string[];
  content: Record<string, unknown>;
  created_at: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; icon: typeof Flag }> = {
  high:   { label: "Alta",  color: "#F87171", bg: "rgba(248,113,113,0.12)", icon: AlertCircle },
  medium: { label: "Média", color: "#FBBF24", bg: "rgba(251,191,36,0.12)",  icon: Flag       },
  low:    { label: "Baixa", color: "#8888A0", bg: "rgba(136,136,160,0.1)",  icon: Clock      },
};

const TABS: { id: Tab; label: string }[] = [
  { id: "todas",     label: "Todas"        },
  { id: "hoje",      label: "Hoje"         },
  { id: "semana",    label: "Esta semana"  },
  { id: "concluidas",label: "Concluídas"   },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPriority(task: DBTask): Priority {
  const cp = task.content?.priority as string | undefined;
  if (cp === "alta")                      return "high";
  if (cp === "média" || cp === "media")   return "medium";
  if (cp === "baixa")                     return "low";
  if (task.priority >= 2)                 return "high";
  if (task.priority === 1)               return "medium";
  return "low";
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

function formatDue(due_date: string | null): string {
  if (!due_date) return "—";
  const d = new Date(due_date);
  if (isNaN(d.getTime())) return "—";
  const now = new Date();
  if (isSameDay(d, now)) return "Hoje";
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(d, tomorrow)) return "Amanhã";
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" }).replace(".", "");
}

function isOverdue(due_date: string | null, status: string): boolean {
  if (!due_date || status === "done") return false;
  const d = new Date(due_date);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

function isThisWeek(due_date: string | null): boolean {
  if (!due_date) return false;
  const d = new Date(due_date);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return d >= now && d <= weekEnd;
}

function getTag(task: DBTask): string {
  const system = new Set(["contexto-vivo"]);
  return task.tags?.find(t => !system.has(t)) ?? "";
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks,       setTasks]       = useState<DBTask[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState<Tab>("todas");
  const [showModal,   setShowModal]   = useState(false);
  const [newTitle,    setNewTitle]    = useState("");
  const [newPriority, setNewPriority] = useState(1);
  const [newDueDate,  setNewDueDate]  = useState("");
  const [newTag,      setNewTag]      = useState("");
  const [creating,    setCreating]    = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data.tasks ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const toggle = async (task: DBTask) => {
    const next = task.status === "done" ? "active" : "done";
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t));
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
  };

  const createTask = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res  = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:    newTitle.trim(),
          priority: newPriority,
          due_date: newDueDate || null,
          tags:     newTag.trim() ? [newTag.trim()] : [],
        }),
      });
      const created = await res.json();
      if (created.id) setTasks(prev => [created, ...prev]);
      setShowModal(false);
      setNewTitle("");
      setNewPriority(1);
      setNewDueDate("");
      setNewTag("");
    } finally {
      setCreating(false);
    }
  };

  const filtered = tasks.filter(t => {
    if (activeTab === "concluidas") return t.status === "done";
    if (activeTab === "hoje")       return !!t.due_date && isSameDay(new Date(t.due_date), new Date()) && t.status !== "done";
    if (activeTab === "semana")     return isThisWeek(t.due_date) && t.status !== "done";
    return true;
  });

  const stats = [
    { label: "Total",      value: tasks.length,                                            color: "var(--text-primary)" },
    { label: "Pendentes",  value: tasks.filter(t => t.status === "active").length,          color: "#7C6AF7"             },
    { label: "Concluídas", value: tasks.filter(t => t.status === "done").length,            color: "#34D399"             },
    { label: "Atrasadas",  value: tasks.filter(t => isOverdue(t.due_date, t.status)).length, color: "#F87171"            },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-primary)" }}>

      {/* Header */}
      <header style={{ padding: "0 32px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Tarefas</h1>
          <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "1px" }}>
            {loading ? "carregando..." : `${tasks.filter(t => t.status !== "done").length} pendentes`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} />
          Nova Tarefa
        </button>
      </header>

      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {stats.map(({ label, value, color }) => (
            <div key={label} className="jarvis-card" style={{ padding: "18px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: "26px", fontWeight: 700, color, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {loading ? "—" : value}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>{label}</div>
              <div style={{ position: "absolute", right: "-12px", bottom: "-12px", width: "64px", height: "64px", borderRadius: "50%", background: color === "var(--text-primary)" ? "rgba(255,255,255,0.03)" : `${color}08` }} />
            </div>
          ))}
        </div>

        {/* List */}
        <div className="jarvis-card" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

          {/* Tabs */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div className="tab-group">
              {TABS.map(({ id, label }) => (
                <button key={id} className={`tab-item${activeTab === id ? " active" : ""}`} onClick={() => setActiveTab(id)}>{label}</button>
              ))}
            </div>
            <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: "12px" }}>
              <Tag size={12} />
              Filtrar
            </button>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 100px 110px 80px 32px", gap: "12px", padding: "10px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            {["", "Título", "Prioridade", "Prazo", "Status", ""].map((h, i) => (
              <span key={i} style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "180px", gap: "8px" }}>
                <Loader2 size={18} color="var(--text-secondary)" style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Carregando tarefas...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", gap: "8px" }}>
                <CheckCircle2 size={28} color="var(--border-hover)" />
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Nenhuma tarefa aqui</p>
              </div>
            ) : (
              filtered.map(task => {
                const done    = task.status === "done";
                const p       = getPriority(task);
                const P       = PRIORITY_CONFIG[p];
                const overdue = isOverdue(task.due_date, task.status);
                const tag     = getTag(task);
                return (
                  <div key={task.id} className="table-row" style={{ gridTemplateColumns: "24px 1fr 100px 110px 80px 32px", gap: "12px", opacity: done ? 0.5 : 1 }}>
                    <button className={`jarvis-checkbox${done ? " checked" : ""}`} onClick={() => toggle(task)}>
                      {done && <CheckCircle2 size={10} color="white" strokeWidth={2.5} />}
                    </button>

                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: "13.5px", color: done ? "var(--text-secondary)" : "var(--text-primary)", textDecoration: done ? "line-through" : "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {task.title}
                      </span>
                      {tag && (
                        <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px", display: "block" }}>{tag}</span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="badge" style={{ background: P.bg, color: P.color, border: `1px solid ${P.color}28`, fontSize: "11px", padding: "2px 8px" }}>{P.label}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Calendar size={11} color={overdue ? "#F87171" : "var(--text-secondary)"} />
                      <span style={{ fontSize: "12px", color: overdue ? "#F87171" : "var(--text-secondary)" }}>{formatDue(task.due_date)}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: 500, color: done ? "#34D399" : overdue ? "#F87171" : "var(--text-secondary)" }}>
                        {done ? "Concluída" : overdue ? "Atrasada" : "A fazer"}
                      </span>
                    </div>

                    <button style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Nova Tarefa modal */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="jarvis-card" style={{ width: "420px", padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>Nova Tarefa</h2>
              <button onClick={() => setShowModal(false)} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                className="jarvis-input"
                placeholder="Nome da tarefa"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && createTask()}
                autoFocus
                style={{ padding: "10px 14px", fontSize: "14px", width: "100%" }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Prioridade</label>
                  <select
                    className="jarvis-input"
                    value={newPriority}
                    onChange={e => setNewPriority(Number(e.target.value))}
                    style={{ padding: "8px 12px", fontSize: "13px", width: "100%", cursor: "pointer" }}
                  >
                    <option value={2}>Alta</option>
                    <option value={1}>Média</option>
                    <option value={0}>Baixa</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Prazo</label>
                  <input
                    type="date"
                    className="jarvis-input"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "13px", width: "100%", colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Cliente / Tag</label>
                <input
                  className="jarvis-input"
                  placeholder="ex: Gracie Barra, SoHo..."
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  style={{ padding: "10px 14px", fontSize: "13px", width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setShowModal(false)} style={{ fontSize: "13px" }}>Cancelar</button>
              <button
                className="btn-primary"
                onClick={createTask}
                disabled={!newTitle.trim() || creating}
                style={{ opacity: !newTitle.trim() || creating ? 0.6 : 1, display: "flex", alignItems: "center", gap: "6px" }}
              >
                {creating
                  ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                  : <Plus size={13} />
                }
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        select.jarvis-input option { background: var(--bg-tertiary); color: var(--text-primary); }
      `}</style>
    </div>
  );
}
