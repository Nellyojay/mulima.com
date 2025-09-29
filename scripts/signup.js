export const personalDetails = JSON.parse(localStorage.getItem('personalDetails')) || [{
  firstnName: 'Don',
  lastName: 'Jon',
  email: 'donjon@foodvault.com',
  password: 'password123'
},{
  firstnName: 'Jon',
  lastName: 'Doe',
  email: 'jondoe@foodvault.com',
  password: 'password123'
}];

const btn = document.querySelector('.js-signup-btn')
  
if (btn) {
  btn.addEventListener('click', () => {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('new-password').value.trim();

    const user = {
      firstnName: firstName,
      lastName: lastName,
      email: email,
      password: password
    }

    personalDetails.push(user)
    saveToStorage()

    document.querySelector("form").reset();
    alert('Succes. Redirecting to log in page.')
    window.location.href = 'login.html'
  })
}

function saveToStorage() {
  localStorage.setItem('personalDetails', JSON.stringify(personalDetails))
}