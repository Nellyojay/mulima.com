export function renderSideBar() {
  window.toggleSidebar = toggleSidebar;
  function toggleSidebar() {
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
    if (sb.classList.contains('active')) {
      sb.classList.remove('active');
      ov.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  // close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sb = document.getElementById("sidebar");
      const ov = document.getElementById("overlay");
      if (sb.classList.contains('active')) {
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
}

export function renderVaultSideBar() {
  window.toggleSidebar = toggleSidebar;
  function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.overlay').classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }

  // Set minimum date to today for unlock date input
  document.getElementById('unlockDate').min = new Date().toISOString().split('T')[0];

  // Handle form submission
  document.getElementById('vaultForm').onsubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('vaultName').value.trim();
    const target = Number(document.getElementById('targetAmount').value);
    const unlock = document.getElementById('unlockDate').value;
    const initial = Number(document.getElementById('initialDeposit').value) || 0;

    if (!name || !unlock || isNaN(target) || target <= 0) {
      return alert('Please provide a valid vault name, target amount and unlock date');
    }

    // createVault is exposed by scripts/vault.js
    if (window.createVault) {
      window.createVault({
        name,
        targetAmount: target,
        unlockDate: unlock,
        initialDeposit: initial
      });
    } else {
      alert('Vault support not available');
    }

    // reset form and close modal
    document.getElementById('vaultForm').reset();
    closeModal();
  }
}