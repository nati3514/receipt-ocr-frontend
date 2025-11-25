"use client";

import { useState } from "react";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import UploadZone from "@/components/upload-zone";
import ReceiptGrid from "@/components/receipt-grid";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

export default function Home() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadComplete = () => {
        // Increment trigger to force refresh
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <ApolloWrapper>
            <div className="min-h-screen bg-background">
                {/* Simplified Header */}
                <header className="border-b bg-card">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary p-2">
                                    <Receipt className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Receipt OCR</h1>
                                    <p className="text-sm text-muted-foreground">
                                        Upload and manage receipts
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button asChild size="sm">
                                    <a href="#upload">Upload</a>
                                </Button>
                                <Button variant="outline" asChild size="sm">
                                    <a href="#receipts">Receipts</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8 space-y-8">
                    {/* Upload Section */}
                    <section id="upload">
                        <UploadZone onUploadComplete={handleUploadComplete} />
                    </section>

                    {/* Receipt History Section */}
                    <section id="receipts" className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">Receipts</h2>
                            <p className="text-sm text-muted-foreground">
                                Filter and view your uploaded receipts
                            </p>
                        </div>
                        <ReceiptGrid refreshTrigger={refreshTrigger} />
                    </section>
                </main>
            </div>
        </ApolloWrapper>
    );
}
