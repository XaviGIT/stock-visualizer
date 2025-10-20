// Base fields that all financial statements share
interface BaseFinancialStatement {
  id: string;
  companyId: string;
  periodDate: string;
  createdAt: string;
  updatedAt: string;
}

// Balance Sheet
export interface BalanceSheet extends BaseFinancialStatement {
  // Current Assets
  cashAndEquivalents: number | null;
  accountsReceivable: number | null;
  inventories: number | null;
  otherCurrentAssets: number | null;
  totalCurrentAssets: number | null;

  // Non-Current Assets
  investiments: number | null; // Note: typo in DB schema
  propertyPlantEquipment: number | null;
  goodwill: number | null;
  intangibleAssets: number | null;
  otherAssets: number | null;
  totalAssets: number | null;

  // Current Liabilities
  shortTermDebt: number | null;
  accountsPayable: number | null;
  payroll: number | null;
  incomeTaxes: number | null;
  otherCurrentLiabilities: number | null;
  totalCurrentLiabilities: number | null;

  // Non-Current Liabilities
  longTermDebt: number | null;
  otherLiabilities: number | null;
  totalLiabilities: number | null;

  // Equity
  commonStock: number | null;
  retainedCapital: number | null;
  accumulatedCompreensiveIncome: number | null;
  totalStakeholdersEquity: number | null;
  totalLiabilitiesAndStakeholdersEquity: number | null;
}

// Income Statement
export interface IncomeStatement extends BaseFinancialStatement {
  // Revenue & Cost
  netSales: number | null;
  costOfGoodsSold: number | null;
  grossProfit: number | null;

  // Operating Expenses
  sellingGeneralAdministrative: number | null;
  researchAndDevelopment: number | null;
  otherExpensesIncome: number | null;
  operatingIncome: number | null;

  // Non-Operating Items
  interestExpense: number | null;
  otherIncomeExpense: number | null;
  pretaxIncome: number | null;

  // Net Income
  incomeTaxes: number | null;
  netIncome: number | null;

  // Per Share Data
  epsBasic: string | null; // Decimal in DB
  epsDiluted: string | null; // Decimal in DB
  weightedAvgSharesOutstanding: number | null;
  weightedAvgSharesOutstandingDiluted: number | null;
}

// Cash Flow Statement
export interface CashFlowStatement extends BaseFinancialStatement {
  // Operating Activities
  netIncome: number | null;
  depreciationAmortization: number | null;
  deferredIncomeTax: number | null;
  pensionContribution: number | null;

  // Changes in Working Capital
  accountsReceivableChange: number | null;
  inventoriesChange: number | null;
  otherCurrentAssetsChange: number | null;
  otherAssetsChange: number | null;
  accountsPayableChange: number | null;
  otherLiabilitiesChange: number | null;
  netCashFromOperations: number | null;

  // Investing Activities
  capitalExpenditures: number | null;
  acquisitions: number | null;
  assetSales: number | null;
  otherInvestingActivities: number | null;
  netCashFromInvesting: number | null;
}

// API Response Type
export interface FinancialStatementsResponse {
  ticker: string;
  companyName: string | null;
  balanceSheets: BalanceSheet[];
  incomeStatements: IncomeStatement[];
  cashFlows: CashFlowStatement[];
  metadata: {
    balanceSheetsCount: number;
    incomeStatementsCount: number;
    cashFlowsCount: number;
    oldestPeriod: string | null;
    latestPeriod: string | null;
  };
}

// Helper types for displaying financial statements
export type StatementType = "balance-sheet" | "income-statement" | "cash-flow";

export interface StatementTab {
  id: StatementType;
  label: string;
  icon: string;
}

// For table row display
export interface FinancialRow {
  label: string;
  key: string;
  values: (number | null)[];
  isSubtotal?: boolean;
  isTotal?: boolean;
  isHeader?: boolean;
  indent?: number;
}

// For grouping rows into sections
export interface FinancialSection {
  title: string;
  rows: FinancialRow[];
}
