let regexPatterns = {
    "signup-name": /^[A-Za-z]{3,}(?:[ '-][A-Za-z]{3,})*$/,
    "signup-email": /^\w+([\.-]?\w)+@\w+([\.]?\w)+(\.[a-zA-Z]{2,3})+$/,
    "login-email": /^\w+([\.-]?\w)+@\w+([\.]?\w)+(\.[a-zA-Z]{2,3})+$/,
    "signup-password": /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "login-password": /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}
export function isValidInput(input) {
    let pattern = regexPatterns[input.id];
    return pattern.test(input.value.trim());
}
export function confirmInput(input) {
    let primaryInput = document.getElementById(input.dataset.confirm);
    return primaryInput.value.trim() === input.value.trim();
}
export function showValid(input) {
    input.classList.remove("neutral-input");
    input.nextElementSibling.classList.remove("neutral-label");
    input.classList.remove("invalid-input");
    input.nextElementSibling.classList.remove("invalid-label");
    input.classList.add("valid-input");
    input.nextElementSibling.classList.add("valid-label");
    input.parentNode.nextElementSibling.style.color = "transparent"
}
export function showInvalid(input) {
    input.classList.remove("neutral-input");
    input.nextElementSibling.classList.remove("neutral-label");
    input.classList.remove("valid-input");
    input.nextElementSibling.classList.remove("valid-label");
    input.classList.add("invalid-input");
    input.nextElementSibling.classList.add("invalid-label");
    input.parentNode.nextElementSibling.style.color = "red"
}
export function showReset(input) {
    input.classList.remove("neutral-input");
    input.nextElementSibling.classList.remove("neutral-label");
    input.classList.remove("invalid-input");
    input.nextElementSibling.classList.remove("invalid-label");
    input.classList.remove("valid-input");
    input.nextElementSibling.classList.remove("valid-label");
    input.parentNode.nextElementSibling.style.color = "transparent"
}
export function showNeutral(input) {
    input.classList.add("neutral-input");
    input.nextElementSibling.classList.add("neutral-label");
}