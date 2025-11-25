"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { Upload, FileImage, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UPLOAD_RECEIPT } from "@/lib/graphql/mutations";
import { GET_RECEIPTS } from "@/lib/graphql/queries";
import { validateFile, formatFileSize } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface UploadReceiptData {
    uploadReceipt: {
        id: string;
        storeName: string | null;
        totalAmount: number | null;
    };
}

interface UploadZoneProps {
    onUploadComplete?: () => void;
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [uploadReceipt, { loading }] = useMutation<UploadReceiptData>(UPLOAD_RECEIPT, {
        refetchQueries: [
            { query: GET_RECEIPTS, variables: { filter: {} } }, // Refetch all receipts
            { query: GET_RECEIPTS }, // Also refetch with no variables
        ],
        awaitRefetchQueries: true, // Wait for refetch to complete
        onCompleted: (data) => {
            toast.success("Receipt uploaded successfully!", {
                description: `${data.uploadReceipt.storeName || "Receipt"} - $${data.uploadReceipt.totalAmount?.toFixed(2) || "0.00"}`,
            });
            setFile(null);
            setPreview(null);

            // Notify parent component
            if (onUploadComplete) {
                onUploadComplete();
            }
        },
        onError: (error) => {
            toast.error("Upload failed", {
                description: error.message,
            });
        },
    });

    const handleFileSelect = useCallback((selectedFile: File) => {
        const validation = validateFile(selectedFile);

        if (!validation.valid) {
            toast.error("Invalid file", {
                description: validation.error,
            });
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                handleFileSelect(droppedFile);
            }
        },
        [handleFileSelect]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                handleFileSelect(selectedFile);
            }
        },
        [handleFileSelect]
    );

    const handleUpload = async () => {
        if (!file) return;

        try {
            await uploadReceipt({ variables: { file } });
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    return (
        <Card className={cn(
            "border-2 border-dashed transition-colors",
            isDragging && "border-primary bg-primary/5"
        )}>
            <CardContent className="p-6">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        "flex flex-col items-center justify-center gap-4 rounded-lg p-6",
                        !file && "min-h-[200px]"
                    )}
                >
                    {!file ? (
                        <>
                            <Upload className="h-10 w-10 text-muted-foreground" />
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    Drag and drop or click to upload
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    JPG, PNG, WebP (max 10MB)
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileInput}
                                className="hidden"
                                id="file-input"
                            />
                            <label htmlFor="file-input">
                                <Button asChild>
                                    <span>Browse Files</span>
                                </Button>
                            </label>
                        </>
                    ) : (
                        <div className="w-full space-y-4">
                            {preview && (
                                <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg border">
                                    <img
                                        src={preview}
                                        alt="Receipt preview"
                                        className="h-auto w-full object-contain max-h-48"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                <div className="flex items-center gap-3">
                                    <FileImage className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                {!loading && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setFile(null);
                                            setPreview(null);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <Button
                                onClick={handleUpload}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Upload & Scan"
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
