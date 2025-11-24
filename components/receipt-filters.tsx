"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/lib/filters";

interface ReceiptFiltersProps {
    stores: string[];
    selectedStore: string | null;
    onStoreChange: (store: string | null) => void;
    dateRange: DateRange;
    onDateRangeChange: (range: DateRange) => void;
    onClearFilters: () => void;
}

export default function ReceiptFilters({
    stores,
    selectedStore,
    onStoreChange,
    dateRange,
    onDateRangeChange,
    onClearFilters,
}: ReceiptFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeFilterCount =
        (selectedStore && selectedStore !== "all" ? 1 : 0) +
        (dateRange.from || dateRange.to ? 1 : 0);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold">Filters</h3>
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary">{activeFilterCount}</Badge>
                        )}
                    </div>

                    <div className="flex flex-1 flex-wrap items-center gap-3">
                        {/* Store Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <Label htmlFor="store-select" className="sr-only">
                                Filter by store
                            </Label>
                            <Select
                                value={selectedStore || "all"}
                                onValueChange={(value) =>
                                    onStoreChange(value === "all" ? null : value)
                                }
                            >
                                <SelectTrigger id="store-select">
                                    <SelectValue placeholder="All Stores" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Stores</SelectItem>
                                    {stores.map((store) => (
                                        <SelectItem key={store} value={store}>
                                            {store}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range Filter */}
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "min-w-[240px] justify-start text-left font-normal",
                                        !dateRange.from && !dateRange.to && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                                                {format(dateRange.to, "MMM dd, yyyy")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "MMM dd, yyyy")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange.from}
                                    selected={{
                                        from: dateRange.from,
                                        to: dateRange.to,
                                    }}
                                    onSelect={(range) => {
                                        onDateRangeChange({
                                            from: range?.from,
                                            to: range?.to,
                                        });
                                    }}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Clear Filters */}
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearFilters}
                                className="gap-1"
                            >
                                <X className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
