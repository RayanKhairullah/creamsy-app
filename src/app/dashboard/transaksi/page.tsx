"use client";
import { useEffect, useState } from "react";
import { Transaction } from "@/types";
import { getTransactions } from "@/lib/transactionService";

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      const data = await getTransactions();
      setTransactions(data);
    }
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Daftar Transaksi</h1>
      <ul className="space-y-4">
        {transactions.map((trx) => (
          <li key={trx.id} className="p-4 bg-white rounded shadow text-black">
            <div className="font-semibold">ID: {trx.id}</div>
            <div>Total: Rp {trx.total.toLocaleString()}</div>
            <div>Metode: {trx.payment.method}</div>
            <div>Waktu: {new Date(trx.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
