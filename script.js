// Constants to handle slides and slide index
let currentSlide = 0;
let oldSlide = 0;
const dbzSlides = document.querySelectorAll('.slide.dbz');
const opSlides = document.querySelectorAll('.slide.op');
const slides = document.querySelectorAll('.slide');
let selectedSlides = dbzSlides; 

// Same for the dates to handle the transition class
const dbzDates = document.querySelectorAll('.dbz .date');
const opDates = document.querySelectorAll('.op .date');
const dates = document.querySelectorAll('.date');
let selectedDates = dbzDates;

// Variables to handles the span of the dates
let old_spans;
let new_spans;

// Constants to handle the dots and arrow state (enabled or disabled)
const dots = document.querySelectorAll('.dot');
const rightArrow = document.querySelector('.right-arrow');
const leftArrow = document.querySelector('.left-arrow');

// isAnimating is a flag to prevent multiple animations at the same time
let isAnimating = false;

// constants to handle elements for the switches between the themes
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const selectionDiv = document.querySelector('.selection');
const body = document.body;

// Allows to know which theme is currently displayed
let isOpMode = false;

let wait = false;

function showSlide(index) {
    // if an animation is in progress, do nothing
    if (isAnimating) return;

    // disable the switch while the animation is in progress
    isAnimating = true; 

    // shift left is used later to shift some slides to left without transition
    // change this class here to shift left allows to keep the previous slide in the right position
    // and use the right class for the good behavior of the carousel
    let shiftedSlides = document.querySelectorAll('.shiftleft');
    shiftedSlides.forEach(function callback(item, itemIndex) {
        item.classList.add('previousleft');
        item.classList.remove('shiftleft');
    });

    // remove transition class from all date spans
    dates.forEach(function callback(item, itemIndex) {
        const spans = item.querySelectorAll('span');
        // Itérer sur chaque <span> à l'intérieur de cet élément
        spans.forEach(span => {
            // Faire quelque chose avec chaque <span>
            span.classList.remove('transition');
        });
    });

    // remove the active class from the current displayed slide
    selectedSlides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    if (index>currentSlide){
        // current slide need to go to the left
        // removing the ^revious right class is just a precaution
        selectedSlides[currentSlide].classList.remove('previousright');
        selectedSlides[currentSlide].classList.add('previousleft');
    } else if (index<currentSlide){
        // Same for the other side
        selectedSlides[currentSlide].classList.remove('previousleft');
        selectedSlides[currentSlide].classList.add('previousright');
    } else {
        // Switching mode (or first iteration)
        // slide the current slide to the left and remove the previous right class
        selectedSlides[currentSlide].classList.remove('previousright');
        selectedSlides[currentSlide].classList.add('previousleft');

        // Change selected slides as the mode switched
        if (isOpMode && selectedSlides == dbzSlides) {
            opSlides.forEach(function callback(item, itemIndex) {
                // Put to left slides that have index lower than the current to have a good behavior
                // on the new slides
                if (itemIndex < index) {item.classList.add('shiftleft');}
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
    
    // Switching to the nex slide
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
    
    // Getting dates span from the previous slide and the new one to prepare transition
    if (oldSlide == currentSlide) {
        // means that we changed the mode
        new_spans = selectedDates[currentSlide].querySelectorAll('span');
        if (selectedDates == dbzDates) {
            old_spans = opDates[currentSlide].querySelectorAll('span');
        } else {
            old_spans = dbzDates[currentSlide].querySelectorAll('span');
        }        
    } else {
        new_spans = selectedDates[currentSlide].querySelectorAll('span');
        old_spans = selectedDates[oldSlide].querySelectorAll('span');
    }

    // Adding transition class to both old and new dates 
    new_spans.forEach(function callback(span, spanindex) {
        if (span.textContent == old_spans[spanindex].textContent) {return};
        span.classList.add('transition');
        old_spans[spanindex].classList.add('transition');
    });

    // Adding active class to the slide to display
    selectedSlides[currentSlide].classList.add('active');
    
    // Adding the active class to the associated dot, and the previous ones
    for (let i = 0; i <= currentSlide; i++) {
        dots[i].classList.add('active');
    }

    // Timeout to allow new change once all animations are done (after 300ms)
    setTimeout(() => {            
        isAnimating = false;

        // remove all classes from the undisplayed slides
        // Need to do it after the timer to don't have misbehavior while changing
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

        // enable changing mode checkbox (disabled when changing mode)
        themeToggle.disabled = false;
    }, 300);
}

document.addEventListener('keydown', function(event) {
    // Allow user to use the carousel with the left and right arrow keys
    if (event.key === 'ArrowLeft') {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }
    if (event.key === 'ArrowRight') {
        if (currentSlide < selectedSlides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }
    // Change theme with the space bar
    if (event.key === ' ' && wait === false) {
        wait = true;
        themeToggle.checked = !themeToggle.checked;
        changeTheme();
        setTimeout(() => {
            wait = false;
        }, 500);
    }
});

function showNextSlide() {
    // When the user click on the right arrow, the next slide is displayed
    if (currentSlide < selectedSlides.length - 1) {
        showSlide(currentSlide + 1);
    }
}

function showPreviousSlide() {
    // When the user click on the left arrow, the previous slide is displayed
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

themeToggle.addEventListener('change', () => {
    changeTheme();
});

function changeTheme() {
    // Disable the switch while the animation is in progress (enable back at the end of this one)
    themeToggle.disabled = true;
    // Toggle the theme
    body.classList.toggle('op-mode');
    selectionDiv.classList.toggle('op-mode');
    isOpMode = !isOpMode;
    // Show slide from the new theme
    showSlide(currentSlide);
}

// Init carousel with the first slide
showSlide(0);
