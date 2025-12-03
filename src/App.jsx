import { useEffect, useState } from "react";
import Papa from "papaparse";
import LegibilityTimeline from "./components/LegibilityTimeline.jsx";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function App() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [globalAvg, setGlobalAvg] = useState(null);

  useEffect(() => {
    Papa.parse("/data/addiction_2018_features_tfidf_256.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data;

          const parsed = rows
            .map((row) => {
              if (!row.date) return null;

              // formato "2018/01/02"
              const parts = String(row.date).split("/");
              if (parts.length < 2) return null;

              const month = Number(parts[1]); // "01" -> 1
              const value = Number(row.n_polysyllable_words); // métrica usada

              if (!month || Number.isNaN(value)) return null;

              return { month, value };
            })
            .filter((r) => r !== null);

          // agrupa por mês
          const monthsMap = new Map(); // month -> { sum, count, min, max }

          for (const r of parsed) {
            if (!monthsMap.has(r.month)) {
              monthsMap.set(r.month, {
                sum: 0,
                count: 0,
                min: r.value,
                max: r.value,
              });
            }
            const m = monthsMap.get(r.month);
            m.sum += r.value;
            m.count += 1;
            if (r.value < m.min) m.min = r.value;
            if (r.value > m.max) m.max = r.value;
          }

          const timelineData = Array.from(monthsMap.entries())
            .map(([month, { sum, count, min, max }]) => ({
              month: Number(month),
              avg: sum / count,
              min,
              max,
              count,
            }))
            .sort((a, b) => a.month - b.month);

          // média geral ponderada
          const totalSum = timelineData.reduce(
            (acc, m) => acc + m.avg * m.count,
            0
          );
          const totalCount = timelineData.reduce(
            (acc, m) => acc + m.count,
            0
          );
          const globalAverage = totalSum / totalCount;

          setTimeline(timelineData);
          setGlobalAvg(globalAverage);
          if (timelineData.length > 0) {
            setSelectedMonth(timelineData[0].month);
          }
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Erro ao processar os dados.");
          setLoading(false);
        }
      },
      error: (err) => {
        console.error(err);
        setError("Erro ao carregar o CSV.");
        setLoading(false);
      },
    });
  }, []);

  const handleMonthChange = (event) => {
    const value = Number(event.target.value);
    setSelectedMonth(value);
  };

  // monta análise textual do mês selecionado
  let analysisText = "";
  if (
    selectedMonth !== null &&
    globalAvg !== null &&
    timeline.length > 0
  ) {
    const sel = timeline.find((m) => m.month === selectedMonth);
    if (sel) {
      const diff = sel.avg - globalAvg;
      const perc = (diff / globalAvg) * 100;
      const direction = diff >= 0 ? "acima" : "abaixo";

      analysisText = `Em ${
        MONTH_LABELS[sel.month - 1]
      } a complexidade média dos relatos foi de ${sel.avg.toFixed(
        1
      )} difficult_words por texto, o que representa aproximadamente ${Math.abs(
        perc
      ).toFixed(
        1
      )}% ${direction} da média geral do período analisado. Nesse mês, o dataset contém ${
        sel.count
      } relatos, com valores variando entre ${sel.min.toFixed(
        1
      )} e ${sel.max.toFixed(
        1
      )} difficult_words, indicando um nível ${
        sel.avg >= globalAvg ? "mais elevado" : "mais moderado"
      } de detalhamento e carga cognitiva nos textos sobre dependência.`;
    }
  }

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <div className="badge">
            <span className="badge-dot" />
            <span>Dataset: r/addiction – 2018</span>
          </div>

          <h1 className="app-title">
            Linha do tempo da complexidade dos relatos sobre dependência
          </h1>

          <p className="app-subtitle">
            Variação da complexidade textual dos relatos ao longo de 2018,
            usando a métrica <strong>difficult_words</strong> como indicador
            indireto de carga cognitiva e emocional.
          </p>

          <p className="meta-info">
            Meses com média mais alta podem indicar períodos em que os relatos
            tendem a ser mais longos, densos e detalhados, possivelmente
            refletindo maior sofrimento ou aprofundamento nas experiências
            relacionadas ao vício.
          </p>
        </header>

        {loading && <div className="loading">Carregando dados…</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && timeline.length > 0 && (
          <>
            <div className="month-controls">
              <label>
                Selecionar mês:&nbsp;
                <select
                  value={selectedMonth ?? ""}
                  onChange={handleMonthChange}
                >
                  {timeline.map((m) => (
                    <option key={m.month} value={m.month}>
                      {MONTH_LABELS[m.month - 1]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="chart-wrapper">
              <LegibilityTimeline data={timeline} />
            </div>

            {analysisText && (
              <p
                className="meta-info"
                style={{ marginTop: "1.5rem", lineHeight: 1.6 }}
              >
                {analysisText}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
