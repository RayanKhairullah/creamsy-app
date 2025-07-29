"use client";
import { useState } from "react";
import { Topping } from '@/types';

interface VariationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (variation: { container: string; toppings: Topping[] }) => void;
  toppings: Topping[];
}


export default function VariationModal({ 
  open, 
  onClose, 
  onConfirm, 
  toppings 
}: VariationModalProps) {
  const [container, setContainer] = useState("cup");
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

  if (!open) return null;

  const handleToppingChange = (topping: Topping) => {
    if (selectedToppings.some(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleConfirm = () => {
    onConfirm({ container, toppings: selectedToppings });
    setSelectedToppings([]);
    setContainer("cup");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative text-black">
        <div className="mb-4">
          <div className="text-lg font-bold mb-2">Pilih Wadah</div>
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="container"
                value="cup"
                checked={container === "cup"}
                onChange={() => setContainer("cup")}
              />
              Cup
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="container"
                value="cone"
                checked={container === "cone"}
                onChange={() => setContainer("cone")}
              />
              Cone
            </label>
          </div>
          <div className="text-lg font-bold mb-2">Topping</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {toppings.map((topping) => (
              <label key={topping.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedToppings.some(t => t.id === topping.id)}
                  onChange={() => handleToppingChange(topping)}
                />
                {topping.name} <span className="text-xs text-gray-500">+Rp {topping.price.toLocaleString()}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div className="bg-ice-cream-500 h-2 rounded-full" style={{ width: "50%" }} />
          </div>
          <div className="text-xs text-center">Langkah 2/4</div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 font-semibold">Batal</button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-ice-cream-500 text-black font-bold"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
