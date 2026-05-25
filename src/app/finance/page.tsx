"use client";

import { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ShoppingCart,
  Briefcase,
  Zap,
  Coffee,
  CreditCard,
  Car,
} from "lucide-react";

type TxType = "income" | "expense";
type Period = "semana" | "mes" | "trimestre" | "ano";

interface Transaction {
  id: number;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  type: TxType;
}

const TRANSACTIONS: Transaction[] = [
  { id: 1, icon: Briefcase,   iconColor: "#34D399", title: "Pagamento — Acme Corp",    category: "Receita",      date: "Hoje, 09:42",       amount: "+ R$ 8.400,00", type: "income"  },
  { id: 2, icon: ShoppingCart,iconColor: "#F87171", title: "Assinatura Adobe CC",       category: "Software",     date: "Hoje, 08:15",       amount: "- R$ 328,90",   type: "expense" },
  { id: 3, icon: Briefcase,   iconColor: "#34D399", title: "Consultoria TechFlow",      category: "Receita",      date: "Ontem, 17:30",      amount: "+ R$ 3.600,00", type: "income"  },
  { id: 4, icon: Zap,         iconColor: "#FBBF24", title: "Conta de luz — Maio",       category: "Utilidades",   date: "24 Mai, 10:00",     amount: "- R$ 412,80",   type: "expense" },
  { id: 5, icon: Coffee,      iconColor: "#F87171", title: "Restaurante Fasano",        category: "Alimentação",  date: "23 Mai, 13:45",     amount: "- R$ 187,50",   type: "expense" },
  { id: 6, icon: CreditCard,  iconColor: "#F87171", title: "Aluguel escritório",        category: "Infraestrutura", date: "22 Mai, 09:00",   amount: "- R$ 4.200,00", type: "expense" },
  { id: 7, icon: Briefcase,   iconColor: "#34D399", title: "Pagamento — DataSync",      category: "Receita",      date: "20 Mai, 16:20",     amount: "+ R$ 12.000,00",type: "income"  },
  { id: 8, icon: Car,         iconColor: "#F87171", title: "Combustível",               category: "Transporte",   date: "19 Mai, 14:00",     amount: "- R$ 290,40",   type: "expense" },
];

const PERIOD_TABS: { id: Period; label: string }[] = [
  { id: "semana",    label: "7 dias" },
  { id: "mes",       label: "30 dias" },
  { id: "trimestre", label: "Trimestre" },
  { id: "ano",       label: "Ano" },
];

/* Bar chart data per period */
const CHART_DATA: Record<Period, { label: string; income: number; expense: number }[]> = {
  semana: [
    { label: "Seg", income: 0,      expense: 290  },
    { label: "Ter", income: 3600,   expense: 187  },
    { label: "Qua", income: 0,      expense: 4200 },
    { label: "Qui", income: 12000,  expense: 412  },
    { label: "Sex", income: 0,      expense: 329  },
    { label: "Sáb", income: 0,      expense: 0    },
    { label: "Dom", income: 8400,   expense: 0    },
  ],
  mes: [
    { label: "S1",  income: 18000, expense: 5200 },
    { label: "S2",  income: 9600,  expense: 3800 },
    { label: "S3",  income: 14400, expense: 6100 },
    { label: "S4",  income: 12000, expense: 4400 },
  ],
  trimestre: [
    { label: "Mar", income: 42000, expense: 19000 },
    { label: "Abr", income: 38000, expense: 21000 },
    { label: "Mai", income: 54000, expense: 23500 },
  ],
  ano: [
    { label: "Jan", income: 32000, expense: 18000 },
    { label: "Fev", income: 28000, expense: 16500 },
    { label: "Mar", income: 42000, expense: 19000 },
    { label: "Abr", income: 38000, expense: 21000 },
    { label: "Mai", income: 54000, expense: 23500 },
  ],
};

