"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { ShoppingBag, Calendar, DollarSign, Package, Loader2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GET_RECEIPTS } from "@/lib/graphql/queries";
import {
    filterReceiptsByDateRange,
    filterReceiptsByStore,
    getUniqueStores,
    formatCurrency,
    formatDate,
    type Receipt,
    type DateRange,
} from "@/lib/filters";
import ReceiptFilters from "./receipt-filters";

export default function ReceiptGrid() {
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: undefined,
        to: undefined,
    });

    const { loading, error, data } = useQuery<{ receipts: Receipt[] }>(
        GET_RECEIPTS
    );

    const receipts = data?.receipts || [];

    // Get unique stores for filter
    const uniqueStores = useMemo(() => getUniqueStores(receipts), [receipts]);

    // Apply filters
    const filteredReceipts = useMemo(() => {
        let filtered = receipts;
        filtered = filterReceiptsByStore(filtered, selectedStore);
        filtered = filterReceiptsByDateRange(filtered, dateRange);
        return filtered;
    }, [receipts, selectedStore, dateRange]);

    const handleClearFilters = () => {
        setSelectedStore(null);
        setDateRange({ from: undefined, to: undefined });
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Loading receipts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="p-8 text-center">
                    <p className="text-destructive">Error loading receipts: {error.message}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            {receipts.length > 0 && (
                <ReceiptFilters
                    stores={uniqueStores}
                    selectedStore={selectedStore}
                    onStoreChange={setSelectedStore}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    onClearFilters={handleClearFilters}
                />
            )}

            {/* Receipt Count */}
            {receipts.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredReceipts.length} of {receipts.length} receipt
                        {receipts.length !== 1 ? "s" : ""}
                    </p>
                </div>
            )}

            {/* Receipts Grid */}
            {filteredReceipts.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-muted p-4">
                            <Package className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">
                            {receipts.length === 0
                                ? "No receipts yet"
                                : "No receipts match your filters"}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {receipts.length === 0
                                ? "Upload your first receipt to get started"
                                : "Try adjusting your filters"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredReceipts.map((receipt) => (
                        <Card
                            key={receipt.id}
                            className="group overflow-hidden transition-all hover:shadow-lg"
                        >
                            {/* Receipt Image */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                <img
                                    src={`http://localhost:4000${receipt.imageUrl}`}
                                    alt={`Receipt from ${receipt.storeName || "Unknown Store"}`}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>

                            {/* Receipt Details */}
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="line-clamp-1 text-lg">
                                        {receipt.storeName || "Unknown Store"}
                                    </CardTitle>
                                    <Badge variant="secondary" className="shrink-0">
                                        {formatCurrency(receipt.totalAmount)}
                                    </Badge>
                                </div>
                                <CardDescription className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(receipt.purchaseDate)}
                                </CardDescription>
                            </CardHeader>

                            {/* Items List */}
                            {receipt.items && receipt.items.length > 0 && (
                                <CardContent className="pt-0">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {receipt.items.length} item
                                                {receipt.items.length !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                        <ul className="space-y-1 text-sm">
                                            {receipt.items.slice(0, 3).map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="flex items-center justify-between text-muted-foreground"
                                                >
                                                    <span className="truncate">{item.name}</span>
                                                    {item.price && (
                                                        <span className="ml-2 shrink-0 font-medium">
                                                            {formatCurrency(item.price)}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                            {receipt.items.length > 3 && (
                                                <li className="text-xs text-muted-foreground">
                                                    +{receipt.items.length - 3} more
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
