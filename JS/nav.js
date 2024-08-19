
import { getImage, getName, createAttributedElement } from './getProductData.js';
// Initialize primary color from localStorage or default value
let primaryColor = localStorage.getItem('Primary Color') || '#007bff';
document.documentElement.style.setProperty('--primary', primaryColor);

// Update color swatch input and save changes to localStorage
let colorSwatch = document.getElementById("color-swatch");
colorSwatch.value = primaryColor; // Set initial value of color swatch input

colorSwatch.addEventListener("input", () => {
    let newColor = colorSwatch.value;
    document.documentElement.style.setProperty('--primary', newColor);
    localStorage.setItem('Primary Color', newColor);
});
// handeling redirection to login if not remembered
window.onload = function() {
    let rememberMeValue = localStorage.getItem('remember me');
    if (rememberMeValue === 'no') {
        window.location.href = 'login.html';
    }
};
///////////////////////////////////////////////////////////////////////////////////////
let signOut = document.getElementById("sign-out")
let options = document.querySelectorAll(".detailed-nav-options")
let summaries = document.querySelectorAll('nav summary')

signOut.addEventListener("click", ()=>{
    localStorage.setItem("remember me","no")
    window.location.href="login.html"
})

let show = function(details) {
    details.open = true
    details.style.color = "var(--primary)"
}
let hide = function(details) {
    details.open = false
    details.style.color = "var(--text)"
}
let checkOptionsHover = function(details) {
    let detailedOptions = details.querySelector('.detailed-nav-options');
    setTimeout(() => {
        detailedOptions.matches(":hover")? show(details) : hide(details)
    }, 200);
}

window.addEventListener('DOMContentLoaded',()=>{
    summaries.forEach((summary)=>{
        summary.addEventListener("mouseover",()=>show(summary.parentNode))
        summary.addEventListener("mouseleave",()=>checkOptionsHover(summary.parentNode))
    })
})
options.forEach((option)=>{
    option.addEventListener("mouseover", (event) => {
        let parentNode = event.target.closest('details');
        if (parentNode) {
            show(parentNode);
        }
    });
    option.addEventListener("mouseleave", (event) => {
        let parentNode = event.target.closest('details');
        if (parentNode) {
            hide(parentNode);
        }
    });
})
/////////////////////////////////////////////////////////////////////////////////
// Base URL for category pages
let links = document.querySelectorAll('#shop .detailed-nav-options a');

links.forEach((link) => {
    let linkText = link.textContent.replace(' ', '-');
    link.href = `/shop.html#${linkText}`;
});

//////////////////////////////////////////////////////////////////////////////////
let cartListInNav = document.querySelector('#cart-icon .detailed-nav-options');

window.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    generateCartDropdown(cart);
});

export function generateCartDropdown(cart) {
    cartListInNav.innerHTML = ''; // Clear previous items
    if (!cart.length) {
        cartListInNav.innerHTML = '<p>Your cart is empty</p>'; // Display message if cart is empty
    } else {
        
        cart.forEach((item, index) => {
            generateCartDropdownListItem(item, index);
            
        });
        
    }
    updateOverAllCount()

}

