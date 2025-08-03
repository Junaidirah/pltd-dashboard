"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Definisikan tipe data
interface LoadReading {
  timestamp: string;
  load: number;
  dmSiang: number;
  dmMalam: number;
}
interface ChartData extends LoadReading {}
type ChartProps = { className?: string };

const Chart = ({ className }: ChartProps) => {
  // Langsung inisialisasi state dengan daftar yang sudah ada
  const [plantTypes, setPlantTypes] = useState<string[]>([
    "PLN_MOUTONG",
    "THAS_POWER_MOUTONG",
    "GSS_BOLANO",
    "THAS_POWER_PALASA",
    "PLTM_TOMINI",
    "PLTD_KOTARAYA",
  ]);

  const [selectedPlantType, setSelectedPlantType] = useState<string>("");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect untuk mengambil data plant types sudah dihapus

  // useEffect untuk mengambil data chart tetap ada
  useEffect(() => {
    if (!selectedPlantType) {
      setChartData([]);
      return;
    }

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = "https://general-serve.vercel.app"; // Mengarah ke server lokal
        const res = await fetch(
          `${apiUrl}/load-readings/plant-type/${selectedPlantType}`
        );

        if (!res.ok) {
          throw new Error(`Gagal mengambil data untuk ${selectedPlantType}`);
        }
        const data = await res.json();
        const formattedData = data.loadReadings.map((reading: LoadReading) => ({
          ...reading,
          timestamp: format(new Date(reading.timestamp), "HH:mm"),
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Fetch chart data failed:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui.");
        }
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedPlantType]);

  return (
    <div className={className}>
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
        Grafik Beban per Tipe Plant
      </h1>

      <div className="mb-6 max-w-xs">
        <Select onValueChange={(value) => setSelectedPlantType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Tipe Plant" />
          </SelectTrigger>
          <SelectContent>
            {plantTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 md:p-4 lg:p-6 shadow-md">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              Loading...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : chartData.length === 0 && selectedPlantType ? (
            <div className="flex items-center justify-center h-full">
              Tidak ada data untuk ditampilkan.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="load" fill="#8884d8" name="Beban (Load)" />
                <Bar dataKey="dmSiang" fill="#82ca9d" name="DM Siang" />
                <Bar dataKey="dmMalam" fill="#ffc658" name="DM Malam" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;
