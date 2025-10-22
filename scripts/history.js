import { currentUser } from "./userData.js";
import { ugx } from "./utils/money.js";

// render history entries
export function renderHistory() {
  historyContainer.innerHTML = '';

  const list = document.createElement('div');

  const historyList = (currentUser.history || []).slice().reverse();

  if (historyList.length === 0) {
    const empty = document.createElement('div');
    empty.style.color = 'var(--muted)';
    empty.style.padding = '12px';
    empty.textContent = 'No recent activity';
    historyContainer.appendChild(empty);
    return;
  }

  historyList.forEach(tx => {
    const row = document.createElement('div');
    row.className = 'tx';

    const left = document.createElement('div');

    left.innerHTML = `<div style="font-weight:700;">${tx.note}</div><small style="color:var(--muted)">${tx.date}</small>`;

    const right = document.createElement('div');
    right.style.textAlign = 'right';

    // format amount display
    let amountText = '';
    let color = tx.amount > 0 ? 'var(--primary)' : '#e74c3c';

    if (tx.currency === 'UGX') {
      const display = ugx(Math.abs(tx.amount));
      amountText = (tx.amount > 0 ? '+' : '-') + display;
      color = tx.amount > 0 ? 'var(--primary)' : '#e74c3c';
    } else { // POINTS
      amountText = (tx.amount > 0 ? '+' : '') + tx.amount + ' pts';
      color = tx.amount > 0 ? 'var(--primary)' : '#e74c3c';
    }

    right.innerHTML = `<div style="font-weight:800;color:${color}">${amountText}</div><small>${tx.type}</small>`;

    row.appendChild(left);
    row.appendChild(right);
    list.appendChild(row);
  });
  historyContainer.appendChild(list);
  // update monthly breakdown
  renderMonthlyPointsSpent();
}

// render monthly points spent breakdown under the history
export function renderMonthlyPointsSpent() {
  const monthlyBreakdownEl = document.getElementById('monthlyBreakdown');
  
  if (!monthlyBreakdownEl) return;

  const history = currentUser.history || [];

  // aggregate by month-year string (e.g., "2025-10")
  const map = {};

  history.forEach(tx => {
    // only consider POINTS debits / negative amounts
    const isPoints = tx.currency === 'POINTS' || tx.note?.toLowerCase()?.includes('pts');
    const amt = Number(tx.amount) || 0;
    if (!isPoints) return;
    if (amt >= 0) return; // we only count spent (negative)

    // parse tx.date; support Date string from toLocaleDateString or ISO
    let d;
    try { d = new Date(tx.date); } catch (e) { d = new Date(); }
    if (isNaN(d)) d = new Date(tx.date.split('/').reverse().join('-'));
    if (isNaN(d)) return;

    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    map[key] = (map[key] || 0) + Math.abs(amt);
  });

  // sort keys descending (most recent first)
  const keys = Object.keys(map).sort((a, b) => b.localeCompare(a));

  if (keys.length === 0) {
    monthlyBreakdownEl.innerHTML = '<div style="color:var(--muted)">No monthly spends yet</div>';
    return;
  }

  const rows = keys.map(k => {
    const [year, month] = k.split('-');
    const m = new Date(Number(year), Number(month) - 1, 1).toLocaleString(undefined, { month: 'short' });
    return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed rgba(0,0,0,0.04)"><div>${m} ${year}</div><div style="color:#e74c3c;">-${map[k].toLocaleString()} pts</div></div>`;
  }).join('');

  monthlyBreakdownEl.innerHTML = `<div style="font-weight:700;margin-bottom:6px">Points spent per month</div>` + rows;
}