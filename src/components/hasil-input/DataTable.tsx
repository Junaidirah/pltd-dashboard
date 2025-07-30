"use client";

import React, { useEffect, useRef, useState } from "react";

const stationOptions = ["PLTD KOTARAYA", "PLTD BUNUT", "PLTD ANOTHER"];

const generateBebanData = (station: string) => {
  const data = [];
  for (let i = 1; i <= 24; i++) {
    const row = [];
    for (let j = 0; j < 12; j++) {
      row.push(Math.floor(Math.random() * 100));
    }
    data.push({ jam: `${i.toString().padStart(2, "0")}:00`, beban: row });
  }
  return { [station]: data };
};

const TableBeban = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [bebanData, setBebanData] = useState<
    Record<string, { jam: string; beban: number[] }[]>
  >({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown kalau klik di luar
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

  // Update data saat stasiun dipilih
  useEffect(() => {
    if (selectedStation) {
      setBebanData(generateBebanData(selectedStation));
    }
  }, [selectedStation]);

  const handleSelect = (station: string) => {
    setSelectedStation(station);
    setDropdownOpen(false); // otomatis nutup
  };

  return (
    <div className="p-4">
      {/* Dropdown */}
      <div className="relative w-full max-w-md mb-4" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-full bg-sky-400 text-white px-4 py-2 rounded text-left"
        >
          {selectedStation ? `Stasiun: ${selectedStation}` : "Pilih Stasiun"}
        </button>
        {dropdownOpen && (
          <div className="absolute w-full bg-white border shadow mt-1 rounded z-10">
            {stationOptions.map((station) => (
              <button
                key={station}
                onClick={() => handleSelect(station)}
                className="w-full text-left px-4 py-2 hover:bg-sky-100"
              >
                {station}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabel */}
      {selectedStation && (
        <div>
          <h2 className="text-lg font-semibold mb-2">{selectedStation}</h2>
          <table className="w-full border border-gray-300 text-sm text-center mb-2">
            <thead>
              <tr className="bg-sky-200">
                <th className="py-2">Jam</th>
                {[...Array(12)].map((_, i) => (
                  <th key={i} className="py-2">
                    Mesin {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(bebanData[selectedStation] || []).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  <td className="py-1">{row.jam}</td>
                  {row.beban.map((val, colIndex) => (
                    <td key={colIndex} className="py-1">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selectedStation && (
        <p className="text-gray-500 text-sm">
          Silakan pilih 1 stasiun untuk melihat data.
        </p>
      )}
    </div>
  );
};

export default TableBeban;
