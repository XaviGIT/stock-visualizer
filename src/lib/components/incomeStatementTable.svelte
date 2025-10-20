<script lang="ts">
  import type { IncomeStatement } from "$lib/types/financials.type";
  import { formatCurrency, getFiscalYear } from "$lib/utils/formatters";

  export let data: IncomeStatement[];

  // Get periods (up to 5 most recent)
  $: periods = data.slice(0, 5);
  $: periodHeaders = periods.map((d) => getFiscalYear(d.periodDate));

  function getValues(key: keyof IncomeStatement): (number | null)[] {
    return periods.map((period) => period[key] as number | null);
  }
</script>

<div class="table-container">
  <div class="table-wrapper">
    <table class="financial-table">
      <thead>
        <tr>
          <th class="row-label">Income Statement</th>
          {#each periodHeaders as header}
            <th class="period-header">{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <!-- Revenue Section -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Revenue</td>
        </tr>
        <tr>
          <td class="row-label indent-1">Net Sales / Revenue</td>
          {#each getValues("netSales") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Cost of Goods Sold</td>
          {#each getValues("costOfGoodsSold") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="subtotal-row">
          <td class="row-label indent-1"><strong>Gross Profit</strong></td>
          {#each getValues("grossProfit") as value}
            <td class="number-cell"><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Operating Expenses Section -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Operating Expenses</td>
        </tr>
        <tr>
          <td class="row-label indent-1">Selling, General & Administrative</td>
          {#each getValues("sellingGeneralAdministrative") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Research & Development</td>
          {#each getValues("researchAndDevelopment") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Other Expenses / (Income)</td>
          {#each getValues("otherExpensesIncome") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="subtotal-row">
          <td class="row-label indent-1"><strong>Operating Income</strong></td>
          {#each getValues("operatingIncome") as value}
            <td class="number-cell"><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Non-Operating Section -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Non-Operating Items</td>
        </tr>
        <tr>
          <td class="row-label indent-1">Interest Expense</td>
          {#each getValues("interestExpense") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Other Income / (Expense)</td>
          {#each getValues("otherIncomeExpense") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="subtotal-row">
          <td class="row-label indent-1"><strong>Pre-Tax Income</strong></td>
          {#each getValues("pretaxIncome") as value}
            <td class="number-cell"><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Net Income Section -->
        <tr>
          <td class="row-label indent-1">Income Taxes</td>
          {#each getValues("incomeTaxes") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="total-row">
          <td class="row-label"><strong>Net Income</strong></td>
          {#each getValues("netIncome") as value}
            <td class="number-cell total"
              ><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Per Share Data -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Per Share Data</td>
        </tr>
        <tr>
          <td class="row-label indent-1">EPS (Basic)</td>
          {#each periods as period}
            <td class="number-cell">
              {period.epsBasic
                ? `$${parseFloat(period.epsBasic).toFixed(2)}`
                : "—"}
            </td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">EPS (Diluted)</td>
          {#each periods as period}
            <td class="number-cell">
              {period.epsDiluted
                ? `$${parseFloat(period.epsDiluted).toFixed(2)}`
                : "—"}
            </td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Shares Outstanding (Weighted Avg)</td>
          {#each getValues("weightedAvgSharesOutstanding") as value}
            <td class="number-cell">
              {value ? (value / 1_000_000).toFixed(0) + "M" : "—"}
            </td>
          {/each}
        </tr>
      </tbody>
    </table>
  </div>

  <div class="table-footer">
    <p>All values in millions unless otherwise noted</p>
  </div>
</div>

<style>
  .table-container {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
    overflow: hidden;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .financial-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  /* Headers */
  thead tr {
    background: var(--bg-secondary);
    border-bottom: 2px solid var(--border-color);
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 700;
    color: var(--text-primary);
    position: sticky;
    top: 0;
    background: var(--bg-secondary);
    z-index: 10;
  }

  th.row-label {
    text-align: left;
    min-width: 280px;
  }

  th.period-header {
    text-align: right;
    min-width: 120px;
  }

  /* Body Rows */
  tbody tr {
    border-bottom: 1px solid var(--border-color);
  }

  tbody tr:hover {
    background: var(--bg-secondary);
  }

  td {
    padding: 0.75rem 1rem;
    color: var(--text-secondary);
  }

  .row-label {
    text-align: left;
    font-weight: 500;
    color: var(--text-primary);
  }

  .indent-1 {
    padding-left: 2rem;
  }

  .number-cell {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
      "Courier New", monospace;
  }

  /* Section Headers */
  .section-header td {
    background: var(--bg-secondary);
    font-weight: 700;
    color: var(--accent-primary);
    padding: 0.875rem 1rem;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }

  /* Subtotals and Totals */
  .subtotal-row {
    background: rgba(88, 129, 87, 0.05);
  }

  .subtotal-row td {
    font-weight: 600;
    color: var(--text-primary);
  }

  .total-row {
    background: rgba(88, 129, 87, 0.1);
    border-top: 2px solid var(--accent-primary);
    border-bottom: 2px solid var(--accent-primary);
  }

  .total-row td {
    font-weight: 700;
    color: var(--text-primary);
    font-size: 1.05rem;
  }

  .total-row .total {
    color: var(--accent-success);
  }

  /* Footer */
  .table-footer {
    padding: 1rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    text-align: center;
  }

  .table-footer p {
    color: var(--text-tertiary);
    font-size: 0.85rem;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .financial-table {
      font-size: 0.85rem;
    }

    th,
    td {
      padding: 0.5rem;
    }

    th.row-label {
      min-width: 200px;
    }

    th.period-header {
      min-width: 100px;
    }
  }
</style>
