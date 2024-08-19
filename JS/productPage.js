import { getImage, getImages, getName, getRating, getPrice, getStyles, createAttributedElement, getAvailability, getImageIndex, getDescription } from './getProductData.js';
import {generateCartDropdown} from './nav.js'
const focusedProduct = document.getElementById('focused-product');
const relatedItems = document.getElementById('related-items');

window.addEventListener("DOMContentLoaded", () => {
    const productData = JSON.parse(sessionStorage.getItem('currentProduct'));
    generateMainContent(productData[0]);
    generateRelatedContent();
});

function generateMainContent(productData) {
    const productGallery = getImages(productData);
    const productName = getName(productData, 'h1');
    const productPrice = getPrice(productData);
    const productRating = getRating(productData);
    const productAvailability = getAvailability(productData, getImageIndex(productData));
    const productStyles = getStyles(productData);

    const content = createAttributedElement('div', { className: 'content' });
    const info = createAttributedElement('div', { className: 'info' });
    const actions = generateActionButtons(productAvailability);

    const descriptionTitle = document.createElement('h2');
    descriptionTitle.textContent = 'Description';
    const description = getDescription(productData);
    const main = document.querySelector('main');

    info.append(productName, productPrice, productRating, productAvailability, productStyles);
    content.append(info, actions);
    focusedProduct.append(productGallery, content);
    main.append(descriptionTitle, description);
    countingQuantity();
    doStyles();
    doGallery();
    initializeAddToCartButtons();

    if (productAvailability.textContent !== 'Sold Out') {
        document.querySelectorAll('.style')[getImageIndex(productData)].classList.add('selected-style');
    }

    document.querySelectorAll('.gallery .img-container img')[1]?.classList.add('selected-img');
}

function generateActionButtons(productAvailability) {
    let available = productAvailability.textContent !== 'Sold Out' ? true : false;

    const decrementBtn = createAttributedElement('button', { className: `decrement` });
    const decrementIcon = createAttributedElement('i', { className: 'minus' });
    decrementBtn.append(decrementIcon);

    const quantityNum = createAttributedElement('span', { className: 'count' });
    quantityNum.textContent = '1';

    const incrementBtn = createAttributedElement('button', { className: `increment` });
    const incrementIcon = createAttributedElement('i', { className: 'plus' });
    incrementBtn.append(incrementIcon);

    const ctaButton = createAttributedElement('button', { className: `add-to-cart ${available ? '' : 'disabled'}` });
    ctaButton.textContent = 'Add to cart';

    const actions = createAttributedElement('div', { className: 'actions' });
    const quantity = createAttributedElement('div', { className: `quantity ${available ? '' : 'disabled'}` });

    quantity.append(decrementBtn, quantityNum, incrementBtn);
    actions.append(quantity, ctaButton);
    return actions;
}

function generateRelatedContent() {
    const relatedProducts = JSON.parse(sessionStorage.getItem('currentCategory'));
    const productData = JSON.parse(sessionStorage.getItem('currentProduct'));
    let i = 1;
    for (let relatedProduct of relatedProducts) {
        if ((relatedProduct.id === productData[0].id)) {
            continue;
        } else if (i > 6) {
            break;
        }
        const productImage = getImage(relatedProduct, 0);
        const productName = getName(relatedProduct, 'h4');
        const productPrice = getPrice(relatedProduct);
        const relatedItemContainer = createAttributedElement('div', { className: 'related-item-container' });
        const relatedItemContentContainer = createAttributedElement('div', { className: 'related-item-content-container' });

        relatedItemContentContainer.append(productName, productPrice);
        relatedItemContainer.append(productImage, relatedItemContentContainer);
        relatedItems.append(relatedItemContainer);
        productCache();
        i++;
    }
}

function productCache() {
    let productLinks = document.getElementsByClassName('product-link');
    for (let link of productLinks) {
        link.addEventListener("click", (e) => {
            let productName = e.target.textContent.trim();
            let currentCategory = JSON.parse(sessionStorage.getItem("currentCategory"));
            let selectedProduct = currentCategory.filter(product => product.name.trim() === productName);
            sessionStorage.setItem('currentProduct', JSON.stringify(selectedProduct));
            window.location.reload();
        });
    }
}

