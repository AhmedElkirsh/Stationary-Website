export function createAttributedElement(tag, ...attributes) { 
    let element = document.createElement(tag);
    attributes.forEach((pair) => {
        element = Object.assign(element, pair); 
    });
    return element;
}

export function getImage(item, i) {
    let imgContainer = createAttributedElement('div', { className: 'img-container' });
    let img = createAttributedElement('img', { src: item.variations[i].image.src }, { alt: item.variations[i].image.src }); 
    imgContainer.appendChild(img);
    return imgContainer;
}
export function getImageIndex(item) {

    let index = item.variations.findIndex(variation => variation.stock > 0);
    index = index === -1 ? 0 : index

    return index;
}
export function getImages(item) {
    let gallery = createAttributedElement('div',{className:'gallery'})
    gallery.append(getImage(item, getImageIndex(item))) //first image (displayed)
    gallery.append(getImage(item, getImageIndex(item))) 
    if (item.images.length>1)
    item.images.forEach((image)=>{
        let imgContainer = createAttributedElement('div', { className: 'img-container' });
        let img = createAttributedElement('img', { src: image.src }, { alt: image.src }); 
        imgContainer.appendChild(img);
        gallery.append(imgContainer)
    })
    return gallery
}
export function getAvailability(item,i) {
    let availability = createAttributedElement('p', { className: 'stock' });
    if (item.variations[i].stock === 0) {
        availability.textContent = "Sold Out";
    } else if (item.variations[i].stock < 10) {
        availability.textContent = "Limited Stock";
    } else {
        availability.textContent = "In Stock";
    }
    return availability;
}

export function getName(item, heading) {
    let itemName = document.createElement(heading);
    let linkToProductPage = createAttributedElement('a', { href: `/productPage.html#${item.id}` }, { className: 'product-link' });
    linkToProductPage.textContent = item.name;
    itemName.appendChild(linkToProductPage);
    return itemName;
}

export function getRating(item) {
    const allAvgRatings = JSON.parse(sessionStorage.getItem('allAverageRating'));
    const numberOfVotes = allAvgRatings[item.id].numberOfRatings;
    const averageRating = allAvgRatings[item.id].averageRating;
    
    let votes = createAttributedElement('span', { className: "number-of-votes" });
    votes.textContent = `(${numberOfVotes})`;

    let stars = createAttributedElement('div', { className: "stars" });
    for (let i = 1; i <= 5; i++) {
        let star;
        if (averageRating >= i) {
            star = createAttributedElement('i', { className: "star" });
        } else if (averageRating >= i - 0.5) {
            star = createAttributedElement('i', { className: "star-half" });
        } else {
            star = createAttributedElement('i', { className: "star-border" });
        }
        stars.appendChild(star);
    }
    stars.appendChild(votes);
    return stars;
}

export function getPrice(item) {
    let price = createAttributedElement('p', { className: 'price' });
    price.textContent = item.price.toFixed(2) + " EGP";
    return price;
}

export function getButtons(cardAvailability) {

    let available = cardAvailability.textContent !== 'Sold Out'? true : false
    let buttons = createAttributedElement('div', { className: 'btn-container' });
    let buttonsFragment = document.createDocumentFragment();

    let decrement = createAttributedElement('button',  { className: `decrement ${available? '' : 'disabled'}` });
    let decrementIcon = createAttributedElement('i', { className: 'minus-white' });
    available? decrement.appendChild(decrementIcon): '';

    let button = createAttributedElement('button', { className: `add-to-cart ${available? '' : 'disabled'}` });
    let count = createAttributedElement('span', { className: 'card-count' });
    count.textContent = '1';
    available? button.textContent = "Add to Cart": button.innerHTML = 'Unavailable';
    button.appendChild(count); 

    let increment = createAttributedElement('button', { className: `increment ${available? '' : 'disabled'}` });
    let incrementIcon = createAttributedElement('i', { className: 'plus-white' });
    available? increment.appendChild(incrementIcon) : '';

    buttonsFragment.append(decrement, button, increment);
    buttons.appendChild(buttonsFragment);

    return buttons;
}
export function getDescription(item) {
    let description = createAttributedElement('p', { className: 'description' });
    description.textContent = item.description;
    return description;
}

export function getStyles(item) {
    let styleCollection = createAttributedElement('div',{className:'styles'}) 
    item.variations.forEach((instance)=> {
        let styleElement = createAttributedElement('button', { className: 'style' });
        styleElement.textContent = instance.style
        styleCollection.append(styleElement)
    })
    return styleCollection;
}
