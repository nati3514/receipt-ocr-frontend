import { format, parseISO } from "date-fns";

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
 * GraphQL filter input for server-side filtering
 */
export interface ReceiptFilter {
    storeName?: string | null;
    startDate?: string | null;
    endDate?: string | null;
}

/**
 * Get unique store names from receipts (kept for local UI purposes)
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
