"use client";
import { useEffect, useState } from "react";
import { Transaction } from "@/types";
import { getTransactions } from "@/lib/transactionService";

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

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Laporan Penjualan</h1>
      <div className="mb-4">Total Pemasukan: <span className="font-bold">Rp {totalIncome.toLocaleString()}</span></div>
      <table className="w-full bg-white rounded shadow text-black">
        <thead>
          <tr>
            <th className="text-left p-2">Tanggal</th>
            <th className="text-left p-2">ID Transaksi</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Metode</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trx) => (
            <tr key={trx.id}>
              <td className="p-2">{new Date(trx.timestamp).toLocaleDateString()}</td>
              <td className="p-2">{trx.id}</td>
              <td className="p-2">Rp {trx.total.toLocaleString()}</td>
              <td className="p-2">{trx.payment.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
