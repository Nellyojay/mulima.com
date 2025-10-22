export function renderSideBar() {
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
}