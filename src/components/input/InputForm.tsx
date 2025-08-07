"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Machine {
  id: string;
  identifier: string;
}

interface Plant {
  id: string;
  name: string;
  machines: Machine[];
}

interface InputFormProps {}

export default function InputForm({}: InputFormProps) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string>("");
  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const [timestamp, setTimestamp] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<string>("normal");

  const [formData, setFormData] = useState({
    load: "",
    dmSiang: "",
    dmMalam: "",
  });

  useEffect(() => {
    fetch("https://general-serve.vercel.app/plants")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch((err) => console.error("Gagal fetch plants", err));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachineId || !timestamp) {
      alert("Pastikan Anda telah memilih Plant, Mesin, dan Waktu.");
      return;
    }

    const body = {
      timestamp: timestamp.toISOString(),
      load: parseFloat(formData.load || "0"),
      dmSiang: parseFloat(formData.dmSiang || "0"),
      dmMalam: parseFloat(formData.dmMalam || "0"),
      status,
    };

    try {
      const res = await fetch(
        `https://general-serve.vercel.app/load-readings/machine/${selectedMachineId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error ${res.status}: ${errorText}`);
      }

      const json = await res.json();
      console.log("Submitted:", json);
      alert("Data berhasil disubmit!");
    } catch (error) {
      console.error("Submit failed:", error);
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Gagal submit data: ${errorMessage}`);
    }
  };

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  // Fungsi filterWaktu telah dihapus karena tidak lagi dibutuhkan.

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm"
    >
      {/* PLANT */}
      <Select onValueChange={(val) => setSelectedPlantId(val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih Plant" />
        </SelectTrigger>
        <SelectContent>
          {plants.map((plant) => (
            <SelectItem key={plant.id} value={plant.id}>
              {plant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* MACHINE */}
      <Select
        onValueChange={(val) => setSelectedMachineId(val)}
        disabled={!selectedPlant}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih Mesin" />
        </SelectTrigger>
        <SelectContent>
          {selectedPlant?.machines.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.identifier}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* TANGGAL & STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Waktu Input</label>
          <DatePicker
            selected={timestamp}
            onChange={(date) => setTimestamp(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15} // Kembali menggunakan timeIntervals
            dateFormat="yyyy-MM-dd HH:mm"
            className="w-full border border-gray-200 rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <Select onValueChange={(val) => setStatus(val)} defaultValue="normal">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="overload">Overload</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* LOAD, DM SIANG, DM MALAM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["load", "dmSiang", "dmMalam"].map((key) => (
          <Input
            key={key}
            type="number"
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={formData[key as keyof typeof formData]}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="h-10 bg-gray-50 border-gray-200 rounded-xl placeholder:text-gray-400"
            required
          />
        ))}
      </div>

      {/* SUBMIT */}
      <div className="text-right">
        <Button
          type="submit"
          className="bg-sky-600 text-white rounded-xl px-6 py-2"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
