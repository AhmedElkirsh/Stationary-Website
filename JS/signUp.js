import {isValidInput, confirmInput, showValid, showInvalid, showReset, showNeutral} from './utils.js';
/* ----------  Elements  ------------ */ 
let inputs = document.querySelectorAll("div.sign-up input")
let termsConditions = document.getElementById("terms-conditions")
let signUpSubmitBtn = document.getElementById("signup-submitBtn")
let signUPForm = document.querySelector(".sign-up form")
// this constructor will store the ID's of the elements that has been focused for the first time
let focusedInputs = new Set(); 
/* ---------  functions  ------------ */
// this function at the moment is an overkill, but might be usefull later
function decideTargetUrl() {
    return "homepage.html"
}
/* -----------  events  ------------- */
// looping through the collection of inputs instead of capturing each input individually by id. 
inputs.forEach(input => {

    input.addEventListener("focus", () => {
        if (input.value === "") {
            showNeutral(input)
        }
    })
    input.addEventListener("blur", () => {
        if (input.value === "") {
            showReset(input)
        }
    })
    // this event handels user's first data entry in each field, for better UX it's good if we don't show an error to the user on his first try
    input.addEventListener("change", () => {
        if(!focusedInputs.has(input.id)) {           
            if (input.dataset.confirm) {
                if (confirmInput(input)) {
                    showValid(input)
                } else {
                    showInvalid(input)
                }
            } else {
                if (isValidInput(input)) {
                    showValid(input)
                    // this if condition handels the situation where the user enters a valid confirmation input first then the original
                    if (confirmInput(input.parentNode.nextElementSibling.nextElementSibling.firstElementChild)) {
                        showValid(input.parentNode.nextElementSibling.nextElementSibling.firstElementChild)
                    }
                } else {
                    showInvalid(input) 
                }
            }
        } else if (input.value === "") {
            showReset(input)
        }
        focusedInputs.add(input.id)
    })
    // (except for first try) this input mechanism tells the user dynamically if his input is valid or not
    input.addEventListener("input", () => {
        if (focusedInputs.has(input.id)) {
            if (input.value === "") {
                showNeutral(input)
            } else if (input.dataset.confirm) {
                if (confirmInput(input)) {
                    showValid(input)
                } else {
                    showInvalid(input)
                }
            } else {
                if (isValidInput(input)) {
                    showValid(input)
                    // this if condition handels the situation where the user enters a valid confirmation input first then the original
                    if (confirmInput(input.parentNode.nextElementSibling.nextElementSibling.firstElementChild)) {
                        showValid(input.parentNode.nextElementSibling.nextElementSibling.firstElementChild)
                    }
                } else {
                    showInvalid(input)
                }
            } 
        }  
    })
})
// handeling terms & conditions error messsage seperately 
termsConditions.addEventListener("click", ()=>{
    termsConditions.checked? termsConditions.parentNode.nextElementSibling.style.color = "transparent": ""
})
// handeling the submit button
signUpSubmitBtn.addEventListener("click", function(e) {
    let formIsValid = true;
    // the user can leave some fields empty or enter some invalid inputs
    inputs.forEach(input => {
        if (input.classList.contains('invalid-input') || input.value.trim() === "") {
            input.parentNode.nextElementSibling.style.color = "red";
            formIsValid = false;
        }
    });
    // the user can't leave the terms & conditions unchecked
    if (!termsConditions.checked) {
        termsConditions.parentNode.nextElementSibling.style.color = "red";
        formIsValid = false;
    }
    // if entry is unsuccessful we prevent submitting if successful we store the data in local storage 
    if (!formIsValid) {
        e.preventDefault();
    } else {
        inputs.forEach((input)=>{
            if(!input.dataset.confirm && !input.parentNode.classList.contains("terms"))
            localStorage.setItem(input.nextElementSibling.textContent, input.value.trim())
        }) 
        localStorage.setItem("remember me", "yes")
    }
});
// redirecting the home page
signUPForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let targetUrl = decideTargetUrl();
    this.action = targetUrl;
    this.submit();
});