import React from "react";
import QRCode from "qrcode.react";

interface QRCodeGeneratorProps {
  qrCodeData: string;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ qrCodeData = "", className }) => {
  return (
    <div className={`qr-code ${className}`}>
      <QRCode value={qrCodeData} />
    </div>
  );
};

export default QRCodeGenerator;
