"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Decree = {
  id: string;
  number: string;
  date: string;
  description: string;
  createdAt: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));

export default function Home() {
  const [decrees, setDecrees] = useState<Decree[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadDecrees = async () => {
    try {
      const response = await fetch("/api/decrees");
      if (!response.ok) throw new Error();
      setDecrees(await response.json());
    } catch {
      setMessage("No fue posible conectar con el almacenamiento de Netlify.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecrees();
  }, []);

  const monthData = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("es-CL", { month: "short" });
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return {
        key,
        label: formatter.format(date).replace(".", ""),
        count: decrees.filter((item) => item.date.startsWith(key)).length,
      };
    });
  }, [decrees]);

  const visibleDecrees = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return decrees.filter((item) => {
      const matchesMonth = !selectedMonth || item.date.startsWith(selectedMonth);
      const matchesQuery =
        !normalized ||
        item.number.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized);
      return matchesMonth && matchesQuery;
    });
  }, [decrees, query, selectedMonth]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonth = decrees.filter((item) => item.date.startsWith(currentMonth)).length;
  const maxCount = Math.max(1, ...monthData.map((item) => item.count));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const decree: Decree = {
      id: crypto.randomUUID(),
      number: String(form.get("number") || "").trim(),
      date: String(form.get("date") || ""),
      description: String(form.get("description") || "").trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/decrees", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(decree),
      });
      if (!response.ok) throw new Error();
      setDecrees((items) => [decree, ...items]);
      event.currentTarget.reset();
      setMessage(`Decreto N° ${decree.number} guardado correctamente.`);
    } catch {
      setMessage("No fue posible guardar el decreto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <header className="topbar">
        <div className="brand-mark">GD</div>
        <div className="brand-copy">
          <strong>Sistema de Gestión Documental</strong>
          <span>Registro simple de decretos</span>
        </div>
        <div className="status-dot"><i /> Datos centralizados</div>
      </header>

      <div className="page">
        <section className="intro">
          <div>
            <span className="eyebrow">GESTIÓN DOCUMENTAL</span>
            <h1>Decretos</h1>
            <p>Registra y consulta los decretos en un solo lugar.</p>
          </div>
          <div className="date-chip">
            <span>HOY</span>
            <strong>{new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "long" }).format(new Date())}</strong>
          </div>
        </section>

        <section className="dashboard">
          <article className="metric main-metric">
            <span className="metric-icon">D</span>
            <div>
              <small>Total de decretos</small>
              <strong>{decrees.length}</strong>
            </div>
          </article>
          <article className="metric">
            <span className="metric-icon yellow">M</span>
            <div>
              <small>Este mes</small>
              <strong>{thisMonth}</strong>
            </div>
          </article>
          <article className="chart-card">
            <div className="chart-heading">
              <div><strong>Actividad mensual</strong><small>Últimos 6 meses</small></div>
              {selectedMonth && <button onClick={() => setSelectedMonth(null)}>Ver todos</button>}
            </div>
            <div className="mini-chart">
              {monthData.map((item) => (
                <button
                  key={item.key}
                  className={selectedMonth === item.key ? "active" : ""}
                  onClick={() => setSelectedMonth(selectedMonth === item.key ? null : item.key)}
                  title={`${item.count} decretos en ${item.label}`}
                >
                  <span style={{ height: `${Math.max(8, (item.count / maxCount) * 54)}px` }} />
                  <b>{item.label}</b>
                </button>
              ))}
            </div>
          </article>
        </section>

        <section className="work-grid">
          <form className="entry-card" onSubmit={submit}>
            <div className="section-title">
              <span>+</span>
              <div><h2>Nuevo decreto</h2><p>Ingresa los datos básicos del documento.</p></div>
            </div>
            <label>
              Número de decreto
              <input name="number" required placeholder="Ej. 1245" />
            </label>
            <label>
              Fecha del decreto
              <input name="date" type="date" required />
            </label>
            <label>
              Descripción
              <textarea name="description" required maxLength={500} placeholder="Escribe una breve descripción del decreto..." />
            </label>
            <button className="save-button" disabled={saving}>
              {saving ? "Guardando..." : "Guardar decreto"}
            </button>
            {message && <p className="form-message">{message}</p>}
          </form>

          <section className="list-card">
            <div className="list-head">
              <div><h2>{selectedMonth ? "Decretos del periodo" : "Decretos registrados"}</h2><p>{visibleDecrees.length} resultados</p></div>
              <label className="search">
                <span>⌕</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar decreto..." />
              </label>
            </div>
            <div className="decree-list">
              {loading ? (
                <div className="empty">Cargando decretos...</div>
              ) : visibleDecrees.length ? visibleDecrees.map((item) => (
                <article className="decree-row" key={item.id}>
                  <div className="number-box"><small>DECRETO</small><strong>N° {item.number}</strong></div>
                  <div className="decree-copy"><strong>{item.description}</strong><span>{formatDate(item.date)}</span></div>
                  <time>{new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(new Date(`${item.date}T12:00:00`))}</time>
                </article>
              )) : (
                <div className="empty"><span>—</span><strong>No hay decretos registrados</strong><p>Los nuevos decretos aparecerán aquí.</p></div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
