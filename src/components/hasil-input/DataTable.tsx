"use client";

import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

// Tipe data untuk hasil transformasi
interface TableRow {
  jam: string;
  beban: (number | string)[];
}

interface LoadReading {
  timestamp: string;
  load: number;
  machine: {
    identifier: string;
  };
}

const TableBeban = () => {
  const [stationOptions] = useState<string[]>([
    "PLN_MOUTONG",
    "THAS_POWER_MOUTONG",
    "GSS_BOLANO",
    "THAS_POWER_PALASA",
    "PLTM_TOMINI",
    "PLTD_KOTARAYA",
  ]);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
  const [machineHeaders, setMachineHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedStation) {
      setTableRows([]);
      setMachineHeaders([]);
      return;
    }

    const fetchBebanData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://general-serve.vercel.app/load-readings/plant-type/${selectedStation}`
        );
        if (!res.ok)
          throw new Error(`Gagal mengambil data untuk ${selectedStation}`);

        const data = await res.json();
        const loadReadings = data.loadReadings as LoadReading[];

        if (!Array.isArray(loadReadings) || loadReadings.length === 0) {
          setTableRows([]);
          setMachineHeaders([]);
          return;
        }

        // Ambil list mesin unik
        const machineSet = new Set<string>();
        loadReadings.forEach((r) => machineSet.add(r.machine.identifier));
        const uniqueMachines = Array.from(machineSet).sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || "0");
          const numB = parseInt(b.match(/\d+/)?.[0] || "0");
          return numA - numB;
        });
        setMachineHeaders(uniqueMachines);

        // Kelompokkan berdasarkan jam
        const dataByHour: Record<string, Record<string, number>> = {};
        for (const reading of loadReadings) {
          const hour = format(new Date(reading.timestamp), "HH:00");
          const machineId = reading.machine.identifier;
          if (!dataByHour[hour]) dataByHour[hour] = {};
          dataByHour[hour][machineId] = reading.load;
        }

        // Isi 24 jam
        const finalTableData: TableRow[] = [];
        for (let i = 1; i <= 24; i++) {
          const hourKey = `${i.toString().padStart(2, "0")}:00`;
          const hourlyData = dataByHour[hourKey] || {};
          const bebanRow = uniqueMachines.map(
            (machine) => hourlyData[machine] ?? "-"
          );
          finalTableData.push({ jam: hourKey, beban: bebanRow });
        }

        setTableRows(finalTableData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data");
        setTableRows([]);
        setMachineHeaders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBebanData();
  }, [selectedStation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (station: string) => {
    setSelectedStation(station);
    setDropdownOpen(false);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Dropdown Selector */}
      <div className="w-full max-w-sm mb-6 relative z-20" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-full bg-sky-600 text-white px-4 py-2 rounded-xl shadow text-left hover:bg-sky-700 transition"
        >
          {selectedStation
            ? `Stasiun: ${selectedStation}`
            : "Pilih Tipe Stasiun"}
        </button>
        {dropdownOpen && (
          <div className="absolute w-full bg-white border mt-1 shadow-md rounded-xl overflow-y-auto max-h-64 z-30">
            {stationOptions.map((station) => (
              <button
                key={station}
                onClick={() => handleSelect(station)}
                className="w-full px-4 py-2 text-left hover:bg-sky-100 transition"
              >
                {station}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabel */}
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : selectedStation ? (
        <>
          <h2 className="text-lg font-semibold mb-3 text-slate-800">
            Data Beban per Jam - {selectedStation}
          </h2>

          {tableRows.length === 0 ? (
            <p className="text-gray-500 italic">Data tidak tersedia.</p>
          ) : (
            <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-[1000px] border-collapse text-sm text-center">
                <thead className="bg-sky-200 text-gray-800">
                  <tr>
                    <th className="py-2 px-4 border sticky left-0 bg-sky-200 z-10 text-left">
                      Jam
                    </th>
                    {machineHeaders.map((header) => (
                      <th
                        key={header}
                        className="py-2 px-4 border whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.jam} className="hover:bg-gray-50">
                      <td className="py-1 px-4 border sticky left-0 bg-white z-10 text-left font-medium">
                        {row.jam}
                      </td>
                      {row.beban.map((val, idx) => (
                        <td
                          key={idx}
                          className="py-1 px-4 border whitespace-nowrap"
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-sm">
          Silakan pilih tipe stasiun terlebih dahulu.
        </p>
      )}
    </div>
  );
};

export default TableBeban;
