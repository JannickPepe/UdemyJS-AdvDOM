'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// make callback function to btn by eventListener
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


///////////////// BUTTON SCROLL (SMOOTH)
////////////////

btnScrollTo.addEventListener('click', function(e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  // Scrolling
  // window.scrollTo(
  //  s1coords.left + window.pageXOffset, 
  //  s1coords.top + window.pageYOffset
  // );// global function

  //with smooth
  // window.scrollTo({
  //  left: s1coords.left + window.pageXOffset, 
  //  top: s1coords.top + window.pageYOffset,
  //  behavior: 'smooth', 
  // });

  section1.scrollIntoView({behavior: 'smooth'}); // new way
});

///////////////// PAGE NAVIGATION
////////////////
// document.querySelectorAll('.nav__link').forEach(function(el) {
//  el.addEventListener('click', function(e) {
//    e.preventDefault(); // cancle the scroll so smooth scroll can be done
//    const id = this.getAttribute('href');
//    console.log(id);
//    document.querySelector(id).scrollIntoView({
//      behavior: 'smooth' 
//    }); // the href attribute section id onto scrollInto method so behavior /can be implementet
//  });
//});


// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy - using e.target instead of this onto getAttribute so you have event DELEGATION
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView( {
      behavior: 'smooth'});
  }
});

///////////////// TABBED COMPONENT
////////////////


// Use event delegrations on the parent eventHandler
tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab'); // Using DOM traversing with closest for event delegation

  // Guard clause - if statement that will return early if some condition is matched - if clicked is null nothing will happen between the tabs
  if(!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tabs
  clicked.classList.add('operations__tab--active');

  // Active content area
  // making the dataset.tab appear on clicked and add the specific class
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active'); 
});


///////////////// MENU FADE ANIMATION
////////////////

// create new const for refactor and add the values in the funtion
const handleHover = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // use the closest method
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); 
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// how to add different opacity to handleOver with bind method - by passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));



///////////////// STICKY NAVIGATION
////////////////
/*
const intitialCoords = section1.getBoundingClientRect();
console.log(intitialCoords);

window.addEventListener('scroll', function() {
  console.log(window.scrollY);

  if (window.scrollY > intitialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/


///////////////// STICKY NAVIGATION: INTERSECTION OBSERVER API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);



// REVEAL SECTIONS
const allSections = document.querySelectorAll('.section')

const revealSection = function(entries, observer) {
  // destructuring
  const [entry] = entries;
  // console.log(entry);

  // use a guard clause
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  // make unobserve so the Observer Intersecting stops
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, 
  threshold: 0.15,
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});



// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]');

// callback function
const loadImg = function (entries, observer) {
  // only 1 treshold - entry
  const [entry] = entries;
  //console.log(entry);

  // use guard clause
  if(!entry.isIntersecting) return;

  // Replace src with data-src(which is tthe lazyloadimg)
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));



// SLIDER
const slider = function() {

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;



  // Functions
  const createDots = function() {
    slides.forEach(function(_, i) {
      dotContainer.insertAdjacentHTML('beforeend', 
      `<button class="dots__dot" data-slide="${i}"></button>`)
    });
  };


  const activeDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
  };

  const goToSlide = function(slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
    // -100%, 0%, 100%, 200%
  };


  // Next slide - by changing the %'s
  const nextSlide = function() {
    if(curSlide === maxSlide -1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const prevSlide = function() {
    if(curSlide === 0) {
      curSlide = maxSlide -1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const init = function() {
    goToSlide(0);
    createDots();
    // set the first dot active
    activeDot(0);
  }
  init()

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Keyboard events 
  document.addEventListener('keydown', function(e) {
    //console.log(e);
    if(e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });


  dotContainer.addEventListener('click', function(e) {
    if(e.target.classList.contains('dots__dot')) {
      const {slide} = e.target.dataset; // make e hookup to the data-slide button with destructuring
      goToSlide(slide);
      activeDot(slide);
    }
  });
};
slider();



///////////// EXERCISES
///////////////////////////////////////
//////////////////////////////////////


///////////////// SELECTING, CREATING AND DELETE ELEMENTS
////////////////
/*
// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);


const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));


// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
//message.textContent = 'We use cookies for improved data for our analytic tools.';
message.innerHTML = 
'We use cookies for improved data for our analytic tools. <button class="btn btn--close-cookie">Got it!</button>';

//prepend adds the element as the first child of header element
// header.prepend(message);
header.append(message); // append as the last child of header element
//header.append(message.cloneNode(true)); // all child elements will be copied

// header.before(message);
// header.after(message);

// Delete elements
document
.querySelector('.btn--close-cookie')
.addEventListener('click', function() {
  message.remove(); 
  // message.parentElement.removeChild(message); // the old way where you had to move up to parentElement in the DOM tree
})
*/


///////////////// STYLES
////////////////
/*
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color); // Computed - real style
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; // use parse to convert string to floating point number - we add 30 more height then we add px

document.documentElement.style.setProperty('--color-primary', 'orangered'); // change color primary in the :root to orange with setProperty by passing in the name and value

// Attributes (src, alt, class ect)
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src); // Full path
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo'; // insert new string value to alt text

// Non-Standard
console.log(logo.designer);
console.log(logo.getAttribute('designer')); // jonas is now hooked to designer in html DOM
logo.setAttribute('company', 'Bankist'); // will become company: 'Bankist'

console.log(logo.getAttribute('src')); // Relative path

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data Attributes
console.log(logo.dataset.versionNumber); // camel case, get the data-version-number in html by dataset

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // its not like includes

// Dont Use
logo.className = 'jonas';
*/



///////////////// TYPES OF EVENTS AND EVENTS HANDLERS
////////////////
/*
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great ! You are reading the heading:D');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.addEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function(e) {
//  alert('onmouseenter: Great! You are reading the heading :D');
// };
*/




///////////////// EVENT PROPAGATION: BUBBLING AND CAPTURING
////////////////
/*
// rgb(255, 255, 255)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation
  // e.stopPropagation();
});

// the parent link of the nav menu
document.querySelector('.nav__links').addEventListener('click', function(e) {
    this.style.backgroundColor = randomColor();
    console.log('CONTAINER', e.target, e.currentTarget);
  });

// the whole nav bar
document.querySelector('.nav').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
}); // set to true = cancle the bubble effect and do capturing with then NAV first in the console.log
*/




///////////////// DOM TRAVERSING
////////////////
/*
const h1 = document.querySelector('h1');

// going downards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)'; // take --gradient style from the :root in css

h1.closest('h1').style.background = 'var(--gradient-primary)';

// going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)'; // for scaling the pictures ect and other if not h1. 
});
*/




///////////////// LIFECYCLE DOM EVETNS
////////////////
/*
document.addEventListener('DOMContentLoaded', function(e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function(e) {
  console.log('Page fully loaded', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
*/