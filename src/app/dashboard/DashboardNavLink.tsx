"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface DashboardNavLinkProps {
  href: string;
  label: string;
}

export default function DashboardNavLink({ href, label }: DashboardNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`p-2 font-medium rounded transition ${isActive ? "bg-ice-cream-300 text-black" : "text-black hover:bg-ice-cream-200"}`}
    >
      {label}
    </Link>
  );
}
