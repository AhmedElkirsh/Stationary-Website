import {tagList} from './shop.js'
import {createAttributedElement} from './getProductData.js'

export function getFilterTags(categoryProducts) {
    return [...new Set(categoryProducts.flatMap(item => item.tags))];
}

export function generateFilterTags(categoryTags) {
    if (tagList.children.length) {tagList.innerHTML = ''};

    for (let tag of categoryTags) {
        let listItem = document.createElement('li');
        let button = createAttributedElement("button", {className: "tag"});
        button.textContent = tag;
        listItem.appendChild(button);
        tagList.appendChild(listItem);
    };
}

export function addTagEvents() {
    let tagsInList = document.getElementsByClassName('tag');
    for (let tag of tagsInList) {
        tag.addEventListener("click", ()=>{
            tag.classList.toggle('selected-tag');
        });
    }
}