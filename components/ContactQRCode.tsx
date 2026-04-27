'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ContactQRCodeProps {
  size?: number;
}

export function ContactQRCode({ size = 120 }: ContactQRCodeProps) {
  // VCard 3.0 format
  const vCardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Mathéo Delaunay',
    'ORG:Seonay Studio',
    'TITLE:Next.js Developer & Digital Designer',
    'EMAIL;TYPE=work:contact@seonay.studio',
    'URL:https://seonay.com',
    'ADR;TYPE=work:;;Nantes;;;France',
    'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/matheo-delaunay/',
    'END:VCARD'
  ].join('\n');

  return (
    <div className="relative bg-white p-1 rounded-lg shadow-inner flex items-center justify-center">
      <QRCodeSVG 
        value={vCardData} 
        size={size}
        level="H" // High error correction to allow for the logo
        includeMargin={false}
        imageSettings={{
            src: "/favicon.svg",
            height: size * 0.25,
            width: size * 0.25,
            excavate: true, // Removes QR modules behind the logo
        }}
      />
    </div>
  );
}
