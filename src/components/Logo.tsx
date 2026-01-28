"use client";

type LogoProps = {
  size?: number;
  className?: string;
};

export default function Logo({ size = 48, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div
        className="font-extrabold tracking-wider"
        style={{ fontSize: size }}
      >
        CMT
      </div>
    </div>
  );
}
