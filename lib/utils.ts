import dayjs from "dayjs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateItem = (date: Date | string) => {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};

export const hyphenformatDateItem = (date: Date | string) => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
};

export const dashedDateItem = (date: Date | string) => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
};

export const getTimeFromDate = (date: Date | string) => {
  if (!date) return "";
  return dayjs(date).format("HH:mm");
};

export const handleShareImage = async (
  receiptRef: React.RefObject<HTMLDivElement>
) => {
  try {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current);
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], "receipt.png", { type: blob.type });
          await navigator.share({
            title: "Receipt",
            text: "Cupay payment receipt",
            files: [file],
          });
        } else {
          // console.log("Sharing not supported or capture failed");
        }
      }, "image/png");
    }
  } catch (error) {
    // console.error("Error capturing or sharing the image:", error);
  }
};

// Function to handle sharing a PDF
export const handleSharePDF = async (
  receiptRef: React.RefObject<HTMLDivElement>
) => {
  try {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      const pdfBlob = pdf.output("blob");

      if (navigator.share) {
        const file = new File([pdfBlob], "receipt.pdf", {
          type: "application/pdf",
        });
        await navigator.share({
          title: "Receipt",
          text: "Invoice",
          files: [file],
        });
      } else {
        // console.log("Sharing not supported or PDF generation failed");
      }
    }
  } catch (error) {
    // console.error("Error generating or sharing the PDF:", error);
  }
};

// Function to handle printing
export const handlePrint = (receiptRef: React.RefObject<HTMLDivElement>) => {
  if (receiptRef.current) {
    const printWindow = window.open("", "", "height=800,width=800");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(
        "<html><head><title>Print Receipt</title></head><body>"
      );
      printWindow.document.write(receiptRef.current.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }
};

export const handleDownloadImage = async (
  receiptRef: React.RefObject<HTMLDivElement>
) => {
  if (receiptRef.current) {
    const canvas = await html2canvas(receiptRef.current);
    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = "receipt.png";
    link.click();
  }
};

export const handleDownloadPDF = async (
  receiptRef: React.RefObject<HTMLDivElement>
) => {
  if (receiptRef.current) {
    const canvas = await html2canvas(receiptRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("receipt.pdf");
  }
};
