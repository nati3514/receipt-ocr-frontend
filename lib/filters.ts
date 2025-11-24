import { format, isAfter, isBefore, isWithinInterval, parseISO } from "date-fns";

export interface Receipt {
    id: string;
    storeName: string | null;
    totalAmount: number | null;
    purchaseDate: string | null;
    imageUrl: string;
    createdAt: string;
    items: {
        id: string;
        name: string;
        price: number | null;
        quantity: number | null;
    }[];
}

export interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

/**
 * Filter receipts by date range
 */
export function filterReceiptsByDateRange(
    receipts: Receipt[],
    dateRange: DateRange
): Receipt[] {
    if (!dateRange.from && !dateRange.to) return receipts;

    return receipts.filter((receipt) => {
        if (!receipt.purchaseDate) return false;

        const receiptDate = parseISO(receipt.purchaseDate);

        if (dateRange.from && dateRange.to) {
            return isWithinInterval(receiptDate, {
                start: dateRange.from,
                end: dateRange.to,
            });
        }

        if (dateRange.from) {
            return isAfter(receiptDate, dateRange.from) || receiptDate.getTime() === dateRange.from.getTime();
        }

        if (dateRange.to) {
            return isBefore(receiptDate, dateRange.to) || receiptDate.getTime() === dateRange.to.getTime();
        }

        return true;
    });
}

/**
 * Filter receipts by store name
 */
export function filterReceiptsByStore(
    receipts: Receipt[],
    storeName: string | null
): Receipt[] {
    if (!storeName || storeName === "all") return receipts;

    return receipts.filter(
        (receipt) =>
            receipt.storeName?.toLowerCase().includes(storeName.toLowerCase())
    );
}

/**
 * Get unique store names from receipts
 */
export function getUniqueStores(receipts: Receipt[]): string[] {
    const stores = receipts
        .map((r) => r.storeName)
        .filter((name): name is string => name !== null && name !== undefined);

    return Array.from(new Set(stores)).sort();
}

/**
 * Format currency
 */
export function formatCurrency(amount: number | null): string {
    if (amount === null || amount === undefined) return "$0.00";
    return `$${amount.toFixed(2)}`;
}

/**
 * Format date
 */
export function formatDate(dateString: string | null): string {
    if (!dateString) return "Unknown Date";
    try {
        return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
        return "Invalid Date";
    }
}