function generateCartDropdownListItem(item, index) {
    
    let fragment = document.createDocumentFragment();
    let listItem = document.createElement('li');
    let cartItemImage = getImage(item.product, item.StyleIndex);
    let div = createAttributedElement('div', { className: 'name-quanitity' });
    let cartItemName = getName(item.product, 'h6');

    let cartItemQuantity = createAttributedElement('div', { className: 'quantity' });
    let quantityDec = createAttributedElement('button', { className: 'decrement' });
    let decIcon = createAttributedElement('i', { className: 'minus' });
    quantityDec.append(decIcon);
    let quantityCount = createAttributedElement('span', { className: 'count' });
    quantityCount.textContent = item.count;
    let quantityInc = createAttributedElement('button', { className: 'increment' });
    let incIcon = createAttributedElement('i', { className: 'plus' });
    quantityInc.append(incIcon);
    cartItemQuantity.append(quantityDec, quantityCount, quantityInc);
    let cartItemPrice = createAttributedElement('p', { className: 'price' });
    cartItemPrice.textContent = `${(item.count * item.product.price).toFixed(2)} EGP`;
    div.append(cartItemName, cartItemQuantity,cartItemPrice);

    let removeBtn = createAttributedElement('button', {className: "remove"})
    let removeIcon = createAttributedElement('click', {className: "minus"})
    removeBtn.append(removeIcon)
    listItem.append(cartItemImage, div, removeBtn);
    fragment.append(listItem);
    cartListInNav.append(fragment);
    addQuantityFunctionality(cartItemQuantity, item, index);
    addRemoveFunctionality(index);
}

function addQuantityFunctionality(quantityContainer, item, indexInCart) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    quantityContainer.firstElementChild.addEventListener('click', () => {
        let count = quantityContainer.querySelector('span');
        if (parseInt(count.textContent) > 1) {
            count.textContent = parseInt(count.textContent) - 1;
            item.count = parseInt(count.textContent);
            cart[indexInCart] = item;
            localStorage.setItem('cart', JSON.stringify(cart));
            getSubtotal(quantityContainer.parentNode.lastElementChild, item.count, item.product.price);
            updateOverAllCount()
        }
    });
    quantityContainer.lastElementChild.addEventListener('click', () => {
        let count = quantityContainer.querySelector('span');
        if (parseInt(count.textContent) < item.product.variations[item.StyleIndex].stock) {
            count.textContent = parseInt(count.textContent) + 1;
            item.count = parseInt(count.textContent);
            cart[indexInCart] = item;
            localStorage.setItem('cart', JSON.stringify(cart));
            getSubtotal(quantityContainer.parentNode.lastElementChild, item.count, item.product.price);
            updateOverAllCount()
        } else {
            alert('Not enough stock');
        }
    });
}
function addRemoveFunctionality(Index) {
    let listItems = Array.from(document.querySelectorAll('#cart-icon li'))
    let cart = JSON.parse(localStorage.getItem('cart'))
    listItems.forEach((listItem,index)=>{
        listItem.lastElementChild.addEventListener('click',()=>{
            listItem.remove()
            updateOverAllCount()
            cart.splice(Index,1)
            localStorage.setItem('cart',JSON.stringify(cart))          
        })
    })
    
}
/* function addRemovingFunctionality(itemRemoveBtn,item,index) {
    let cart = JSON.parse(localStorage.getItem('cart'))
    itemRemoveBtn.addEventListener('click',()=>{
        cart.splice(index,1)
        localStorage.setItem('cart',JSON.stringify(cart))
        getCart()
    })
} */

function getSubtotal(priceElement, count, price) {
    priceElement.textContent = `${(price * count).toFixed(2)} EGP`;
}
function updateOverAllCount() {
    let counts = Array.from(document.querySelectorAll('#cart-icon .detailed-nav-options .count'))
    counts = counts.map(count=> parseInt(count.textContent))
    let overAllCount = counts.reduce((acc, cur) => {
        return acc + cur
    },0)
    document.querySelector('.cart-count-nav').textContent = overAllCount? overAllCount : ''
    if(!overAllCount) cartListInNav.innerHTML = '<p>Your cart is empty</p>'; 
}
/////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('DOMContentLoaded',()=>{
    
    let navUsername = document.getElementById('username') ?? ''
    let username = localStorage.getItem('Name')
    let array = username.split(' ')

    let firstLastName = navUsername? `${array[0]} ${array[array.length-1]??''}` : 'guest'
    navUsername.textContent = firstLastName
})

document.querySelector('#cart-icon summary').addEventListener('click',()=>{
    window.location.href = 'cartCheckout.html'
})