function countingQuantity() {
    let increment = document.querySelector('article .increment');
    let decrement = document.querySelector('article .decrement');

    increment.addEventListener('click', () => {
        if (increment.parentNode.classList.contains('disabled')) return;
        document.querySelector('article .count').textContent = parseInt(document.querySelector('article .count').textContent) + 1;
    });
    decrement.addEventListener('click', () => {
        if (decrement.parentNode.classList.contains('disabled')) return;
        if (parseInt(document.querySelector('article .count').textContent) > 1) {
            document.querySelector('article .count').textContent = parseInt(document.querySelector('article .count').textContent) - 1;
        }
    });
}

function addToCart(selectedProduct, styleIndex) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => (item.product.id === selectedProduct.id) && (item.StyleIndex === styleIndex));
    let quantity = parseInt(document.querySelector('article .count').textContent);

    if (item) {
        if (selectedProduct.variations[styleIndex].stock - (quantity + item.count) < 0) {
            alert('Not enough stock');
        } else {
            item.count += quantity;
            alert('Successfully Added to cart');
        }
    } else {
        cart.push({ product: selectedProduct, StyleIndex: styleIndex, count: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    document.querySelector('article .count').textContent = 1;
    generateCartDropdown(cart)
}

function initializeAddToCartButtons() {
    let addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            button.classList.contains('disabled') ? button.preventDefault() : '';
            let productElement = e.target.closest('article');
            let productName = productElement.querySelector('h1').textContent.trim();
            let StyleIndex = Array.from(document.querySelectorAll('.style')).findIndex(style => style.classList.contains('selected-style'));
            let currentCategory = JSON.parse(sessionStorage.getItem("currentCategory"));
            let selectedProduct = currentCategory.find(product => product.name.trim() === productName);
            addToCart(selectedProduct, StyleIndex);
        });
    });
}

function doStyles() {
    let styles = document.querySelectorAll('.style');
    const product = JSON.parse(sessionStorage.getItem('currentProduct'))[0];
    let images = product.variations.map(instance => instance.image);

    styles.forEach((style, index) => {
        if (!product.variations[index].stock) {
            style.classList.add('unavailable-style');
        }
        style.addEventListener('click', (e) => {
            if (!style.classList.contains('unavailable-style')) {
                highLightSelected('.style', 'selected-style', e.target);
                changeMasterImage(images[index], 0);
                highLightSelected('.gallery .img-container img', 'selected-img', document.querySelectorAll('.gallery .img-container img')[1]);
                document.querySelector('.stock').textContent = getAvailability(product, index).textContent;
            }
        });
    });
}

function doGallery() {
    const allImages = document.querySelectorAll('.gallery .img-container img');
    const gallery = Array.from(allImages).slice(1);
    const product = JSON.parse(sessionStorage.getItem('currentProduct'))[0];
    let images = product.variations.map(variation => variation.image);
    gallery.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            highLightSelected('.gallery .img-container img', 'selected-img', e.target);

            let currentStyleIndex = Array.from(document.querySelectorAll('.style')).findIndex(style => style.classList.contains('selected-style'));
            if (index === 0) {
                changeMasterImage(images[currentStyleIndex], index);
            } else {
                changeMasterImage(img, index);
            }
        });
    });
}

function highLightSelected(selector, className, target) {
    document.querySelectorAll(selector).forEach(img => img.classList.remove(className));
    target.classList.add(className);
}

function changeMasterImage(image, index) {
    const masterImage = document.querySelector('.gallery .img-container img');
    masterImage.src = image.src;
    masterImage.alt = image.alt;
}

window.addEventListener('hashchange', () => {

    const hash = window.location.hash.substring(1);
    
    const currentCategory = JSON.parse(sessionStorage.getItem('currentCategory'));
    const selectedProduct = currentCategory.find(product => parseInt(product.id) === parseInt(hash));

    if (selectedProduct) {
        sessionStorage.setItem('currentProduct', JSON.stringify([selectedProduct]));
        window.location.reload();
    } else {
        window.location.href = 'noProductFound.html'
    }

});

////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    const aside = document.querySelector('aside');
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '10px', // Consider adding a margin to start observing earlier
        threshold: 0 // Trigger when the footer starts to enter the viewport
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            
             if (entry.isIntersecting && window.scrollY !== 0) {              
                aside.classList.remove('fixed');
                aside.style.alignSelf = 'flex-end';              
            } else {
                aside.classList.add('fixed');
                aside.style.alignSelf = '';        
            }
        });
    }, observerOptions);
    observer.observe(footer);
});
////////////////////////////////////////////////////////////////////////////////////////