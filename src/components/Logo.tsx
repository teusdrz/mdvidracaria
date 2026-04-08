"use client";

import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
  variant?: "dark" | "light";
}

export default function Logo({ size = 48, className = "", variant = "dark" }: LogoProps) {
  return (
    <Image
      src="/logo-mc.png"
      alt="MC Vidracaria"
      width={size}
      height={size}
      className={`object-contain ${variant === "light" ? "brightness-0 invert" : ""} ${className}`}
      priority
    />
  );
}
