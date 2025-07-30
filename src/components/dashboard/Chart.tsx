"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LoadData {
  timestamp: string;
  load: number;
  station: string;
}

const dummyData: LoadData[] = [
  { timestamp: "08:00", load: 120, station: "Stasiun A" },
  { timestamp: "09:00", load: 150, station: "Stasiun A" },
  { timestamp: "08:00", load: 100, station: "Stasiun B" },
  { timestamp: "09:00", load: 180, station: "Stasiun B" },
  { timestamp: "08:00", load: 130, station: "Stasiun C" },
  { timestamp: "09:00", load: 160, station: "Stasiun C" },
];

const Page = () => {
  const selectedStation = "all";

  const filteredData =
    selectedStation === "all"
      ? dummyData
      : dummyData.filter((d) => d.station === selectedStation);

  const chartData = filteredData.map((d) => ({
    ...d,
    pv: d.load, // beban siang
    uv: Math.round(d.load * 0.8), // beban malam
  }));

  return (
    <main className="p-4 md:p-6 lg:p-10">
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
        Grafik Beban
      </h1>

      <div className="bg-blue-50 rounded-xl p-3 md:p-4 lg:p-6 shadow-md">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pv"
                fill="#8884d8"
                name="Beban Siang"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#82ca9d"
                name="Beban Malam"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default Page;
