"use client";

import { useState } from "react";
import { X, Printer, FileText, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ReportModal() {
  const { isReportModalOpen, setIsReportModalOpen, sizingResult, selectedCity, selectedProvince } = useApp();
  const [reportHtml, setReportHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isReportModalOpen) return null;

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "Valued Customer",
          city: selectedCity,
          province: selectedProvince,
          siteType: sizingResult?.siteType || "Farm",
          systemKW: sizingResult?.systemKW || 18,
          batteryCapacityKWh: sizingResult?.batteryCapacityKWh || 24,
          totalCostPKR: sizingResult?.totalCostPKR || 3200000,
          annualSavingsPKR: sizingResult?.annualSavingsPKR || 750000,
          paybackYears: sizingResult?.paybackYears || 4.2,
          disco: sizingResult?.disco || "MEPCO",
          aiNarrative: sizingResult?.aiNarrative || "",
        }),
      });
      const data = await res.json();
      setReportHtml(data.htmlReport);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && reportHtml) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-forest-green px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sun-gold" />
            <h3 className="font-semibold text-lg">Bankable Feasibility Report Generator</h3>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!reportHtml ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-forest-green/10 text-forest-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-forest-green" />
              </div>
              <h4 className="font-bold text-xl text-text-dark">Ready to Generate Official Feasibility Document</h4>
              <p className="text-text-muted text-sm max-w-md mx-auto">
                Your report includes NEPRA tariff breakdown, Meezan Bank Islamic financing schedule, 25-year cash flows, and executive summary for {selectedCity}.
              </p>
              <button
                onClick={generateReport}
                disabled={loading}
                className="bg-sun-gold text-bg-deep font-bold px-8 py-3 rounded-xl hover:brightness-110 transition-all shadow-md text-sm"
              >
                {loading ? "Generating Report..." : "Generate Official PDF Report"}
              </button>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[60vh] overflow-y-auto">
              <iframe
                srcDoc={reportHtml}
                title="Feasibility Report"
                className="w-full h-[600px] border-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {reportHtml && (
          <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-500">Document ready for bank submission</span>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="bg-forest-green text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm hover:brightness-110"
              >
                <Printer className="w-4 h-4" />
                Print / Save as PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
