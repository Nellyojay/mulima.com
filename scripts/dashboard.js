import { currentUser } from "./userData.js";

document.querySelector('.footer-date')
  .innerHTML = `<strong>${new Date().getFullYear()}</strong>`

window.toggleSidebar = toggleSidebar;
function toggleSidebar(){
  const sb = document.getElementById("sidebar");
  const ov = document.getElementById("overlay");
  sb.classList.toggle("active");
  ov.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
}

// close sidebar when clicking overlay
document.getElementById('overlay').addEventListener('click', () => {
  const sb = document.getElementById("sidebar");
  const ov = document.getElementById("overlay");
  if(sb.classList.contains('active')){
    sb.classList.remove('active');
    ov.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
});

// close on Escape key
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    const sb = document.getElementById("sidebar");
    const ov = document.getElementById("overlay");
    if(sb.classList.contains('active')){
      sb.classList.remove('active');
      ov.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }
});

// close when clicking any sidebar item (improves UX on mobile)
document.querySelectorAll('#sidebar ul li').forEach(li => {
  li.addEventListener('click', () => {
    const sb = document.getElementById("sidebar");
    const ov = document.getElementById("overlay");
    sb.classList.remove('active');
    ov.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
});

// helper: format currency (UGX)
function ugx(n){ return 'UGX ' + Number(n).toLocaleString(); }

// sample user load or create




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

userFullName.textContent = currentUser.firstName + ' ' + currentUser.lastName;

// *POINTS CALCULATION* //

//ADD
addPointsBtn.addEventListener('click', () => {
  // Remove all buttons
  addPointsBtn.classList.add('is-not-editing')
  spendBtn.classList.add('is-not-editing')
  redeemBtn.classList.add('is-not-editing')

  // Display deposit input and pay button
  addPointsInput.classList.add('is-editing')
  depositBtn.classList.add('is-editing')
})

// DEPOSIT
depositBtn.addEventListener('click', () => {
  // Remove all buttons
  addPointsBtn.classList.remove('is-not-editing')
  spendBtn.classList.remove('is-not-editing')
  redeemBtn.classList.remove('is-not-editing')

  // Display deposit input and pay button
  addPointsInput.classList.remove('is-editing')
  depositBtn.classList.remove('is-editing')

  const amountAdded = Number(addPointsInput.value);

  if (amountAdded > 0) {
    currentUser.savingsUGX += amountAdded;
    currentUser.points = Number(currentUser.savingsUGX / 500);

    currentUser.history = currentUser.history || [];
    currentUser.history.push({
      type: 'credit',
      note: `Saved ${ugx(amountAdded)}`,
      amount: amountAdded,
      currency: 'UGX',
      date: new Date().toLocaleDateString()
    });

    const message = amountAdded/500

    alert(`You have added ${message} PTS`)

    saveToStorage();
    renderHistory();
    addPointsInput.value = '';
    window.location.reload();
  } else {
    alert('Enter a valid amount to deposit');
  }
})

//SPEND
spendBtn.addEventListener('click', () => {
  // Remove all buttons
  addPointsBtn.classList.add('is-not-editing')
  spendBtn.classList.add('is-not-editing')
  redeemBtn.classList.add('is-not-editing')

  // Display deposit input and pay button
  merchant.classList.add('is-editing')
  spendInput.classList.add('is-editing')
  payBtn.classList.add('is-editing')

})

// PAY
payBtn.addEventListener('click', () => {
  // Remove all buttons
  addPointsBtn.classList.remove('is-not-editing')
  spendBtn.classList.remove('is-not-editing')
  redeemBtn.classList.remove('is-not-editing')

  // Display spend input and pay button
  merchant.classList.remove('is-editing')
  spendInput.classList.remove('is-editing')
  payBtn.classList.remove('is-editing')

  const pointsSpent = Number(spendInput.value);

  if (pointsSpent > 0 && pointsSpent <= (currentUser.points || 0)) {
    const ugxDeduct = pointsSpent * 500;
    currentUser.savingsUGX -= ugxDeduct;
    currentUser.points = Number(currentUser.savingsUGX / 500);

    currentUser.history = currentUser.history || [];
    currentUser.history.push({
      type: 'debit',
      note: `Spent ${pointsSpent} pts (${ugx(ugxDeduct)})`,
      amount: -pointsSpent,
      currency: 'POINTS',
      date: new Date().toLocaleDateString()
    });

    saveToStorage();
    renderHistory();
    spendInput.value = '';
    window.location.reload()
  } else {
    alert('Invalid spend amount or insufficient points');
  }
})

redeemBtn.addEventListener('click', () => {
  alert('Points are redeemed from interest earned on savings.')
})

pointsValue.textContent = currentUser.points;
equiv.textContent = ugx(currentUser.points * 500); // sample rate: 1 point = UGX 500
memberSince.textContent = currentUser.memberSince;


renderHistory();

// compute and display total points spent (sum of negative point transactions)
function updatePointsSpentStat(){
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

// update the points spent stat right after rendering history
updatePointsSpentStat();

// render history entries
function renderHistory(){
  historyContainer.innerHTML = '';

  const list = document.createElement('div');

  const historyList = (currentUser.history || []).slice().reverse();

  if(historyList.length === 0){
    const empty = document.createElement('div');
    empty.style.color = 'var(--muted)';
    empty.style.padding = '12px';
    empty.textContent = 'No recent activity';
    historyContainer.appendChild(empty);
    return;
  }

  historyList.forEach(tx=>{
    const row = document.createElement('div');
    row.className = 'tx';

    const left = document.createElement('div');

    left.innerHTML = `<div style="font-weight:700;">${tx.note}</div><small style="color:var(--muted)">${tx.date}</small>`;

    const right = document.createElement('div');
    right.style.textAlign='right';

    // format amount display
    let amountText = '';
    let color = tx.amount > 0 ? 'var(--primary)' : '#e74c3c';

    if(tx.currency === 'UGX'){
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
function renderMonthlyPointsSpent(){
  if(!monthlyBreakdownEl) return;

  const history = currentUser.history || [];

  // aggregate by month-year string (e.g., "2025-10")
  const map = {};

  history.forEach(tx => {
    // only consider POINTS debits / negative amounts
    const isPoints = tx.currency === 'POINTS' || tx.note?.toLowerCase()?.includes('pts');
    const amt = Number(tx.amount) || 0;
    if(!isPoints) return;
    if(amt >= 0) return; // we only count spent (negative)

    // parse tx.date; support Date string from toLocaleDateString or ISO
    let d;
    try{ d = new Date(tx.date); }catch(e){ d = new Date(); }
    if(isNaN(d)) d = new Date(tx.date.split('/').reverse().join('-'));
    if(isNaN(d)) return;

    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0');
    map[key] = (map[key] || 0) + Math.abs(amt);
  });

  // sort keys descending (most recent first)
  const keys = Object.keys(map).sort((a,b) => b.localeCompare(a));

  if(keys.length === 0){
    monthlyBreakdownEl.innerHTML = '<div style="color:var(--muted)">No monthly spends yet</div>';
    return;
  }

  const rows = keys.map(k => {
    const [year, month] = k.split('-');
    const m = new Date(Number(year), Number(month)-1, 1).toLocaleString(undefined, { month: 'short' });
    return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed rgba(0,0,0,0.04)"><div>${m} ${year}</div><div style="color:#e74c3c;">-${map[k].toLocaleString()} pts</div></div>`;
  }).join('');

  monthlyBreakdownEl.innerHTML = `<div style="font-weight:700;margin-bottom:6px">Points spent per month</div>` + rows;
}

/* -----------------------------
   Vaults support (per-user)
   - Ensure each user has a `vaults` array
   - Expose helpers: createVault, renderVaultsOnPage, promptAddFunds, viewVault
   - These operate on `currentUser` and persist via saveToStorage()
   ----------------------------- */

currentUser.vaults = currentUser.vaults || [];

function getVaultStats(){
  const vs = currentUser.vaults || [];
  const totalLocked = vs.reduce((acc, v) => acc + (Number(v.currentAmount) || 0), 0);
  const next = vs
    .filter(v => new Date(v.unlockDate) > new Date())
    .sort((a,b) => new Date(a.unlockDate) - new Date(b.unlockDate))[0];
  return { 
    totalLocked, 
    totalVaults: vs.length,
    nextUnlock: next ? new Date(next.unlockDate) : null 
  };
}

window.createVault = function({ name, targetAmount, unlockDate, initialDeposit }){
  const v = {
    id: 'vault_' + Date.now(),
    name: name || 'Vault',
    targetAmount: Number(targetAmount) || 0,
    currentAmount: Number(initialDeposit) || 0,
    unlockDate: new Date(unlockDate).toISOString(),
    createdAt: new Date().toISOString(),
    status: new Date(unlockDate) <= new Date() ? 'unlocked' : 'locked'
  };
  currentUser.vaults = currentUser.vaults || [];
  currentUser.vaults.push(v);
  saveToStorage();
  renderVaultsOnPage();
  return v;
}

window.renderVaultsOnPage = function(){
  const container = document.getElementById('vaultContainer');
  const totalLockedEl = document.getElementById('totalLocked');
  const totalVaultsEl = document.getElementById('totalVaults');
  const nextUnlockEl = document.getElementById('nextUnlock');
  if(!container) return; // only present on vault.html
  container.innerHTML = '';
  const vs = currentUser.vaults || [];
  if(vs.length === 0){
    container.innerHTML = '<div style="color:var(--muted);padding:12px">No vaults yet</div>';
  } else {
    vs.forEach(v => {
      const daysLeft = Math.max(0, Math.ceil((new Date(v.unlockDate) - new Date()) / (1000*60*60*24)));
      const progress = Math.min(100, Math.round((Number(v.currentAmount)||0) / (Number(v.targetAmount)||1) * 100));
      const locked = new Date(v.unlockDate) > new Date();
      const item = document.createElement('div');
      item.className = 'vault-item';
      item.innerHTML = `
        <div class="vault-info">
          <h3>${escapeHtml(v.name)}</h3>
          <div class="vault-details">
            <p class="amount">${ugx(v.currentAmount)}</p>
            <p class="unlock-date">Unlocks: ${new Date(v.unlockDate).toLocaleDateString()}</p>
            <div class="progress-bar"><div class="progress" style="width:${progress}%"></div></div>
            <p class="time-left">${daysLeft} days left</p>
          </div>
        </div>
        <div class="vault-actions">
          <button class="btn deposit-btn" onclick="promptAddFunds('${v.id}')">Add Funds</button>
          <button class="btn view-btn" onclick="viewVault('${v.id}')">View Details</button>
          <button class="btn withdraw-btn" onclick="openVaultWithdraw('${v.id}')" ${locked ? 'disabled' : ''}>Withdraw</button>
        </div>
      `;
      container.appendChild(item);
    });
  }
  if(totalLockedEl) totalLockedEl.textContent = ugx(getVaultStats().totalLocked);
  if(totalVaultsEl) totalVaultsEl.textContent = getVaultStats().totalVaults;
  if(nextUnlockEl){
    const n = getVaultStats().nextUnlock;
    nextUnlockEl.textContent = n ? n.toLocaleDateString() : '-';
  }
}

window.promptAddFunds = function(vaultId){
  // open deposit modal with vaultId
  const modal = document.getElementById('vaultDepositModal');
  if(!modal) return alert('Deposit UI not available');
  modal.dataset.vaultId = vaultId;
  modal.style.display = 'flex';
}

window.viewVault = function(vaultId){
  const v = currentUser.vaults.find(x => x.id === vaultId);
  if(!v) return alert('Vault not found');
  alert(`${v.name}\nTarget: ${ugx(v.targetAmount)}\nCurrent: ${ugx(v.currentAmount)}\nUnlocks: ${new Date(v.unlockDate).toLocaleDateString()}`);
}

// deposit modal submit handler
window.submitVaultDeposit = function(e){
  e.preventDefault();
  const modal = document.getElementById('vaultDepositModal');
  const vaultId = modal.dataset.vaultId;
  const amt = Number(document.getElementById('vaultDepositAmount').value) || 0;
  if(!amt || amt <= 0) return alert('Enter a valid amount');
  const v = currentUser.vaults.find(x => x.id === vaultId);
  if(!v) return alert('Vault not found');

  v.currentAmount = Number(v.currentAmount || 0) + amt;
  saveToStorage();
  renderVaultsOnPage();
  modal.style.display = 'none';
  document.getElementById('vaultDepositForm').reset();
}

// withdraw modal open
window.openVaultWithdraw = function(vaultId){
  const v = currentUser.vaults.find(x => x.id === vaultId);
  if(!v) return alert('Vault not found');
  // prevent withdraw before unlockDate
  if(new Date(v.unlockDate) > new Date()){
    return alert('This vault is still locked. You can only withdraw on or after ' + new Date(v.unlockDate).toLocaleDateString());
  }
  const modal = document.getElementById('vaultWithdrawModal');
  if(!modal) return alert('Withdraw UI not available');
  modal.dataset.vaultId = vaultId;
  modal.style.display = 'flex';
}

// withdraw submit
window.submitVaultWithdraw = function(e){
  e.preventDefault();
  const modal = document.getElementById('vaultWithdrawModal');
  const vaultId = modal.dataset.vaultId;
  const amt = Number(document.getElementById('vaultWithdrawAmount').value) || 0;
  if(!amt || amt <= 0) return alert('Enter a valid amount');
  const v = currentUser.vaults.find(x => x.id === vaultId);
  if(!v) return alert('Vault not found');
  if(new Date(v.unlockDate) > new Date()) return alert('Vault still locked');
  if(amt > Number(v.currentAmount || 0)) return alert('Insufficient funds in vault');

  v.currentAmount = Number(v.currentAmount) - amt;
  // when withdrawing, add to user's savingsUGX (as cashout to account)
  currentUser.savingsUGX = Number(currentUser.savingsUGX || 0) + amt;
  saveToStorage();
  renderVaultsOnPage();
  modal.style.display = 'none';
  document.getElementById('vaultWithdrawForm').reset();
  alert('Withdrew ' + ugx(amt) + ' to your account');
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
}

// If vault.html is open, render vaults on load
try { renderVaultsOnPage(); } catch(e){}