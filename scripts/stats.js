import { currentUser } from "./userData.js";

// compute and display total points spent (sum of negative point transactions)
export function updatePointsSpentStat(){
  const history = currentUser.history || [];
  const totalSpent = history.reduce((acc, tx) => {
    const amount = Number(tx.amount) || 0;
    // treat UGX transactions separately; only count point transactions
    const isUGX = tx.currency === 'UGX';
    if(!isUGX && amount < 0){
      return acc + Math.abs(amount);
    }
    return acc;
  }, 0);

  // Display as negative with 'pts' suffix, formatted with locale separators
  statExpense.textContent = (totalSpent > 0 ? '-' + totalSpent.toLocaleString() : '0') + ' pts';
  // keep the red color when there are spent points
  statExpense.style.color = totalSpent > 0 ? 'rgb(215, 1, 1)' : 'var(--muted)';
}