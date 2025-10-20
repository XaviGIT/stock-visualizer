import type { StatementTab } from "$lib/types/financials.type";

export const STATEMENT_TABS: StatementTab[] = [
  {
    id: "income-statement",
    label: "Income Statement",
    icon: "💰",
  },
  {
    id: "balance-sheet",
    label: "Balance Sheet",
    icon: "⚖️",
  },
  {
    id: "cash-flow",
    label: "Cash Flow",
    icon: "💵",
  },
];

// Number formatting thresholds
export const MILLIONS = 1_000_000;
export const BILLIONS = 1_000_000_000;
export const TRILLIONS = 1_000_000_000_000;
