import { getFilterTags, generateFilterTags, addTagEvents } from './tags.js';
import { getImage, getName, getRating, getPrice, getButtons, getAvailability,getImageIndex } from './getProductData.js';
import {generateCartDropdown} from './nav.js'
import {priceRangeReset} from './priceSlider.js'

const productDataURL = "./JSON/itemsModified.JSON";
const averageRatingsURL = "./JSON/averageRatings.JSON";

export let tagList = document.querySelector('.tags-list');

let main = document.querySelector('main');
let anchors = document.querySelectorAll('.category li a');

let filteredCategoryByPrice = [];
let filteredCategoryByTags = [];

/*------------ Functions -------------*/
// Function to fetch data from a given URL
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
}
// Function to initialize data
async function initializeData() {
    try {
        const products = await fetchData(productDataURL);
        const avgRatings = await fetchData(averageRatingsURL);
        sessionStorage.setItem('allAverageRating', JSON.stringify(avgRatings));
        const categoryName = window.location.hash.slice(1).replace('-', ' '); 
        highlightCategory(categoryName);
        const category = getCategory(products, categoryName);
        if(!category.length) window.location.href = 'noCategoryFound.html'
        sessionStorage.setItem("currentCategory", JSON.stringify(category));
        generateCards(category);
        productCache();
        generateFilterTags(getFilterTags(category)); 
        addTagEvents();
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

// Function to highlight the selected category
function highlightCategory(categoryName) {
    anchors.forEach((anchor) => {
        anchor.parentNode.classList.remove("selected-category");
        if (anchor.parentNode.textContent === categoryName) {
            anchor.parentNode.classList.add('selected-category');
        }
    });   
}

// Function to filter products by category
function getCategory(allProductData, categoryName) {
    return allProductData.filter(product => product.category === categoryName);
}

// Function to generate product cards
function generateCards(data) {
    main.innerHTML = '';
    let fragment = document.createDocumentFragment();
    data.forEach(item => {
        let card = document.createElement('article');
        let cardImage = getImage(item,getImageIndex(item));
        let cardName = getName(item,'h2');
        let cardRating = getRating(item);
        let cardAvailability = getAvailability(item,getImageIndex(item));
        let cardPrice = getPrice(item);
        let cardButtons = getButtons(cardAvailability);
        card.append(cardImage, cardName, cardRating, cardAvailability, cardPrice, cardButtons);
        fragment.appendChild(card);
    });
    main.appendChild(fragment);
    
    initializeAddToCartButtons()
    addCountingFunctionality()
}
/////////////////////////////////////////
function updateFilteredCategory(category) {
    sessionStorage.setItem("filteredCategory", JSON.stringify(category));
}

function applyPrice() {
    let minPrice = parseInt(document.getElementById('minPriceLabel').value);
    let maxPrice = parseInt(document.getElementById('maxPriceLabel').value);
    let currentCategory = JSON.parse(sessionStorage.getItem("currentCategory"));

    // Initialize filteredCategory if it's empty
    if (!filteredCategoryByTags || filteredCategoryByTags.length === 0) {
        filteredCategoryByTags = currentCategory;
    }

    // Apply price filter
    let priceFilter = currentCategory.filter(product => {
        return product.price >= minPrice && product.price <= maxPrice;
    });

    // Merge previous filteredCategory with new priceFilter
    let filterResult = priceFilter.filter(item => {
        return filteredCategoryByTags.some(filteredItem => filteredItem.id === item.id);
    });

    // Update sessionStorage and generate cards
    updateFilteredCategory(filterResult);
    generateCards(filterResult);
    filteredCategoryByPrice = priceFilter
}


function applyTags() {
    let tagsInList = Array.from(document.getElementsByClassName('tag'));
    let currentCategory = JSON.parse(sessionStorage.getItem("currentCategory"));

    // Extract selected tag names
    let selectedTags = tagsInList
        .filter(tag => tag.classList.contains('selected-tag'))
        .map(tag => tag.textContent.trim());
    console.log('selected tags:' + selectedTags);
    // Initialize filteredCategory if it's empty
    if (!filteredCategoryByPrice || filteredCategoryByPrice.length === 0) {
        filteredCategoryByPrice = currentCategory;
    }
    console.log(filteredCategoryByPrice);

    // Apply tag filter
    let tagFilter = currentCategory.filter(product => {
        return product.tags.some(tag => selectedTags.includes(tag));
    });
    console.log(tagFilter);
    // filter previous filteredCategory with new tagFilter
    let filterResult = tagFilter.filter(item => {
        return filteredCategoryByPrice.some(filteredItem => filteredItem.id === item.id);
    });
    console.log(filterResult);
    // Update sessionStorage and generate cards
    updateFilteredCategory(filterResult);
    generateCards(filterResult);
    filteredCategoryByTags = tagFilter
}


function addCountingFunctionality() {
    let increments = document.querySelectorAll('.increment');
    let decrements = document.querySelectorAll('.decrement');
    increments.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.contains('disabled')? btn.preventDefault() : ''
            let count = btn.previousElementSibling.firstElementChild;
            let currentCount = parseInt(count.textContent);
            count.textContent = currentCount + 1;
            count.style.display = 'inline-block'; 
        });
    });
    decrements.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.contains('disabled')? btn.preventDefault() : ''
            let count = btn.nextElementSibling.firstElementChild;
            let currentCount = parseInt(count.textContent);
            if (currentCount === 2) {
                count.textContent = currentCount - 1;
                count.style.display = 'none'; 
            } else if (currentCount > 1) {
                count.textContent = currentCount - 1;
            }
        });
    });
}


