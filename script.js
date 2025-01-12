window.addEventListener('scroll', function() {
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(el => {
        let scrollPosition = window.pageYOffset;
        el.style.backgroundPosition = 'center ' + (scrollPosition * 0.5) + 'px';
    });
});
