import { currentUser, saveToStorage } from "./userData.js";

// Lightweight vault helpers for vault.html
(function(){
  // helper: format currency (UGX)
  function ugx(n){ return 'UGX ' + Number(n).toLocaleString(); }

  currentUser.vaults = currentUser.vaults || [];

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
  }

  function getVaultStats(){
    const vs = currentUser.vaults || [];
    const totalLocked = vs.reduce((acc, v) => acc + (Number(v.currentAmount) || 0), 0);
    const next = vs
      .filter(v => new Date(v.unlockDate) > new Date())
      .sort((a,b) => new Date(a.unlockDate) - new Date(b.unlockDate))[0];
    return { totalLocked, totalVaults: vs.length, nextUnlock: next ? new Date(next.unlockDate) : null };
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
    currentUser.savingsUGX = Number(currentUser.savingsUGX || 0) + amt;
    saveToStorage();
    renderVaultsOnPage();
    modal.style.display = 'none';
    document.getElementById('vaultWithdrawForm').reset();
    alert('Withdrew ' + ugx(amt) + ' to your account');
  }

  // initial render
  try{ window.addEventListener('DOMContentLoaded', renderVaultsOnPage); }catch(e){ setTimeout(renderVaultsOnPage, 200); }

})();