function addToCart(selectedProduct, styleIndex,button) {    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let item = cart.find(item => (item.product.id === selectedProduct.id) && (item.StyleIndex === styleIndex));
    let quantity = parseInt(button.querySelector('span').textContent);

    if (item) {
        if (selectedProduct.variations[styleIndex].stock - (quantity + item.count) < 0) {
            alert('Not enough stock');
        } else {
            item.count += quantity;
            alert('Successfully added to cart');
        }
    } else {
        cart.push({ product: selectedProduct, StyleIndex: styleIndex, count: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    button.querySelector('span').textContent = 1;  
    button.querySelector('span').style.display = 'none';  
    generateCartDropdown(cart)
}

function initializeAddToCartButtons() {
    let addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {

        button.addEventListener('click', (e) => {
            if (button.classList.contains('disabled')) {
                e.preventDefault() 
            } else {
                let productElement = e.target.closest('article');
                let productIndex = Array.from(document.querySelectorAll('article')).findIndex(article => article===productElement)
                let productName = productElement.querySelector('h2').textContent.trim();
                
                let StyleIndex = JSON.parse(sessionStorage.getItem("currentCategory"))[productIndex].variations.findIndex(style => style.stock!==0)
                let currentCategory = JSON.parse(sessionStorage.getItem("currentCategory"));
                let selectedProduct = currentCategory.find(product => product.name.trim() === productName);
                addToCart(selectedProduct,StyleIndex,button);
            }
            
        });
    });
}
// Function to cache the selected product
function productCache() {
    let productLinks = document.getElementsByClassName('product-link');
    for (let link of productLinks) {
        link.addEventListener("click", (e) => {
            let productName = e.target.textContent.trim();
            let currentCategory = JSON.parse(sessionStorage.getItem("currentCategory"));
            let selectedProduct = currentCategory.filter(product => product.name.trim() === productName);
            sessionStorage.setItem('currentProduct', JSON.stringify(selectedProduct));
        });
    }
}
/*------------ Events -------------*/
window.addEventListener("DOMContentLoaded", initializeData);

anchors.forEach(anchor => {
    anchor.href = `/shop.html#${anchor.textContent.replace(' ', '-')}`;
    anchor.addEventListener("click", (e) => {
        if (anchor.href === window.location.href) {
            e.preventDefault();
        } else {
            initializeData();
        }
    });
});



document.getElementById('apply-tags').addEventListener('click', (e) => {
    if (document.getElementsByClassName('tag').length) e.preventDefault();
    applyTags();
});

document.getElementById('apply-price-range').addEventListener('click', applyPrice);

window.addEventListener('hashchange',initializeData);


Array.from(anchors).forEach(anchor=>{
    anchor.addEventListener('click',()=>{
        priceRangeReset()
    })
})



