// src/components/JobAnalysisModal.jsx
import { useState } from "react";
import { JobService } from "../services/JobService";

const JobAnalysisModal = ({ jobId, isOpen, onClose }) => {
  const [analysisType, setAnalysisType] = useState("general");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select");
  const [error, setError] = useState(null);

  const getAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("making call");
      const response = await JobService.analyze_job(jobId, analysisType);
      setAnalysis(response.data.analysis);
      setStep("result");
    } catch (error) {
      setError("Failed to get analysis. Please try again.");
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep("select");
    setAnalysis(null);
    setError(null);
  };

  const analysisOptions = [
    {
      type: "general",
      title: "General Analysis",
      description: "Overall insights about the job posting",
    },
    {
      type: "skills",
      title: "Required Skills",
      description: "Key skills and qualifications needed",
    },
    {
      type: "cover_letter",
      title: "Cover Letter Tips",
      description: "Suggestions for your cover letter",
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="p-6">
    
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {step === "select"
                  ? "Choose Analysis Type"
                  : "Analysis Results"}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>

       
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

           
            {step === "select" ? (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {analysisOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => {
                        setAnalysisType(option.type);
                        getAnalysis();
                      }}
                      className="text-left p-4 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium block">{option.title}</span>
                      <span className="text-sm text-gray-500">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2">Analyzing job posting...</p>
                  </div>
                ) : (
                  <>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap">{analysis}</div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => setStep("select")}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                      >
                        Try Another Analysis
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobAnalysisModal;
