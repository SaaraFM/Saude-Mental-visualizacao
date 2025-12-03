import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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

function LegibilityTimeline({ data }) {
  const chartData = data.map((d) => ({
    monthLabel: MONTH_LABELS[d.month - 1],
    avg: d.avg,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, bottom: 30, left: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          dataKey="monthLabel"
          tick={{ fill: "#e5e7eb", fontSize: 12 }}
          label={{
            value: "Mês de 2018",
            position: "bottom",
            offset: 0,
            fill: "#9ca3af",
          }}
        />
        <YAxis
          tick={{ fill: "#e5e7eb", fontSize: 12 }}
          label={{
            value: "Complexidade média (difficult_words)",
            angle: -90,
            position: "insideLeft",
            fill: "#9ca3af",
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            border: "1px solid #1f2937",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "#e5e7eb" }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ fontSize: 12, color: "#e5e7eb" }}
        />
        <Line
          type="monotone"
          dataKey="avg"
          name="Complexidade média"
          stroke="#22c55e"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LegibilityTimeline;
