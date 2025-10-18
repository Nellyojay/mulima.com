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
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

let allUsers = JSON.parse(localStorage.getItem('personalDetails')) || [];

if(!currentUser){
  // create demo user if none
  currentUser = {
    firstName: "Don",
    lastName: "Jon",
    email: "donjon@mulima.local",
    points: 0,
    savingsUGX: 0,
    history: [
      {type:'credit', note:'Account credited', amount:1200, date: daysAgo(6)},
      {type:'credit', note:'Saved UGX 5,000', amount:100, date: daysAgo(4)},
      {type:'redeem', note:'Redeemed groceries', amount:-200, date: daysAgo(2)}
    ],
    memberSince: (new Date()).toLocaleDateString()
  };
  
  saveToStorage()

  // push to personalDetails if absent
  if(!allUsers.some(u=>u.email===currentUser.email)) {
    allUsers.push(currentUser);
    localStorage.setItem('personalDetails', JSON.stringify(allUsers));
  }
}

function saveToStorage() {
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

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
const statBlalnce = document.getElementById('statBalance');

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
    currentUser.points = Math.round(currentUser.savingsUGX / 500);

    currentUser.history = currentUser.history || [];
    currentUser.history.push({
      type: 'credit',
      note: `Saved ${ugx(amountAdded)}`,
      amount: amountAdded,
      currency: 'UGX',
      date: new Date().toLocaleDateString()
    });

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
    currentUser.points = Math.round(currentUser.savingsUGX / 500);

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
equiv.textContent = ugx(currentUser.points * 500); // sample rate: 1 point = UGX 50
memberSince.textContent = currentUser.memberSince;



// monthlySaved.textContent = ugx(currentUser.savingsUGX || 0);
// progress.textContent = Math.min(100, Math.round((currentUser.savingsUGX || 0) / 100000 * 100)) + '%';
// redeemable.textContent = ugx((currentUser.points || 0) * 50);
// partnersCount.textContent = 12;
// miniUser.textContent = currentUser.firstName;
renderHistory();

function daysAgo(n){
  const d = new Date(); 
  d.setDate(d.getDate()-n);
  return d.toLocaleDateString();
}

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
}