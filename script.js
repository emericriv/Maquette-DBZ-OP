let currentSlide = 0;
let oldSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let isAnimating = false;

function showSlide(index) {
    if (isAnimating || index == currentSlide) return;  // Si une animation est en cours, ne rien faire
    isAnimating = true;

    if (index>currentSlide){
        // Si on va à droite, on ajoute les classes 'previousleft' pour indiquer que la diapo actuelle part à gauche
        slides[currentSlide].classList.remove('previousright');
        slides[currentSlide].classList.add('previousleft');
        // Si un saut de la diapo 0 à la diapo 2 est effectué, les diapos 0 et 1 doivent partir à gauche
        slides.forEach(function callback(item, itemIndex) {
            if (index <= itemIndex || currentSlide == itemIndex) {return};
            slides[itemIndex].classList.remove('previousright');
            slides[itemIndex].classList.add('toleft');
        });
    } else {
        // Si on va à gauche, on ajoute les classes 'previousright' pour indiquer que la diapo actuelle part à droite
        slides[currentSlide].classList.remove('previousleft');
        slides[currentSlide].classList.add('previousright');
        // Si un saut de la diapo 2 à la diapo 0 est effectué, les diapos 1 et 2 doivent partir à droite
        slides.forEach(function callback(item, itemIndex) {
            if (index >= itemIndex || currentSlide == itemIndex) {return};
            slides[itemIndex].classList.remove('previousleft');
            slides[itemIndex].classList.remove('toleft');
        });
    }

    // la slide actuelle est maintenant la slide précédente
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    oldSlide = currentSlide;
    currentSlide = index;
    
    // la nouvelle slide est maintenant la slide actuelle
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Utiliser un délai pour empêcher les animations de se chevaucher
    setTimeout(() => {            
        isAnimating = false; 
    }, 300); // Assurez-vous que ce délai correspond à la durée de la transition dans le CSS

}

// Initialiser le carrousel en affichant la première diapositive
showSlide(0);
