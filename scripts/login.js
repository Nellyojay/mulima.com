document.querySelector('.js-login-btn')
  .addEventListener('click', () => {
    const email = document.getElementById('email')
    const password = document.getElementById('password')

    if (email.value !== '2') {
      alert('Wrong email')
    } else if (password.value !== '2') {
      alert('Wrong password')
    } else {
      window.location.href = 'dashboard.html'
    }
  })