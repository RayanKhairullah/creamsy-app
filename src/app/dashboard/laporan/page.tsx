"use client";
import { useEffect, useState } from "react";
import { Transaction } from "@/types";
import { getTransactions } from "@/lib/transactionService";
import * as XLSX from 'xlsx';

export default function LaporanPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    async function fetchTransactions() {
      const data = await getTransactions();
      setTransactions(data);
      setTotalIncome(data.reduce((sum, trx) => sum + trx.total, 0));
    }
    fetchTransactions();
  }, []);

  // XLSX export handler
  const handleExport = () => {
    const dataForExport = transactions.map(trx => ({
      Tanggal: new Date(trx.timestamp).toLocaleDateString(),
      'ID Transaksi': trx.id,
      Total: trx.total,
      Metode: trx.payment.method
    }));
    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Penjualan');
    XLSX.writeFile(wb, 'laporan-penjualan.xlsx');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-ice-cream-700">Laporan Penjualan</h1>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow font-semibold transition"
        >
          Export Excel
        </button>
      </div>
      <div className="mb-4 text-lg">Total Pemasukan: <span className="font-bold text-ice-cream-600">Rp {totalIncome.toLocaleString()}</span></div>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white text-black border border-gray-200">
          <thead className="bg-ice-cream-100">
            <tr>
              <th className="text-left p-3 border-b font-semibold">Tanggal</th>
              <th className="text-left p-3 border-b font-semibold">ID Transaksi</th>
              <th className="text-left p-3 border-b font-semibold">Total</th>
              <th className="text-left p-3 border-b font-semibold">Metode</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, idx) => (
              <tr key={trx.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 border-b">{new Date(trx.timestamp).toLocaleDateString()}</td>
                <td className="p-3 border-b font-mono text-xs">{trx.id}</td>
                <td className="p-3 border-b text-right">Rp {trx.total.toLocaleString()}</td>
                <td className="p-3 border-b">{trx.payment.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
