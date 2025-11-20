"use client";

import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function TrendChart({ outlet }) {
  const labels = outlet.daily.map((d) => d.day_iso);
  const piValues = outlet.daily.map((d) => d.pi_score);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        Predictability Index Trend — {outlet.outlet}
      </h3>
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "PI Score",
                data: piValues,
                fill: false,
                borderColor: "#00C896",
                borderWidth: 3,
                pointRadius: 3,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
