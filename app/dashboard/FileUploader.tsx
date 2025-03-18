"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { processSharkData } from "./actions";
import { Upload, FileText, AlertCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface UploadResult {
  addedSharks?: number;
  addedBeaches?: number;
  addedCatches?: number;
  error: boolean;
  errorFrom?: string;
}

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setError(null);

      try {
        // Parse CSV for preview
        const content = await selectedFile.text();
        const lines = content.split("\n");

        if (lines.length > 0) {
          const headerLine = lines[0].trim();
          const csvHeaders = headerLine.split(",").map((h) => h.trim());
          setHeaders(csvHeaders);

          // Get first 5 rows for preview
          const previewRows = lines.slice(1, 6).map((line) => {
            const values = line.split(",").map((val) => val.trim());
            return csvHeaders.reduce((obj, header, index) => {
              obj[header] = values[index] || "";
              return obj;
            }, {} as Record<string, string>);
          });

          setPreviewData(previewRows);
          setShowPreview(true);
        }
      } catch (err) {
        setError("Error parsing CSV file for preview");
        console.error(err)
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDropRejected: () => {
      setError("Please upload a valid CSV file");
    },
  });

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fileContent = await file.text();
      const result = await processSharkData(fileContent);
      if (result.error) {
        if (result.errorFrom === "zod") {
          return setError(
            "Error parsing CSV file. Ensure the columns are _id, date, areaName, gearBeach, Fate, Common, Name, Species name, and there are no hidden whitespaces."
          );
        } else if (result.errorFrom === "db") {
          return setError("An error occurred during database insertion");
        } else {
          return setError("An error occurred during upload");
        }
      }
      setUploadResult(result);
      setShowPreview(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during upload"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const cancelPreview = () => {
    setShowPreview(false);
    setPreviewData([]);
    setFile(null);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Shark Data Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showPreview && !uploadResult && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-10 w-10 mb-2" />
              {file ? (
                <p className="font-medium text-foreground">
                  Selected: {file.name}
                </p>
              ) : (
                <>
                  <p className="font-medium">
                    Drag & drop a CSV file here, or click to select
                  </p>
                  <p className="text-sm">Only CSV files are supported</p>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showPreview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Preview: {file?.name}</h3>
              <Badge variant="outline" className="px-2">
                {previewData.length} of{" "}
                {file ? Math.max(0, file.size / 100).toFixed(0) : 0} rows
              </Badge>
            </div>

            <ScrollArea className="h-[300px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {headers.map((header, cellIndex) => (
                        <TableCell key={cellIndex}>{row[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="text-sm text-muted-foreground">
              <p>
                Showing first {previewData.length} rows. Confirm to process the
                entire file.
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <Progress value={45} className="h-2 w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Processing data...
            </p>
          </div>
        )}

        {uploadResult && (
          <Alert className="border-green-500 bg-green-50 text-green-900">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Upload Successful!</AlertTitle>
            <AlertDescription className="text-green-800">
              <div className="mt-2">
                <p>Added {uploadResult.addedSharks} new sharks</p>
                <p>Added {uploadResult.addedBeaches} new beaches</p>
                <p>Added {uploadResult.addedCatches} new catch records</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {showPreview && (
          <>
            <Button
              variant="outline"
              onClick={cancelPreview}
              disabled={isUploading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              <Check className="mr-2 h-4 w-4" />
              Confirm Upload
            </Button>
          </>
        )}

        {!showPreview && !uploadResult && (
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="ml-auto"
          >
            {isUploading ? "Uploading..." : "Upload Data"}
          </Button>
        )}

        {uploadResult && (
          <Button
            variant="outline"
            onClick={() => {
              setFile(null);
              setUploadResult(null);
            }}
          >
            Upload Another File
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
