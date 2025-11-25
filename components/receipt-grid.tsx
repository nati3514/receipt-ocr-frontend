"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState, useEffect } from "react";
import { ShoppingBag, Calendar, Package, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GET_RECEIPTS } from "@/lib/graphql/queries";
import {
    getUniqueStores,
    formatCurrency,
    formatDate,
    type Receipt,
    type DateRange,
    type ReceiptFilter,
} from "@/lib/filters";
import { getImageUrl } from "@/lib/config/endpoints";
import ReceiptFilters from "./receipt-filters";
import Pagination from "./pagination";

interface ReceiptGridProps {
    refreshTrigger?: number;
}

export default function ReceiptGrid({ refreshTrigger }: ReceiptGridProps) {
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: undefined,
        to: undefined,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

    // Build filter object for GraphQL query
    const filter: ReceiptFilter = {
        storeName: selectedStore && selectedStore !== "all" ? selectedStore : null,
        startDate: dateRange.from ? dateRange.from.toISOString() : null,
        endDate: dateRange.to ? dateRange.to.toISOString() : null,
    };

    // Query with server-side filtering
    const { loading, error, data, refetch } = useQuery<{ receipts: Receipt[] }>(
        GET_RECEIPTS,
        {
            variables: { filter },
            fetchPolicy: "cache-and-network",
            notifyOnNetworkStatusChange: true,
        }
    );

    const receipts = data?.receipts || [];

    // Get unique stores for filter dropdown
    const { data: allReceiptsData, refetch: refetchAllReceipts } = useQuery<{ receipts: Receipt[] }>(
        GET_RECEIPTS,
        {
            variables: { filter: {} },
            fetchPolicy: "cache-and-network",
        }
    );
    const uniqueStores = useMemo(
        () => getUniqueStores(allReceiptsData?.receipts || []),
        [allReceiptsData]
    );

    // Reset to first page and refetch when new upload happens
    useEffect(() => {
        if (refreshTrigger !== undefined && refreshTrigger > 0) {
            setCurrentPage(1);
            refetch();
            refetchAllReceipts();
        }
    }, [refreshTrigger, refetch, refetchAllReceipts]);

    // Client-side pagination
    const totalPages = Math.ceil(receipts.length / pageSize);
    const paginatedReceipts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return receipts.slice(startIndex, startIndex + pageSize);
    }, [receipts, currentPage, pageSize]);

    const handleClearFilters = () => {
        setSelectedStore(null);
        setDateRange({ from: undefined, to: undefined });
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const toggleCardExpansion = (receiptId: string) => {
        setExpandedCards((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(receiptId)) {
                newSet.delete(receiptId);
            } else {
                newSet.add(receiptId);
            }
            return newSet;
        });
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStore, dateRange.from, dateRange.to]);

    if (loading && receipts.length === 0) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">Loading receipts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="p-6 text-center">
                    <p className="text-sm text-destructive">Error: {error.message}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            {(allReceiptsData?.receipts.length || 0) > 0 && (
                <ReceiptFilters
                    stores={uniqueStores}
                    selectedStore={selectedStore}
                    onStoreChange={setSelectedStore}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    onClearFilters={handleClearFilters}
                />
            )}

            {/* Receipts Grid */}
            {receipts.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
                        <Package className="h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-base font-semibold">
                            {(allReceiptsData?.receipts.length || 0) === 0
                                ? "No receipts yet"
                                : "No receipts match your filters"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {(allReceiptsData?.receipts.length || 0) === 0
                                ? "Upload your first receipt to get started"
                                : "Try adjusting your filters"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {paginatedReceipts.map((receipt) => {
                            const isExpanded = expandedCards.has(receipt.id);
                            const hasMoreItems = receipt.items && receipt.items.length > 2;
                            const itemsToShow = isExpanded ? receipt.items : receipt.items?.slice(0, 2);

                            return (
                                <Card
                                    key={receipt.id}
                                    className="group overflow-hidden transition-all hover:shadow-md"
                                >
                                    {/* Receipt Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                        <img
                                            src={getImageUrl(receipt.imageUrl)}
                                            alt={`Receipt from ${receipt.storeName || "Unknown Store"}`}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Receipt Details */}
                                    <CardHeader className="p-3 pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="line-clamp-1 text-sm font-semibold">
                                                {receipt.storeName || "Unknown Store"}
                                            </CardTitle>
                                            <Badge variant="secondary" className="shrink-0 text-xs">
                                                {formatCurrency(receipt.totalAmount)}
                                            </Badge>
                                        </div>
                                        <CardDescription className="flex items-center gap-1 text-xs">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(receipt.purchaseDate)}
                                        </CardDescription>
                                    </CardHeader>

                                    {/* Items List */}
                                    {receipt.items && receipt.items.length > 0 && (
                                        <CardContent className="p-3 pt-0">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                                    <ShoppingBag className="h-3 w-3" />
                                                    <span>
                                                        {receipt.items.length} item{receipt.items.length !== 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                                <ul className="space-y-0.5 text-xs">
                                                    {itemsToShow?.map((item) => (
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
                                                </ul>
                                                {hasMoreItems && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-full text-xs mt-1"
                                                        onClick={() => toggleCardExpansion(receipt.id)}
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <ChevronUp className="h-3 w-3 mr-1" />
                                                                Show less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="h-3 w-3 mr-1" />
                                                                +{receipt.items.length - 2} more
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={receipts.length}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}
