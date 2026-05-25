"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CheckSquare,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Bell,
  Settings,
} from "lucide-react";

const NAV = [
  { icon: Bot,         label: "Agente",    href: "/" },
  { icon: CheckSquare, label: "Tarefas",   href: "/tasks" },
  { icon: Users,       label: "CRM",       href: "/crm" },
  { icon: DollarSign,  label: "Finanças",  href: "/finance" },
  { icon: Calendar,    label: "Agenda",    href: "/agenda" },
  { icon: FileText,    label: "Notas",     href: "/notes" },
  { icon: Bell,        label: "Lembretes", href: "/reminders" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "52px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "18px 0 14px",
        gap: 0,
        zIndex: 50,
        /* transparent — lets particle field show through */
        background: "transparent",
        borderRight: "1px solid rgba(255,255,255,0.038)",
        /* overflow visible so tooltips can escape */
        overflow: "visible",
        position: "relative",
      }}
    >
      {/* Logo mark */}
      <div
        title="JARVIS"
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "6px",
          background: "rgba(124,106,247,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          flexShrink: 0,
          opacity: 0.8,
        }}
      >
        {/* Star glyph */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M5 0.5L6.55 3.45L10 3.95L7.5 6.38L8.09 9.82L5 8.2L1.91 9.82L2.5 6.38L0 3.95L3.45 3.45L5 0.5Z"
            fill="white"
            fillOpacity="0.88"
          />
        </svg>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          overflow: "visible",
        }}
      >
        {NAV.map(({ icon: Icon, label, href }, i) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-link${active ? " active" : ""}`}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.6} />
              <span className="sidebar-tooltip">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <Link
        href="/settings"
        className={`sidebar-nav-link${pathname === "/settings" ? " active" : ""}`}
        style={{ marginBottom: "10px" }}
      >
        <Settings size={15} strokeWidth={1.6} />
        <span className="sidebar-tooltip">Configurações</span>
      </Link>

      {/* User avatar */}
      <div
        title="João Zacche — Pro"
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(124,106,247,0.55), rgba(167,139,250,0.55))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "8px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.02em",
          cursor: "pointer",
          opacity: 0.65,
          flexShrink: 0,
          transition: "opacity 180ms ease",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "1")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.opacity = "0.65")
        }
      >
        JZ
      </div>
    </aside>
  );
}
