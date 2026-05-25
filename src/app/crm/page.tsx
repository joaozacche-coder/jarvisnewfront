"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Target,
} from "lucide-react";

type Stage = "lead" | "contato" | "proposta" | "negociacao" | "fechado";

interface Contact {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: Stage;
  value: string;
  lastContact: string;
  initials: string;
  color: string;
}

const CONTACTS: Contact[] = [
  { id: 1, name: "Ricardo Alves", company: "Acme Corp", email: "r.alves@acme.com", phone: "+55 11 98765-4321", stage: "negociacao", value: "R$ 48.000", lastContact: "Hoje", initials: "RA", color: "#7C6AF7" },
  { id: 2, name: "Fernanda Costa", company: "TechFlow", email: "f.costa@techflow.io", phone: "+55 11 91234-5678", stage: "proposta", value: "R$ 24.000", lastContact: "Ontem", initials: "FC", color: "#34D399" },
  { id: 3, name: "Bruno Martins", company: "StartupXYZ", email: "bruno@startupxyz.com.br", phone: "+55 21 99876-5432", stage: "contato", value: "R$ 12.000", lastContact: "3 dias", initials: "BM", color: "#FBBF24" },
  { id: 4, name: "Mariana Souza", company: "InnovateBR", email: "m.souza@innovate.com.br", phone: "+55 11 97654-3210", stage: "lead", value: "R$ 8.500", lastContact: "1 semana", initials: "MS", color: "#F87171" },
  { id: 5, name: "Gabriel Lima", company: "DataSync", email: "g.lima@datasync.com", phone: "+55 31 98765-1234", stage: "fechado", value: "R$ 62.000", lastContact: "10 dias", initials: "GL", color: "#34D399" },
  { id: 6, name: "Ana Rodrigues", company: "CloudBase", email: "ana.r@cloudbase.io", phone: "+55 11 95432-8765", stage: "proposta", value: "R$ 18.000", lastContact: "2 dias", initials: "AR", color: "#A78BFA" },
];

const STAGE_CONFIG: Record<Stage, { label: string; color: string; bg: string; border: string }> = {
  lead:        { label: "Lead",       color: "#8888A0", bg: "rgba(136,136,160,0.1)",  border: "rgba(136,136,160,0.2)" },
  contato:     { label: "Contato",    color: "#FBBF24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.2)" },
  proposta:    { label: "Proposta",   color: "#7C6AF7", bg: "rgba(124,106,247,0.12)", border: "rgba(124,106,247,0.22)" },
  negociacao:  { label: "Negociação", color: "#F87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.2)" },
  fechado:     { label: "Fechado",    color: "#34D399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.2)" },
};

const PIPELINE_STAGES: Stage[] = ["lead", "contato", "proposta", "negociacao", "fechado"];

const STATS = [
  { icon: Users,      label: "Total Contatos", value: "48",       sub: "+6 este mês",    color: "#7C6AF7" },
  { icon: TrendingUp, label: "Leads Ativos",   value: "12",       sub: "Em andamento",   color: "#FBBF24" },
  { icon: DollarSign, label: "Pipeline Total", value: "R$ 172k",  sub: "Valor estimado", color: "#34D399" },
  { icon: Target,     label: "Conversão",      value: "32%",      sub: "Últimos 30 dias", color: "#F87171" },
];

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState<Stage | "todas">("todas");

  const filtered = CONTACTS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchStage = activeStage === "todas" || c.stage === activeStage;
    return matchSearch && matchStage;
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
          <h1 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            CRM
          </h1>
          <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "1px" }}>
            {CONTACTS.length} contatos ativos
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={14} />
          Novo Contato
        </button>
      </header>

      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {STATS.map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="jarvis-card" style={{ padding: "18px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: `${color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color={color} />
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "4px" }}>{label}</div>
                <div style={{ fontSize: "10.5px", color, marginTop: "2px", fontWeight: 500 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline visual */}
        <div className="jarvis-card" style={{ padding: "16px 20px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
            Pipeline de Vendas
          </h3>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {PIPELINE_STAGES.map((stage, i) => {
              const cfg = STAGE_CONFIG[stage];
              const count = CONTACTS.filter((c) => c.stage === stage).length;
              const total = CONTACTS.length;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>{cfg.label}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: cfg.color }}>{count}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct * 2}%`, background: cfg.color, maxWidth: "100%" }}
                    />
                  </div>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        right: "-5px",
                        top: "50%",
                        width: "8px",
                        height: "8px",
                        borderTop: "1.5px solid var(--border-hover)",
                        borderRight: "1.5px solid var(--border-hover)",
                        transform: "translateY(-50%) rotate(45deg)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact list */}
        <div className="jarvis-card" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {/* Toolbar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative", flex: 1, maxWidth: "280px" }}>
              <Search
                size={14}
                color="var(--text-secondary)"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
              <input
                type="text"
                placeholder="Buscar contatos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="jarvis-input"
                style={{ width: "100%", padding: "7px 12px 7px 34px", fontSize: "13px" }}
              />
            </div>

            <div className="tab-group">
              <button
                className={`tab-item${activeStage === "todas" ? " active" : ""}`}
                onClick={() => setActiveStage("todas")}
              >
                Todos
              </button>
              {PIPELINE_STAGES.map((s) => (
                <button
                  key={s}
                  className={`tab-item${activeStage === s ? " active" : ""}`}
                  onClick={() => setActiveStage(s)}
                >
                  {STAGE_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "36px 1fr 140px 140px 110px 100px 32px",
              gap: "12px",
              padding: "10px 20px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            {["", "Nome / Empresa", "Email", "Telefone", "Estágio", "Valor", ""].map((h, i) => (
              <span key={i} style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.map((contact) => {
              const S = STAGE_CONFIG[contact.stage];
              return (
                <div
                  key={contact.id}
                  className="table-row"
                  style={{ gridTemplateColumns: "36px 1fr 140px 140px 110px 100px 32px", gap: "12px" }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: `${contact.color}22`,
                      border: `1.5px solid ${contact.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: contact.color,
                      flexShrink: 0,
                    }}
                  >
                    {contact.initials}
                  </div>

                  {/* Name */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {contact.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <Building2 size={10} color="var(--text-secondary)" />
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {contact.company}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
                    <Mail size={11} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {contact.email}
                    </span>
                  </div>

                  {/* Phone */}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Phone size={11} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {contact.phone}
                    </span>
                  </div>

                  {/* Stage */}
                  <div>
                    <span
                      className="badge"
                      style={{ background: S.bg, color: S.color, border: `1px solid ${S.border}`, fontSize: "11px", padding: "2px 8px" }}
                    >
                      {S.label}
                    </span>
                  </div>

                  {/* Value */}
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {contact.value}
                  </div>

                  {/* Menu */}
                  <button
                    style={{
                      width: "28px", height: "28px", borderRadius: "6px", border: "none",
                      background: "transparent", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", color: "var(--text-secondary)",
                    }}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
