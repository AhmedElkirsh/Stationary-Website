import {getImage, getName, getRating, getPrice, getButtons, getAvailability,getImageIndex,getStyles, createAttributedElement} from './getProductData.js'
import {generateCartDropdown} from './nav.js'

let cartSection = document.querySelector('section')

function createItem(item,index) {
    let itemContainer = createAttributedElement('div',{className:'item'})
    let itemRemoveBtn = createAttributedElement('button',{className:'remove'})
    /*insert icon here*/
    itemRemoveBtn.textContent = 'X'
    let itemImg = getImage(item.product,item.StyleIndex)

    let nameNstyle = createAttributedElement('div',{className:'name-style'})
    let itemName = getName(item.product,'h2')
    let itemStyle = createAttributedElement('button',{className:'style'})
    itemStyle.textContent = item.product.variations[item.StyleIndex].style
    nameNstyle.append(itemName,itemStyle)

    let itemQuantity = createAttributedElement('div',{className:'quantity'})
    let qunatityDec = createAttributedElement('button',{className:'decrement'})
    let decIcon = createAttributedElement('i',{className:'minus'})
    qunatityDec.append(decIcon)
    let qunatityCount = createAttributedElement('span',{className:'count'})
    qunatityCount.textContent = item.count
    let qunatityInc = createAttributedElement('button',{className:'increment'})
    let incIcon = createAttributedElement('i',{className:'plus'})
    qunatityInc.append(incIcon)
    itemQuantity.append(qunatityDec,qunatityCount,qunatityInc)
    
    let itemPrice = createAttributedElement('p',{className:'price'})
    itemPrice.textContent=`${(item.product.price*item.count).toFixed(2)} EGP`
    itemContainer.append(itemRemoveBtn,itemImg,nameNstyle,itemQuantity,itemPrice)

    let fragment = document.createDocumentFragment()
    fragment.append(itemContainer)
    cartSection.append(fragment)

    addQuantityFunctionality(itemQuantity,item,index)
    addRemovingFunctionality(itemRemoveBtn,item,index)
    updatePayments()
}
function getCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    console.log(cart);
    if (cart.length !== 0) {
        cartSection.innerHTML = '';

        cart.forEach((item,index) => {
            createItem(item,index)

        });
    } else {
        cartSection.innerHTML = '<p>add items to cart and they will show up here</p>';
    }
    generateCartDropdown(cart)

}
window.addEventListener('DOMContentLoaded',()=>{
    getCart()
})

function addQuantityFunctionality(quantityContainer,item,indexInCart) {
    let cart = JSON.parse(localStorage.getItem('cart'))
    quantityContainer.firstElementChild.addEventListener('click',()=>{
        let count = quantityContainer.querySelector('span')
        if(parseInt(count.textContent)>1) {
            count.textContent = parseInt(count.textContent)-1
            item.count = parseInt(count.textContent)
            cart[indexInCart] = item
            localStorage.setItem('cart',JSON.stringify(cart))
            getCart()
        }
        
    }) 
    quantityContainer.lastElementChild.addEventListener('click',()=>{
        let count = quantityContainer.querySelector('span')
        console.log(item);
        if (item.product.variations[item.StyleIndex].stock - (parseInt(count.textContent) + item.count) < 0) {
            alert('not enough stock');
        } else {
            count.textContent = parseInt(count.textContent)+1
            item.count = parseInt(count.textContent)
            cart[indexInCart] = item
            localStorage.setItem('cart',JSON.stringify(cart))
            getCart()
        }       
    }) 
}

function addRemovingFunctionality(itemRemoveBtn,item,index) {
    let cart = JSON.parse(localStorage.getItem('cart'))
    itemRemoveBtn.addEventListener('click',()=>{
        cart.splice(index,1)
        localStorage.setItem('cart',JSON.stringify(cart))
        getCart()
    })
}


let inputs = document.querySelectorAll('input')
inputs.forEach((input,index)=>{
    input.addEventListener('focus',()=>{
        switch (index) {
            case 2:
                setTimeout(()=>{
                    input.placeholder = 'XXXX XXXX XXXX XXXX'
                },50)
                break;
            default:
                break;
        }
        
    })
    input.addEventListener('input',()=>{
        input.placeholder = ''
    })
    input.addEventListener('blur',()=>{
        input.placeholder = ''
    })
})
function updatePayments() {
    let prices = Array.from(document.querySelectorAll('.price')).map(price => parseInt(price.textContent))
    console.log(prices);
    let subtotalValue = prices.reduce((prev, cur) => prev + cur, 0);
    const subtotal = document.getElementById('subtotal')
    const shipping = document.getElementById('shipping')
    const total = document.getElementById('total')
    const tax = 0.14
    subtotal.textContent = `${subtotalValue.toFixed(2)} EGP`
    total.textContent = `${(parseInt(subtotal.textContent)*(1+tax)+parseFloat(shipping.textContent)).toFixed(2)} EGP`
}
document.querySelector('main form').addEventListener('submit',(e)=>{
    e.preventDefault()
    localStorage.setItem('cart', JSON.stringify([]));
    window.location.href = 'successful.html'
})
//////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    const form = document.querySelector('main form');
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '10px', // Consider adding a margin to start observing earlier
        threshold: 0 // Trigger when the footer starts to enter the viewport
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            
             if (entry.isIntersecting && window.scrollY !== 0) {              
                form.classList.remove('fixed');
                form.parentNode.style.alignSelf = 'flex-end';              
            } else {
                form.classList.add('fixed');
                form.parentNode.style.alignSelf = '';        
            }
        });
    }, observerOptions);
    observer.observe(footer);
});
/////////////////////////////////////////////////////////////////////////////////////////