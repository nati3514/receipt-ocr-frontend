"use client";

import { ApolloWrapper } from "@/lib/apollo-wrapper";
import UploadZone from "@/components/upload-zone";
import ReceiptGrid from "@/components/receipt-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    CalendarClock,
    DownloadCloud,
    Filter,
    Receipt,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const highlights = [
    {
        title: "AI-powered OCR",
        description: "Best-in-class recognition tuned for receipts, invoices, and slips.",
        icon: Sparkles,
    },
    {
        title: "Smart filters",
        description: "Slice data by store, date range, or amount in a couple of clicks.",
        icon: Filter,
    },
    {
        title: "Secure by default",
        description: "Encrypted uploads and signed URLs keep sensitive data protected.",
        icon: ShieldCheck,
    },
    {
        title: "Instant exports",
        description: "Download CSV snapshots or sync data into your finance stack.",
        icon: DownloadCloud,
    },
] as const;

export default function Home() {
    return (
        <ApolloWrapper>
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
                <header className="border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                    <Receipt className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-widest text-muted-foreground">
                                        Intelligent expense ops
                                    </p>
                                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        Receipt OCR Scanner
                                    </h1>
                                    <p className="text-base text-muted-foreground">
                                        Upload receipts once, let AI extract totals, taxes, and line-items automatically.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    New workspace experience
                                </Badge>
                                <div className="flex flex-wrap gap-3">
                                    <Button asChild size="sm">
                                        <a href="#upload">Upload a receipt</a>
                                    </Button>
                                    <Button variant="outline" asChild size="sm">
                                        <a href="#receipts">Review history</a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto space-y-12 px-4 py-10">
                    <section
                        id="upload"
                        className="grid gap-8 lg:grid-cols-[minmax(320px,420px)_1fr]"
                    >
                        <div className="space-y-6">
                            <UploadZone />

                            <Card className="border-primary/10">
                                <CardHeader>
                                    <CardTitle className="text-lg">Upload checklist</CardTitle>
                                    <CardDescription>
                                        Three quick tips to keep extraction quality high.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li className="flex gap-2">
                                            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                            Capture in natural light to reduce glare and noise.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                            Ensure totals and taxes are visible—crop generously.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                            Supported formats: JPG, PNG, WebP up to 10MB.
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {highlights.map((item) => (
                                <Card key={item.title} className="border-0 bg-card/80 shadow-lg shadow-primary/5">
                                    <CardHeader className="space-y-3">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section id="receipts" className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight">
                                    Receipt history
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Filter, audit, and export every processed receipt without leaving the page.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm text-muted-foreground">
                                <CalendarClock className="h-4 w-4" />
                                Synced in real-time
                            </div>
                        </div>

                        <ReceiptGrid />
                    </section>
                </main>

                <footer className="border-t bg-background py-6">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        <p>Built with Next.js, Apollo GraphQL, shadcn/ui, and Tailwind CSS.</p>
                    </div>
                </footer>
            </div>
        </ApolloWrapper>
    );
}
