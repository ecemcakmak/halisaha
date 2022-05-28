const menuIcon = document.querySelector('.header__hamburger');
const navbar = document.querySelector('.header__navbar');

menuIcon.addEventListener('click', () =>{
    navbar.classList.toggle("header__hamburger__motion");
});
