"use client";

import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

interface QRCodeComponentProps {
  value: string;
  size?: number;
}

export function QRCodeComponent({ value, size = 128 }: QRCodeComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading QR...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <QRCode
        value={value}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      />
    </div>
  );
}