export default function FinancePage() {
  const [period, setPeriod] = useState<Period>("mes");

  const chartData = CHART_DATA[period];
  const maxVal = Math.max(...chartData.flatMap((d) => [d.income, d.expense]), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-primary)" }}>
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
            Finanças
          </h1>
          <p style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "1px" }}>
            Maio de 2025
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={14} />
          Nova Transação
        </button>
      </header>

      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Balance cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(3, 1fr)", gap: "12px" }}>
          {/* Main balance */}
          <div
            className="jarvis-card"
            style={{
              padding: "22px 24px",
              background: "linear-gradient(135deg, rgba(124,106,247,0.18) 0%, rgba(124,106,247,0.06) 100%)",
              borderColor: "rgba(124,106,247,0.22)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <DollarSign size={14} color="var(--accent)" />
              <span style={{ fontSize: "11.5px", color: "var(--text-secondary)", fontWeight: 500 }}>
                Saldo Total
              </span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.05em", lineHeight: 1 }}>
              R$ 87.240
            </div>
            <div style={{ fontSize: "11px", color: "var(--success)", marginTop: "8px", display: "flex", alignItems: "center", gap: "3px" }}>
              <TrendingUp size={11} />
              +12,4% em relação ao mês anterior
            </div>
            {/* Decorative */}
            <div
              style={{
                position: "absolute",
                right: "-24px",
                bottom: "-24px",
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                background: "rgba(124,106,247,0.12)",
              }}
            />
          </div>

          {/* Receitas */}
          <div className="jarvis-card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "10px" }}>Receitas</p>
                <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  R$ 54.000
                </p>
              </div>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(52,211,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={15} color="var(--success)" />
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "72%", background: "var(--success)" }} />
              </div>
              <p style={{ fontSize: "10.5px", color: "var(--success)", marginTop: "5px" }}>+18% vs mês anterior</p>
            </div>
          </div>

          {/* Despesas */}
          <div className="jarvis-card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "10px" }}>Despesas</p>
                <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  R$ 23.500
                </p>
              </div>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(248,113,113,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowDownRight size={15} color="var(--danger)" />
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "43%", background: "var(--danger)" }} />
              </div>
              <p style={{ fontSize: "10.5px", color: "var(--danger)", marginTop: "5px" }}>+5% vs mês anterior</p>
            </div>
          </div>

          {/* Economia */}
          <div className="jarvis-card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "10px" }}>Economia</p>
                <p style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  R$ 30.500
                </p>
              </div>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PiggyBank size={15} color="var(--warning)" />
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "56%", background: "var(--warning)" }} />
              </div>
              <p style={{ fontSize: "10.5px", color: "var(--warning)", marginTop: "5px" }}>56% do total de receitas</p>
            </div>
          </div>
        </div>

        {/* Chart + Transactions row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "12px", flex: 1, minHeight: 0 }}>
          {/* Chart card */}
          <div className="jarvis-card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)" }}>
                Receitas vs Despesas
              </h3>
              <div className="tab-group">
                {PERIOD_TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    className={`tab-item${period === id ? " active" : ""}`}
                    onClick={() => setPeriod(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              {[{ color: "var(--success)", label: "Receitas" }, { color: "var(--danger)", label: "Despesas" }].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color }} />
                  <span style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "12px", paddingBottom: "28px", position: "relative" }}>
              {/* Y grid lines */}
              {[0, 25, 50, 75, 100].map((pct) => (
                <div
                  key={pct}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: `calc(28px + ${pct}%)`,
                    borderTop: "1px dashed var(--border)",
                    pointerEvents: "none",
                  }}
                />
              ))}

              {chartData.map(({ label, income, expense }) => {
                const incH = maxVal > 0 ? (income / maxVal) * 100 : 0;
                const expH = maxVal > 0 ? (expense / maxVal) * 100 : 0;
                return (
                  <div
                    key={label}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}
                  >
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "3px", width: "100%", paddingBottom: "4px" }}>
                      {/* Income bar */}
                      <div
                        style={{
                          flex: 1,
                          height: `${incH}%`,
                          minHeight: income > 0 ? "4px" : "0",
                          background: "rgba(52,211,153,0.8)",
                          borderRadius: "3px 3px 0 0",
                          transition: "height 0.4s ease",
                        }}
                      />
                      {/* Expense bar */}
                      <div
                        style={{
                          flex: 1,
                          height: `${expH}%`,
                          minHeight: expense > 0 ? "4px" : "0",
                          background: "rgba(248,113,113,0.75)",
                          borderRadius: "3px 3px 0 0",
                          transition: "height 0.4s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--text-secondary)", position: "absolute", bottom: "4px" }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transactions */}
          <div className="jarvis-card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div
              style={{
                padding: "16px 18px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                Transações Recentes
              </h3>
              <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: "11.5px" }}>
                Ver todas
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {TRANSACTIONS.map(({ id, icon: Icon, iconColor, title, category, date, amount, type }) => (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 18px",
                    borderBottom: "1px solid var(--border)",
                    transition: "background 0.12s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.022)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "9px",
                      background: `${iconColor}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={14} color={iconColor} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {title}
                    </div>
                    <div style={{ fontSize: "10.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {category} · {date}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: type === "income" ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {amount}
                    </span>
                    <button style={{ width: "22px", height: "22px", borderRadius: "5px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
