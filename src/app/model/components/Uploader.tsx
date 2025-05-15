"use client";

import React, { useRef, useState } from "react";
import ModelViewer from "./ModelViewer";
import ModelViewer1 from "./ModelViewer1";
import ModelViewer3 from "./ModelViewer3";

const Uploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("No file selected");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      setSelectedFile(files[0]);
      console.log("File selected:", files[0].name, "Size:", files[0].size);
    } else {
      setFileName("No file selected");
      setSelectedFile(null);
      console.log("No file selected");
    }
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
    console.log("Div clicked, opening file picker");
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      setIsUploaded(true);
      console.log(
        "Upload button clicked, showing ModelViewer for:",
        selectedFile.name
      );
    }
  };

  return (
    <section className="bg-black flex items-center justify-center min-h-screen">
      {isUploaded && selectedFile ? (
        // <ModelViewer file={selectedFile} />
        // <ModelViewer1 file={selectedFile} />
        <ModelViewer3 file={selectedFile} />
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Upload Your File
          </h2>
          <div
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
            onClick={handleDivClick}
          >
            <svg
              className="w-16 h-16 text-blue-500 mb-4 transition-all duration-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".stl,.step,.stp,.obj"
            />
            <label
              htmlFor="file-upload"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-600 text-center hover:text-blue-600 transition-all duration-300"
            >
              <span className="block text-xl font-medium">
                Drag & Drop your file here
              </span>
              <span className="block text-sm text-gray-400">
                Or click to browse
              </span>
              <span className="block text-xs text-gray-400 mt-1">
                Supported formats: .stl, .step, .stp, .obj
              </span>
            </label>
            <div
              id="file-name"
              className={`mt-3 text-gray-700 text-sm font-medium ${
                fileName === "No file selected" ? "hidden" : ""
              }`}
            >
              {fileName}
            </div>
          </div>
          <button
            id="upload-btn"
            className="w-full mt-6 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
            disabled={fileName === "No file selected"}
            onClick={handleUploadClick}
          >
            Upload
          </button>
        </div>
      )}
    </section>
  );
};

export default Uploader;
