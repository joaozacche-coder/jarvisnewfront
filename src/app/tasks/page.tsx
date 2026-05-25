"use client";

import { useState } from "react";
import {
  Plus,
  Flag,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
} from "lucide-react";

type Priority = "high" | "medium" | "low";
type Status = "todo" | "in_progress" | "done";
type Tab = "todas" | "hoje" | "semana" | "concluidas";

interface Task {
  id: number;
  title: string;
  priority: Priority;
  status: Status;
  due: string;
  tag: string;
  done: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Finalizar proposta comercial para Acme Corp", priority: "high", status: "in_progress", due: "Hoje", tag: "CRM", done: false },
  { id: 2, title: "Revisar relatório financeiro de maio", priority: "high", status: "todo", due: "Hoje", tag: "Finanças", done: false },
  { id: 3, title: "Atualizar pipeline de vendas no CRM", priority: "medium", status: "todo", due: "Amanhã", tag: "CRM", done: false },
  { id: 4, title: "Preparar apresentação do sprint review", priority: "medium", status: "in_progress", due: "26 Mai", tag: "Equipe", done: false },
  { id: 5, title: "Responder emails pendentes da semana", priority: "low", status: "todo", due: "Esta semana", tag: "Admin", done: false },
  { id: 6, title: "Configurar integração com Slack", priority: "low", status: "todo", due: "28 Mai", tag: "Dev", done: false },
  { id: 7, title: "Onboarding cliente TechFlow", priority: "high", status: "done", due: "24 Mai", tag: "CRM", done: true },
  { id: 8, title: "Relatório Q1 enviado", priority: "medium", status: "done", due: "22 Mai", tag: "Finanças", done: true },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; icon: typeof Flag }> = {
  high:   { label: "Alta",   color: "#F87171", bg: "rgba(248,113,113,0.12)", icon: AlertCircle },
  medium: { label: "Média",  color: "#FBBF24", bg: "rgba(251,191,36,0.12)",  icon: Flag },
  low:    { label: "Baixa",  color: "#8888A0", bg: "rgba(136,136,160,0.1)",  icon: Clock },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  todo:        { label: "A fazer",      color: "#8888A0" },
  in_progress: { label: "Em andamento", color: "#7C6AF7" },
  done:        { label: "Concluída",    color: "#34D399" },
};

const STATS = [
  { label: "Total", value: 24, color: "var(--text-primary)" },
  { label: "Em andamento", value: 8, color: "#7C6AF7" },
  { label: "Concluídas", value: 13, color: "#34D399" },
  { label: "Atrasadas", value: 3, color: "#F87171" },
];

const TABS: { id: Tab; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "hoje", label: "Hoje" },
  { id: "semana", label: "Esta semana" },
  { id: "concluidas", label: "Concluídas" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<Tab>("todas");

  const toggle = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done, status: !t.done ? "done" : "todo" } : t
      )
    );
  };

  const filtered = tasks.filter((t) => {
    if (activeTab === "hoje") return t.due === "Hoje" && !t.done;
    if (activeTab === "semana") return !t.done;
    if (activeTab === "concluidas") return t.done;
    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--bg-primary)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "0 32px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Tarefas
          </h1>
          <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "1px" }}>
            {tasks.filter((t) => !t.done).length} pendentes
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={14} />
          Nova Tarefa
        </button>
      </header>

      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {STATS.map(({ label, value, color }) => (
            <div
              key={label}
              className="jarvis-card"
              style={{ padding: "18px 20px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ fontSize: "26px", fontWeight: 700, color, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
                {label}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: "-12px",
                  bottom: "-12px",
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: color === "var(--text-primary)" ? "rgba(255,255,255,0.03)" : `${color}08`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Tabs + list */}
        <div className="jarvis-card" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {/* Tab bar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div className="tab-group">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  className={`tab-item${activeTab === id ? " active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: "12px" }}>
                <Tag size={12} />
                Filtrar
              </button>
            </div>
          </div>

          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "24px 1fr 100px 100px 80px 32px",
              gap: "12px",
              padding: "10px 20px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            {["", "Título", "Prioridade", "Prazo", "Status", ""].map((h, i) => (
              <span
                key={i}
                style={{
                  fontSize: "10.5px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Task rows */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "180px",
                  gap: "8px",
                }}
              >
                <CheckCircle2 size={28} color="var(--border-hover)" />
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Nenhuma tarefa nesta categoria
                </p>
              </div>
            ) : (
              filtered.map((task) => {
                const P = PRIORITY_CONFIG[task.priority];
                const S = STATUS_CONFIG[task.status];
                return (
                  <div
                    key={task.id}
                    className="table-row"
                    style={{
                      gridTemplateColumns: "24px 1fr 100px 100px 80px 32px",
                      gap: "12px",
                      opacity: task.done ? 0.5 : 1,
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      className={`jarvis-checkbox${task.done ? " checked" : ""}`}
                      onClick={() => toggle(task.id)}
                      title={task.done ? "Desmarcar" : "Concluir"}
                    >
                      {task.done && <CheckCircle2 size={10} color="white" strokeWidth={2.5} />}
                    </button>

                    {/* Title */}
                    <div style={{ minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: "13.5px",
                          color: task.done ? "var(--text-secondary)" : "var(--text-primary)",
                          textDecoration: task.done ? "line-through" : "none",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {task.title}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          marginTop: "2px",
                          display: "block",
                        }}
                      >
                        {task.tag}
                      </span>
                    </div>

                    {/* Priority */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        className="badge"
                        style={{
                          background: P.bg,
                          color: P.color,
                          border: `1px solid ${P.color}28`,
                          fontSize: "11px",
                          padding: "2px 8px",
                        }}
                      >
                        {P.label}
                      </span>
                    </div>

                    {/* Due */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Calendar size={11} color="var(--text-secondary)" />
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {task.due}
                      </span>
                    </div>

                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          color: S.color,
                          fontWeight: 500,
                        }}
                      >
                        {S.label}
                      </span>
                    </div>

                    {/* Menu */}
                    <button
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
