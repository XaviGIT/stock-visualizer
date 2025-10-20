import { BILLIONS, MILLIONS, TRILLIONS } from "$lib/constants/financials";

/**
 * Format a number as currency with proper scaling
 * Examples: 1500000000 -> "$1.5B", 250000000 -> "$250M"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const absValue = Math.abs(value);
  const isNegative = value < 0;
  const sign = isNegative ? "-" : "";

  if (absValue >= TRILLIONS) {
    return `${sign}$${(absValue / TRILLIONS).toFixed(2)}T`;
  } else if (absValue >= BILLIONS) {
    return `${sign}$${(absValue / BILLIONS).toFixed(2)}B`;
  } else if (absValue >= MILLIONS) {
    return `${sign}$${(absValue / MILLIONS).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(1)}K`;
  } else {
    return `${sign}$${absValue.toFixed(0)}`;
  }
}

/**
 * Format large numbers with commas
 * Example: 1500000 -> "1,500,000"
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return value.toLocaleString("en-US");
}

/**
 * Format a percentage
 * Example: 0.125 -> "12.5%", 25 -> "25.0%"
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined) {
    return "—";
  }

  // Handle both decimal (0.125) and whole number (12.5) formats
  const percentage = value < 1 && value > -1 ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Calculate Year-over-Year change percentage
 * Example: current=100, previous=80 -> 25.0
 */
export function calculateYoYChange(
  current: number | null | undefined,
  previous: number | null | undefined
): number | null {
  if (
    current === null ||
    current === undefined ||
    previous === null ||
    previous === undefined ||
    previous === 0
  ) {
    return null;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Format a date string from ISO format
 * Example: "2024-09-30" -> "Sep 2024" or "Q3 2024"
 */
export function formatPeriodDate(
  dateString: string,
  format: "short" | "long" = "short"
): string {
  const date = new Date(dateString);

  if (format === "long") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Short format: "Sep 2024"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

/**
 * Get fiscal year from period date
 * Example: "2024-09-30" -> "FY 2024"
 */
export function getFiscalYear(dateString: string): string {
  const date = new Date(dateString);
  return `FY ${date.getFullYear()}`;
}
