<script lang="ts">
  import type { CashFlowStatement } from "$lib/types/financials.type";
  import { formatCurrency, getFiscalYear } from "$lib/utils/formatters";

  export let data: CashFlowStatement[];

  $: periods = data.slice(0, 5);
  $: periodHeaders = periods.map((d) => getFiscalYear(d.periodDate));

  function getValues(key: keyof CashFlowStatement): (number | null)[] {
    return periods.map((period) => period[key] as number | null);
  }
</script>

<div class="table-container">
  <div class="table-wrapper">
    <table class="financial-table">
      <thead>
        <tr>
          <th class="row-label">Cash Flow Statement</th>
          {#each periodHeaders as header}
            <th class="period-header">{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <!-- Operating Activities -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Operating Activities</td>
        </tr>
        <tr>
          <td class="row-label indent-1">Net Income</td>
          {#each getValues("netIncome") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Depreciation & Amortization</td>
          {#each getValues("depreciationAmortization") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Deferred Income Tax</td>
          {#each getValues("deferredIncomeTax") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Pension Contribution</td>
          {#each getValues("pensionContribution") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>

        <tr class="subsection-header">
          <td colspan={periodHeaders.length + 1}>Changes in Working Capital</td>
        </tr>
        <tr>
          <td class="row-label indent-2">Accounts Receivable</td>
          {#each getValues("accountsReceivableChange") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Inventories</td>
          {#each getValues("inventoriesChange") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Other Current Assets</td>
          {#each getValues("otherCurrentAssetsChange") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Other Assets</td>
          {#each getValues("otherAssetsChange") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Accounts Payable</td>
          {#each getValues("accountsPayableChange") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-2">Other Liabilities</td>
          {#each getValues("otherLiabilitiesChange") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>

        <tr class="total-row">
          <td class="row-label"><strong>Net Cash from Operations</strong></td>
          {#each getValues("netCashFromOperations") as value}
            <td class="number-cell total"
              ><strong>{formatCurrency(value)}</strong></td
            >
          {/each}
        </tr>

        <!-- Investing Activities -->
        <tr class="section-header">
          <td colspan={periodHeaders.length + 1}>Investing Activities</td>
        </tr>
        <tr>
          <td class="row-label indent-1">Capital Expenditures</td>
          {#each getValues("capitalExpenditures") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Acquisitions</td>
          {#each getValues("acquisitions") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Asset Sales</td>
          {#each getValues("assetSales") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr>
          <td class="row-label indent-1">Other Investing Activities</td>
          {#each getValues("otherInvestingActivities") as value}
            <td class="number-cell">{formatCurrency(value)}</td>
          {/each}
        </tr>
        <tr class="total-row">
          <td class="row-label"><strong>Net Cash from Investing</strong></td>
          {#each getValues("netCashFromInvesting") as value}
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
