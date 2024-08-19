let backToTopBtn = document.getElementById('backTop') 
window.onscroll = ()=>{
    if (window.scrollY > 0 ) {
        backToTopBtn.style.display = 'block'
    } else {
        backToTopBtn.style.display = 'none'
    } 
}
/////////////////////////////////////////////////////////////
window.addEventListener('DOMContentLoaded',()=>{
    const slides = document.querySelectorAll('.slide')
    for (let slide of slides) {
        slide.classList.add('smooth-transition-slider')
    }
})
//////////////////////////////////////////////////////////////////////////////////////
backToTopBtn.addEventListener('click',()=>{
    window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
})


let controls = document.querySelector('.controls');
let nextBtn = controls.lastElementChild;
let previousBtn = controls.firstElementChild;

let currentIndex = 0;

let intervalID = setInterval(()=>{
    swipe(1)
}, 2000);

nextBtn.addEventListener('click', () => {
    clearInterval(intervalID)
    intervalID = setInterval(()=>{
        swipe(1)
    }, 2000);
    swipe(1);   
});
previousBtn.addEventListener('click', () => {
    clearInterval(intervalID)
    intervalID = setInterval(()=>{
        swipe(1)
    }, 2000);
    swipe(-1);   
});

let slides = Array.from(document.querySelectorAll('.slide'))
slides.forEach(slide=>{
    slide.addEventListener('mouseover',()=>{
        clearInterval(intervalID)
    })
    slide.addEventListener('mouseleave',()=>{
        intervalID = setInterval(()=>{
            swipe(1)
        }, 2000);
    })
})

/* nextBtn.addEventListener('click', (e) => {
    if (currentIndex===3) {
        disableButton(nextBtn)
        e.preventDefault() 
    } else {
        enableButton(nextBtn)
        swipe(1);
    }
});

previousBtn.addEventListener('click', (e) => {
    if (currentIndex===0) {
        disableButton(previousBtn)
        e.preventDefault()    
    } else {
        swipe(-1);
    }
}); */
/* function disableButton(Btn) {
    Btn.classList.add('disabled-button')
}
function enableButton(Btn) {
    Btn.classList.remove('disabled-button')
} */
function swipe(indexDifference) {
    let slides = document.getElementsByClassName('slide');
    let totalSlides = slides.length;
    
    currentIndex = (currentIndex + indexDifference + totalSlides) % totalSlides;
    controlBtnHighlight(currentIndex)
 
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.transform = `translateX(-${currentIndex * 100}%)`;
    }    
}
function controlBtnHighlight(currentIndex) {
    Array.from(document.querySelectorAll('.navigation-circle')).forEach((circle,index)=>{
        currentIndex === index? circle.classList.add('slider-circle-highlight') : circle.classList.remove('slider-circle-highlight')
    })
}
///////////////////////////////////////////////////////////////////////
let questions = Array.from(document.querySelectorAll('#faq details'));

questions.forEach((question) => {
    question.addEventListener('click', () => {
        const otherQuestions = questions.filter(q => q !== question);
        closeOther(otherQuestions);
    });
});

function closeOther(questions) {
    questions.forEach(question => {
        question.open = false;
    });
}
//////////////////////////////////////////////////////////////////////////////////////////
