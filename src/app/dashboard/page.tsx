"use client";

import Chart from "@/src/components/dashboard/Chart";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import StatsCard from "@/src/components/dashboard/StatsCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useEffect, useState } from "react";

// Definisikan tipe untuk data statistik
interface StatsData {
  avgLoad: number | null;
  dmMesin: number;
  surplus: number;
}

export default function Dashboard() {
  const [plantTypes] = useState<string[]>([
    "PLN_MOUTONG",
    "THAS_POWER_MOUTONG",
    "GSS_BOLANO",
    "THAS_POWER_PALASA",
    "PLTM_TOMINI",
    "PLTD_KOTARAYA",
  ]);

  const [selectedPlantType, setSelectedPlantType] = useState<string>(
    plantTypes[0] || ""
  );
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIKA BARU UNTUK MENGONTROL LOOP ---
  // State untuk menandai jika pengguna sudah memilih manual
  const [manualSelection, setManualSelection] = useState(false);

  // useEffect untuk mengambil data statistik (TIDAK BERUBAH)
  useEffect(() => {
    if (!selectedPlantType) {
      setStatsData(null);
      return;
    }

    const fetchStatsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = "https://general-serve.vercel.app";
        const res = await fetch(
          `${apiUrl}/load-readings/plant-type/${selectedPlantType}`
        );

        if (!res.ok) {
          throw new Error(
            `Gagal mengambil data statistik untuk ${selectedPlantType}`
          );
        }

        const data = await res.json();
        setStatsData(data.aggregatedData);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan tidak diketahui");
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [selectedPlantType]);

  // --- useEffect BARU UNTUK LOOP OTOMATIS ---
  useEffect(() => {
    // Jangan jalankan loop jika pengguna sudah memilih secara manual
    if (manualSelection) {
      return;
    }

    const intervalId = setInterval(() => {
      setSelectedPlantType((currentType) => {
        const currentIndex = plantTypes.indexOf(currentType);
        const nextIndex = (currentIndex + 1) % plantTypes.length;
        return plantTypes[nextIndex];
      });
    }, 30000); // 30 detik

    // Hentikan interval
    return () => clearInterval(intervalId);
  }, [manualSelection, plantTypes]); // Efek ini akan berhenti jika manualSelection menjadi true

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          {/* Header ini akan otomatis update menunjukkan plant type yang aktif */}
          <DashboardHeader title={selectedPlantType || "Dashboard"} />

          <div className="w-full sm:w-auto sm:max-w-xs">
            <Select
              value={selectedPlantType}
              onValueChange={(value) => {
                // Saat memilih manual, set manualSelection menjadi true untuk menghentikan loop
                setManualSelection(true);
                setSelectedPlantType(value);
              }}
            >
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
        </div>

        {loading && <p>Memuat data untuk {selectedPlantType}...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <StatsCard
            title="Total Beban (Avg)"
            value={statsData?.avgLoad?.toFixed(2) ?? "0"}
            variant="warning"
          />
          <StatsCard
            title="DM Mesin"
            value={statsData?.dmMesin?.toString() ?? "0"}
            variant="primary"
          />
          <StatsCard
            title="Surplus"
            value={statsData?.surplus?.toFixed(2) ?? "0"}
            variant="info"
          />
        </div>

        <Chart className="mb-6 lg:mb-8" />
      </div>
    </DashboardLayout>
  );
}
