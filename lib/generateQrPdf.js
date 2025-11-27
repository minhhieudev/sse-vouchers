import jsPDF from "jspdf";

/**
 * Generate PDF from QR codes data
 * @param {Array} qrCodes - Array of QR code objects with structure: { code, qr_url, qr_data }
 * @param {string} filename - Output filename for the PDF
 * @returns {Promise<Blob>} - PDF file as blob
 */
export async function generateQrPdf(qrCodes, filename = "qr-codes.pdf") {
  if (!qrCodes || qrCodes.length === 0) {
    throw new Error("No QR codes provided");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  
  // Layout: 2 columns per row, 3 rows per page
  const cols = 2;
  const rows = 3;
  const qrSize = (contentWidth - margin) / cols; // Size of each QR code box

  let qrIndex = 0;
  let pageNumber = 0;

  // Add title on first page
  pdf.setFontSize(16);
  pdf.text("Voucher QR Codes", pageWidth / 2, 15, { align: "center" });
  pdf.setFontSize(10);

  let currentY = 25;

  // Load all images first
  const imagePromises = qrCodes.map((item) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve({ code: item.code, img });
      img.onerror = () => resolve({ code: item.code, img: null });
      img.src = item.qr_url;
    });
  });

  const loadedImages = await Promise.all(imagePromises);

  // Add QR codes to PDF
  for (let i = 0; i < loadedImages.length; i++) {
    const { code, img } = loadedImages[i];
    const row = (i % (cols * rows)) / cols;
    const col = i % cols;

    // Check if we need a new page
    if (i > 0 && i % (cols * rows) === 0) {
      pdf.addPage();
      currentY = margin;
    }

    // Calculate position
    const x = margin + col * (contentWidth / cols);
    const y = margin + 25 + row * (qrSize + 5);

    // Draw box border
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(x, y, qrSize - 2, qrSize - 2);

    // Add code text
    pdf.setFontSize(9);
    pdf.text(code || "N/A", x + (qrSize - 2) / 2, y + 5, { align: "center" });

    // Add QR image
    if (img) {
      try {
        const qrImageSize = qrSize - 22;
        pdf.addImage(img, "PNG", x + 1, y + 8, qrImageSize, qrImageSize);
      } catch (error) {
        console.error("Failed to add QR image:", error);
      }
    }
  }

  // Convert PDF to blob
  const pdfBlob = pdf.output("blob");
  return pdfBlob;
}
