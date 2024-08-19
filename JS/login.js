import {isValidInput, showInvalid, showReset, showNeutral} from './utils.js';

let loginInputs = document.querySelectorAll("div.login input")
let loginEmail = document.getElementById("login-email")
let loginPassword = document.getElementById("login-password")
let rememberMeCheckbox = document.getElementById("remember-me")
let loginSubmitBtn = document.getElementById("login-submitBtn")
let loginForm = document.querySelector(".login form")
let formErrorMsg = document.querySelector(".login > p")
let remember = true;

let focusedInputs = new Set(); 

// handeling autofill 
window.addEventListener("load", () => {
    setTimeout(() => {
        loginInputs.forEach((input) => {
            if (input.matches(":-webkit-autofill") || input.value) {
                if(input.type !== "checkbox")
                showNeutral(input);
            }
        });
    }, 100); 
});
/* this is where we check if the format of the email correct or not*/
loginInputs.forEach((input)=>{
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
    input.addEventListener("change", () => {
        if(!focusedInputs.has(input.id)) {
            if(isValidInput(input)) {
                showNeutral(input)
            } else {
                showInvalid(input)
            }
        }
        focusedInputs.add(input.id)
    })
})
loginEmail.addEventListener("input", () => {  
    if (loginEmail.value === "") {
        showNeutral(loginEmail)
    }  else if (isValidInput(loginEmail)) {
        showNeutral(loginEmail)   
    } else {
        showInvalid(loginEmail)
    } 
})
// handling remember me value for auto-login
rememberMeCheckbox.addEventListener("click",()=>{
    remember = rememberMeCheckbox.checked? true : false 
})
// handling failed sumbit attempt
loginSubmitBtn.addEventListener("click", function(e) {

    let formIsValid = true;
    if (loginEmail.value !== localStorage.getItem("Email") || loginPassword.value !== localStorage.getItem("Password")) {
        formIsValid = false;
        formErrorMsg.style.display = "block"
    }
   
   
    if (!formIsValid) {
        e.preventDefault();
    } else if (remember) {
        localStorage.setItem("remember me", "yes")
    } 
    
});
// handling successful sumbit attempt
loginForm.addEventListener("submit",function(e){
    e.preventDefault();
    let targetUrl = decideTargetUrl();
    this.action = targetUrl;
    this.submit();
});
function decideTargetUrl() {
    return "homepage.html"
}