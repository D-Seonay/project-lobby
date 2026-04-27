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
    'ORG:Seonay.studio',
    'TITLE:Software Engineer',
    'TEL:+33782199754',
    'EMAIL:matheodelaunay04@gmail.com',
    'URL:https://seonay.com',
    'END:VCARD'
  ].join('\n');

  return (
    <div className="relative bg-white p-1 rounded-lg shadow-inner flex items-center justify-center">
      <QRCodeSVG
        value={vCardData}
        size={size}
        level="M"
        includeMargin={size > 100} // Only include internal margin for large versions
        marginSize={2}
      />
    </div>
  );
}
