"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { Upload, FileImage, Loader2, CheckCircle2 } from "lucide-react";
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

export default function UploadZone() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [uploadReceipt, { loading }] = useMutation<UploadReceiptData>(UPLOAD_RECEIPT, {
        refetchQueries: [{ query: GET_RECEIPTS }],
        onCompleted: (data) => {
            toast.success("Receipt uploaded successfully!", {
                description: `Extracted data from ${data.uploadReceipt.storeName || "receipt"}`,
            });
            setFile(null);
            setPreview(null);
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

        // Create preview
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
        <Card className="border-2 border-dashed transition-colors hover:border-primary/50">
            <CardContent className="p-8">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        "relative flex flex-col items-center justify-center gap-4 rounded-lg p-8 transition-all",
                        isDragging && "bg-primary/5 scale-[1.02]",
                        !file && "min-h-[300px]"
                    )}
                >
                    {!file ? (
                        <>
                            <div className="rounded-full bg-primary/10 p-4">
                                <Upload className="h-10 w-10 text-primary" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">Upload Receipt</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Drag and drop your receipt image here, or click to browse
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Supports: JPG, PNG, WebP (max 10MB)
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
                                <div className="relative mx-auto max-w-md overflow-hidden rounded-lg border">
                                    <img
                                        src={preview}
                                        alt="Receipt preview"
                                        className="h-auto w-full object-contain"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                                <div className="flex items-center gap-3">
                                    <FileImage className="h-8 w-8 text-primary" />
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">
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
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <Button
                                onClick={handleUpload}
                                disabled={loading}
                                className="w-full"
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Upload & Scan Receipt
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
