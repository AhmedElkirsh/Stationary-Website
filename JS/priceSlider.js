// DOM elements
const priceSlider = document.getElementById('priceSlider');
let minPriceHandler = document.getElementById('min-price-handler');
let maxPriceHandler = document.getElementById('max-price-handler');
const track = document.getElementById('track');
const minPriceInput = document.getElementById('minPriceLabel');
const maxPriceInput = document.getElementById('maxPriceLabel');
// Slider dimensions and values
const sliderWidth = priceSlider.offsetWidth;
let minPrice = 100;
let maxPrice = 2000;
// Initial positions of handles
minPriceHandler.style.left = '0px';
maxPriceHandler.style.left = `${sliderWidth}px`;
export function priceRangeReset() {
    minPrice = 100;
    maxPrice = 2000;
    
    minPriceHandler.style.left = '0px';
    maxPriceHandler.style.left = `${sliderWidth}px`;

    minPriceInput.value = minPrice
    maxPriceInput.value = maxPrice

    const left = parseInt(minPriceHandler.style.left);
    const width = Math.abs(parseInt(maxPriceHandler.style.left) - parseInt(minPriceHandler.style.left));
    
    track.style.left = `${left}px`;
    track.style.width = `${width}px`;
}
// Functions for updating the track
    // updating the track via text input
let currentMinInputPrice = minPriceInput.value
let currentMaxInputPrice = maxPriceInput.value
function inputUpdateSlider() {
    if (isNaN(parseInt(minPriceInput.value)) || parseInt(minPriceInput.value) < 0 || isNaN(parseInt(maxPriceInput.value)) || parseInt(maxPriceInput.value)>maxPrice ) {
        minPriceInput.value = `${currentMinInputPrice}`
        maxPriceInput.value = `${currentMaxInputPrice}`
    } else {
        minPriceHandler.style.left = `${minPriceInput.value * (sliderWidth / (maxPrice - minPrice) + minPrice)}px`;
        maxPriceHandler.style.left = `${maxPriceInput.value * (sliderWidth / (maxPrice - minPrice) + minPrice)}px`;
        
    }
    // Updating the line between handles
    const left = parseInt(minPriceHandler.style.left)
    const width = Math.abs(parseInt(maxPriceHandler.style.left) - parseInt(minPriceHandler.style.left));
    track.style.left = `${left}px`;
    track.style.width = `${width}px`;
}
    // updating the track via mouse input
function dragUpdateSlider() {
    const Handle1Value = parseInt(minPriceHandler.style.left) / sliderWidth * (maxPrice - minPrice) + minPrice;
    const Handle2Value = parseInt(maxPriceHandler.style.left) / sliderWidth * (maxPrice - minPrice) + minPrice;

    minPriceInput.value = `${Math.round(Handle1Value)}`;
    maxPriceInput.value = `${Math.round(Handle2Value)}`;
    // Updating the line between handles
    const left = parseInt(minPriceHandler.style.left)
    const width = Math.abs(parseInt(maxPriceHandler.style.left) - parseInt(minPriceHandler.style.left));
    track.style.left = `${left}px`;
    track.style.width = `${width}px`;
}
// Functions for mouse behaviour (mouse down, mouse move, mouse up)
let activeHandle = null;
let initialX = 0;
let deltaX = 0;

function handleMouseDown(e) {
activeHandle = e.target;
initialX = e.clientX - deltaX;
}

function handleMouseMove(e) {
    if (activeHandle) {

        deltaX = e.clientX - initialX;
        let newPosition = parseInt(activeHandle.style.left) + deltaX;

        if (activeHandle === maxPriceHandler) {
            if (newPosition < parseInt(minPriceHandler.style.left)+(sliderWidth / (maxPrice - minPrice))) {
                newPosition = parseInt(minPriceHandler.style.left)+(sliderWidth / (maxPrice - minPrice))
            }    
        } else if (activeHandle === minPriceHandler) {
            if(newPosition > parseInt(maxPriceHandler.style.left)-(sliderWidth / (maxPrice - minPrice))) {
                newPosition = parseInt(maxPriceHandler.style.left)-(sliderWidth / (maxPrice - minPrice))
            }     
        }

        if (newPosition < 0) {
            newPosition = 0;
        }
        if (newPosition > sliderWidth) {
            newPosition = sliderWidth;
        }

        activeHandle.style.left = `${newPosition}px`;
        dragUpdateSlider();
        initialX = e.clientX;
    }
}
function handleMouseUp() {
    activeHandle = null;
}
/*------------Events-----------*/
/* searchButton.addEventListener("click",inputUpdateSlider) */
minPriceInput.addEventListener('change',inputUpdateSlider)
maxPriceInput.addEventListener('change',inputUpdateSlider)
minPriceHandler.addEventListener('mousedown', handleMouseDown);
maxPriceHandler.addEventListener('mousedown', handleMouseDown);

document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
/*-------Initialization-------*/
dragUpdateSlider();