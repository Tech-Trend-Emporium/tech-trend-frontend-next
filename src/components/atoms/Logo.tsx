import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
  text?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = "w-24 h-auto", text = "white", width = 96, height = 24 }: LogoProps) => {
  return (
    <Image
      src={`/logo-${text}-text.png`}
      alt="Logo"
      className={className}
      width={width}
      height={height}
      priority
    />
  );
};