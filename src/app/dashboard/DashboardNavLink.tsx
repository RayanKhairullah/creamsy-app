"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

interface DashboardNavLinkProps {
  href: string;
  label: string;
  mobile?: boolean;
}

export default function DashboardNavLink({ href, label, mobile = false }: DashboardNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  const baseClasses = "font-medium transition-all duration-200 flex flex-col items-center";
  const activeClasses = "text-ice-cream-500";
  const inactiveClasses = "text-gray-500 hover:text-gray-700";
  
  const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  
  return (
    <Link href={href} className={classes}>
      {mobile ? (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 mb-1" 
            fill={isActive ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {label === "Produk" && (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            )}
            {label === "Kelola" && (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
            {label === "Transaksi" && (
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            )}
            {label === "Laporan" && (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
            )}
          </svg>
          <span className="text-xs">{label}</span>
        </>
      ) : (
        <>
          {label}
          {isActive && (
            <motion.div 
              layoutId="underline" 
              className="mt-1 h-0.5 w-full bg-ice-cream-500 rounded-full"
            />
          )}
        </>
      )}
    </Link>
  );
}