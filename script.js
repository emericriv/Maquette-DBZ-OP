let currentSlide = 0;
let oldSlide = 0;
const dbzSlides = document.querySelectorAll('.slide.dbz');
const opSlides = document.querySelectorAll('.slide.op');
const slides = document.querySelectorAll('.slide');
let selectedSlides = dbzSlides; 
const dbzDates = document.querySelectorAll('.dbz .date');
const opDates = document.querySelectorAll('.op .date');
const dates = document.querySelectorAll('.date');
let selectedDates = dbzDates;
const dots = document.querySelectorAll('.dot');
const rightArrow = document.querySelector('.right-arrow');
const leftArrow = document.querySelector('.left-arrow');
let isAnimating = false;
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const selectionDiv = document.querySelector('.selection');
const body = document.body;
let isOpMode = false;
const checkbox = document.getElementById('themeToggle');

function showSlide(index) {
    if (isAnimating) return;  // Si une animation est en cours, ne rien faire
    isAnimating = true;

    let shiftedSlides = document.querySelectorAll('.shiftleft');
    shiftedSlides.forEach(function callback(item, itemIndex) {
        item.classList.add('previousleft');
        item.classList.remove('shiftleft');
    });

    dates.forEach(function callback(item, itemIndex) {
        const spans = item.querySelectorAll('span');
        // Itérer sur chaque <span> à l'intérieur de cet élément
        spans.forEach(span => {
            // Faire quelque chose avec chaque <span>
            span.classList.remove('transition');
        });
    });

    // la slide actuelle est maintenant la slide précédente
    selectedSlides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    if (index>currentSlide){
        // Si on va à droite, on ajoute les classes 'previousleft' pour indiquer que la diapo actuelle part à gauche
        selectedSlides[currentSlide].classList.remove('previousright');
        selectedSlides[currentSlide].classList.add('previousleft');
    } else if (index<currentSlide){
        // Si on va à gauche, on ajoute les classes 'previousright' pour indiquer que la diapo actuelle part à droite
        selectedSlides[currentSlide].classList.remove('previousleft');
        selectedSlides[currentSlide].classList.add('previousright');
    } else {
        // on change de mode
        selectedSlides[currentSlide].classList.add('previousleft');
        if (isOpMode && selectedSlides == dbzSlides) {
            opSlides.forEach(function callback(item, itemIndex) {
                if (itemIndex <= index) {item.classList.add('shiftleft');}
            });
            selectedSlides = opSlides;
            selectedDates = opDates;
        } else {
            dbzSlides.forEach(function callback(item, itemIndex) {
                if (itemIndex < index) {item.classList.add('shiftleft');}
            });
            selectedSlides = dbzSlides;
            selectedDates = dbzDates;
        }
    }
    
    oldSlide = currentSlide;
    currentSlide = index;
    
    // disable left arrow if currentSlide is 0
    if (currentSlide == selectedSlides.length - 1) {
        rightArrow.classList.add('disabled');
    } else {
        rightArrow.classList.remove('disabled');
    }
    // disable right arrow if currentSlide is last
    if (currentSlide == 0) {
        leftArrow.classList.add('disabled');
    } else {
        leftArrow.classList.remove('disabled');
    }
    
    // la nouvelle slide est maintenant la slide actuelle
    const new_spans = selectedDates[currentSlide].querySelectorAll('span');
    const old_spans = selectedDates[oldSlide].querySelectorAll('span');
    new_spans.forEach(function callback(span, spanindex) {
        if (span.textContent == old_spans[spanindex].textContent) {return};
        span.classList.add('transition');
        old_spans[spanindex].classList.add('transition');
    });
    selectedSlides[currentSlide].classList.add('active');
    
    for (let i = 0; i <= currentSlide; i++) {
        dots[i].classList.add('active');
    }

    // Utiliser un délai pour empêcher les animations de se chevaucher
    setTimeout(() => {            
        isAnimating = false;
        if (selectedSlides == dbzSlides) {
            opSlides.forEach(function callback(item, itemIndex) {
                item.classList.remove('shiftleft');
                item.classList.remove('previousleft');
                item.classList.remove('previousright');
            });
        } else {
            dbzSlides.forEach(function callback(item, itemIndex) {
                item.classList.remove('shiftleft');
                item.classList.remove('previousleft');
                item.classList.remove('previousright');
            });
        } 
        checkbox.disabled = false;
    }, 300); // Assurez-vous que ce délai correspond à la durée de la transition dans le CSS
}

document.addEventListener('keydown', function(event) {
    // Vérifier si la touche "flèche gauche" est pressée
    if (event.key === 'ArrowLeft') {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }
    if (event.key === 'ArrowRight') {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }
});

function showNextSlide() {
    if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    }
}

function showPreviousSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

themeToggle.addEventListener('change', () => {
    checkbox.disabled = true;
    body.classList.toggle('op-mode');
    selectionDiv.classList.toggle('op-mode');
    isOpMode = !isOpMode;
    showSlide(currentSlide);
});

// Initialiser le carrousel en affichant la première diapositive
showSlide(0);
