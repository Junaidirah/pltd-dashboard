"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface InputFormData {
  lokasi: string;
  alat: string;
  load: string;
  dmSiang: string;
  dmMalam: string;
}

interface InputFormProps {
  onSubmit?: (data: InputFormData) => void;
}

const lokasiOptions = [
  { value: "jakarta", label: "Jakarta" },
  { value: "bandung", label: "Bandung" },
  { value: "surabaya", label: "Surabaya" },
  { value: "medan", label: "Medan" },
  { value: "makassar", label: "Makassar" },
];

const alatOptions = [
  { value: "generator-1", label: "Generator 1" },
  { value: "generator-2", label: "Generator 2" },
  { value: "transformer-1", label: "Transformer 1" },
  { value: "transformer-2", label: "Transformer 2" },
  { value: "turbine-1", label: "Turbine 1" },
];

export default function InputForm({ onSubmit }: InputFormProps) {
  const [formData, setFormData] = useState<InputFormData>({
    lokasi: "",
    alat: "",
    load: "",
    dmSiang: "",
    dmMalam: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: keyof InputFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Dropdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-2">
            <Select
              onValueChange={(value) => handleInputChange("lokasi", value)}
            >
              <SelectTrigger className="h-10 lg:h-12 bg-gray-50 border-gray-200 rounded-xl text-sm lg:text-base">
                <SelectValue placeholder="Lokasi" />
              </SelectTrigger>
              <SelectContent>
                {lokasiOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select onValueChange={(value) => handleInputChange("alat", value)}>
              <SelectTrigger className="h-10 lg:h-12 bg-gray-50 border-gray-200 rounded-xl text-sm lg:text-base">
                <SelectValue placeholder="Alat" />
              </SelectTrigger>
              <SelectContent>
                {alatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Input Data Section */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-700">
            Input Data
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* Load Input */}
            <div className="space-y-3">
              <div className="bg-sky-300 text-white text-center py-2 lg:py-3 rounded-xl font-medium text-sm lg:text-base">
                Load
              </div>
              <Input
                type="number"
                placeholder="Beban"
                value={formData.load}
                onChange={(e) => handleInputChange("load", e.target.value)}
                className="h-10 lg:h-12 bg-gray-50 border-gray-200 rounded-xl placeholder:text-gray-400 text-sm lg:text-base"
              />
            </div>

            {/* DM Siang Input */}
            <div className="space-y-3">
              <div className="bg-sky-300 text-white text-center py-2 lg:py-3 rounded-xl font-medium text-sm lg:text-base">
                DM Siang
              </div>
              <Input
                type="number"
                placeholder="Beban"
                value={formData.dmSiang}
                onChange={(e) => handleInputChange("dmSiang", e.target.value)}
                className="h-10 lg:h-12 bg-gray-50 border-gray-200 rounded-xl placeholder:text-gray-400 text-sm lg:text-base"
              />
            </div>

            {/* DM Malam Input */}
            <div className="space-y-3">
              <div className="bg-sky-300 text-white text-center py-2 lg:py-3 rounded-xl font-medium text-sm lg:text-base">
                DM Malam
              </div>
              <Input
                type="number"
                placeholder="Beban"
                value={formData.dmMalam}
                onChange={(e) => handleInputChange("dmMalam", e.target.value)}
                className="h-10 lg:h-12 bg-gray-50 border-gray-200 rounded-xl placeholder:text-gray-400 text-sm lg:text-base"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-xl font-medium text-sm lg:text-base h-auto w-full md:w-auto"
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}
