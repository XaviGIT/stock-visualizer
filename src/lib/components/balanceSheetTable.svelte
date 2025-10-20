<script lang="ts">
  import type { BalanceSheet } from "$lib/types/financials.type";
  import { formatCurrency, getFiscalYear } from "$lib/utils/formatters";

  export let data: BalanceSheet[];

  $: periods = data.slice(0, 5);
  $: periodHeaders = periods.map((d) => getFiscalYear(d.periodDate));

  function getValues(key: keyof BalanceSheet): (number | null)[] {
    return periods.map((period) => period[key] as number | null);
  }
</script>

<div class="table-container">
  <div class="table-wrapper">
    <table class="financial-table">
      <thead>
        <tr>
          <th class="row-label">Balance Sheet</th>
          {#each periodHeaders as header}
            <th class="period-header">{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <!-- Assets Section -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Assets</td>
        </tr>

        <!-- Current Assets -->
        <tr class="subsection-header">
          <td colspan={periodHeaders.length + 1}>Current Assets</td>
        </tr>
        <tr>
          <td class="row-label indent-2">Cash & Cash Equivalents</td>
          {#each getValues("cashAndEquivalents") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Accounts Receivable</td>
          {#each getValues("accountsReceivable") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Inventories</td>
          {#each getValues("inventories") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Other Current Assets</td>
          {#each getValues("otherCurrentAssets") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="subtotal-row">
          <td class="row-label indent-1"
            ><strong>Total Current Assets</strong></td
          >
          {#each getValues("totalCurrentAssets") as value}
            <td class="number-cell"><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Non-Current Assets -->
        <tr class="subsection-header">
          <td colspan={periodHeaders.length + 1}>Non-Current Assets</td>
        </tr>
        <tr>
          <td class="row-label indent-2">Investments</td>
          {#each getValues("investiments") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Property, Plant & Equipment</td>
          {#each getValues("propertyPlantEquipment") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Goodwill</td>
          {#each getValues("goodwill") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Intangible Assets</td>
          {#each getValues("intangibleAssets") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Other Assets</td>
          {#each getValues("otherAssets") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="total-row">
          <td class="row-label"><strong>Total Assets</strong></td>
          {#each getValues("totalAssets") as value}
            <td class="number-cell total"
              ><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Liabilities Section -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Liabilities</td>
        </tr>

        <!-- Current Liabilities -->
        <tr class="subsection-header">
          <td colspan={periodHeaders.length + 1}>Current Liabilities</td>
        </tr>
        <tr>
          <td class="row-label indent-2">Short-Term Debt</td>
          {#each getValues("shortTermDebt") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Accounts Payable</td>
          {#each getValues("accountsPayable") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Payroll</td>
          {#each getValues("payroll") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Income Taxes Payable</td>
          {#each getValues("incomeTaxes") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Other Current Liabilities</td>
          {#each getValues("otherCurrentLiabilities") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="subtotal-row">
          <td class="row-label indent-1"
            ><strong>Total Current Liabilities</strong></td
          >
          {#each getValues("totalCurrentLiabilities") as value}
            <td class="number-cell"><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Non-Current Liabilities -->
        <tr class="subsection-header">
          <td colspan={periodHeaders.length + 1}>Non-Current Liabilities</td>
        </tr>
        <tr>
          <td class="row-label indent-2">Long-Term Debt</td>
          {#each getValues("longTermDebt") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Other Liabilities</td>
          {#each getValues("otherLiabilities") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="total-row">
          <td class="row-label"><strong>Total Liabilities</strong></td>
          {#each getValues("totalLiabilities") as value}
            <td class="number-cell total"
              ><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Equity Section -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Shareholders' Equity</td>
        </tr>
        <tr>
          <td class="row-label indent-1">Common Stock</td>
          {#each getValues("commonStock") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Retained Earnings</td>
          {#each getValues("retainedCapital") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Accumulated Comprehensive Income</td>
          {#each getValues("accumulatedCompreensiveIncome") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="total-row">
          <td class="row-label"><strong>Total Shareholders' Equity</strong></td>
          {#each getValues("totalStakeholdersEquity") as value}
            <td class="number-cell total"
              ><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Balance Check -->
        <tr class="total-row balance-check">
          <td class="row-label"><strong>Total Liabilities & Equity</strong></td>
          {#each getValues("totalLiabilitiesAndStakeholdersEquity") as value}
            <td class="number-cell total"
              ><strong>{formatCurrency(value)}</strong></td
            >
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

  .indent-2 {
    padding-left: 3rem;
  }

  .number-cell {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
      "Courier New", monospace;
  }

  .section-header td {
    background: var(--bg-secondary);
    font-weight: 700;
    color: var(--accent-primary);
    padding: 0.875rem 1rem;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }

  .subsection-header td {
    background: var(--bg-secondary);
    font-weight: 600;
    color: var(--text-primary);
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    font-style: italic;
  }

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

  .balance-check {
    background: rgba(88, 129, 87, 0.15);
    border-top: 3px double var(--accent-primary);
  }

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
