import React from "react";
import QRCode from "qrcode.react";

interface QRCodeGeneratorProps {
  qrCodeData: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ qrCodeData }) => {
  return (
    <div>
      <QRCode value={qrCodeData} />
    </div>
  );
};

export default QRCodeGenerator;
