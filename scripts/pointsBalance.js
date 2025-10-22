import { currentUser } from "./userData.js";
import { ugx } from "./utils/money.js";

export function renderPointsCard() {
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

      const message = amountAdded / 500

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
}