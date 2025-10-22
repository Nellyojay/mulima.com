import { currentUser } from "./userData.js";

// DOM refs
const userFullName = document.getElementById('userFullName');
const userEmailMini = document.getElementById('userEmailMini');
const avatar = document.getElementById('avatar');
const miniUser = document.getElementById('mini-user');
const pointsValue = document.getElementById('pointsValue');
const addPointsBtn = document.getElementById('addPointsBtn');
const addPointsInput = document.getElementById('depositInput');
const depositBtn = document.getElementById('depositBtn');
const spendBtn = document.getElementById('spendBtn');
const redeemBtn = document.getElementById('redeemBtn');
const merchant = document.getElementById('merchant');
const spendInput = document.getElementById('spendInput');
const payBtn = document.getElementById('payBtn');
const equiv = document.getElementById('equiv');
const memberSince = document.getElementById('memberSince');
const historyContainer = document.getElementById('historyContainer');
const monthlySaved = document.getElementById('monthlySaved');
const progress = document.getElementById('progress');
const redeemable = document.getElementById('redeemable');
const partnersCount = document.getElementById('partnersCount');
const statExpense = document.getElementById('statExpense');
const statBalance = document.getElementById('statBalance');
const monthlyBreakdownEl = document.getElementById('monthlyBreakdown');
const statRedeemed = document.getElementById('stat-redeemed');

// compute and display total points spent (sum of negative point transactions)
export function updatePointsSpentStat() {
  const history = currentUser.history || [];
  const totalSpent = history.reduce((acc, tx) => {
    const amount = Number(tx.amount) || 0;
    // treat UGX transactions separately; only count point transactions
    const isUGX = tx.currency === 'UGX';
    if (!isUGX && amount < 0) {
      return acc + Math.abs(amount);
    }
    return acc;
  }, 0);

  // Display as negative with 'pts' suffix, formatted with locale separators
  statExpense.textContent = (totalSpent > 0 ? '-' + totalSpent.toLocaleString() : '0') + ' pts';
  // keep the red color when there are spent points
  statExpense.style.color = totalSpent > 0 ? 'rgb(215, 1, 1)' : 'var(--muted)';
}

renderStats()
function renderStats() {
  const {totalLocked} = getVaultStats()
  const vaultPoints = (totalLocked / 500)
  const redeemablePoints = Number(vaultPoints * 0.07).toFixed(2)

  if (statBalance) {
    statBalance.textContent = vaultPoints;
    statRedeemed.textContent = redeemablePoints;
  }
}

export function getVaultStats() {
  const vs = currentUser.vaults || [];
  const totalLocked = vs.reduce((acc, v) => acc + (Number(v.currentAmount) || 0), 0);
  const next = vs
    .filter(v => new Date(v.unlockDate) > new Date())
    .sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate))[0];
  return {
    totalLocked,
    totalVaults: vs.length,
    nextUnlock: next ? new Date(next.unlockDate) : null
  };
}