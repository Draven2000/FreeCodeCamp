
// initialise constants from HTML
const result = document.getElementById("results-div");
const userInput = document.getElementById("user-input");
const checkButton = document.getElementById("check-btn");
const clearButton = document.getElementById("clear-btn");

const regex = /(^1?\s?|^1\s)((\(\d{3}\)\s?\d{3}-)|(\d{3}-\d{3}-)|(\d{3} \d{3} )|(\d{6}))\d{4}$/

// Define functions
const checkUserInput = () => {
  if (!userInput.value) {
    alert("Please provide a phone number");
    return;
  } else if (regex.test(userInput.value)){ 
    result.style.backgroundColor = "var(--correct-colour)";
    result.style.color = "var(--correct-text-colour)";
    result.style.display="block";
    const input = userInput.value;
    result.textContent = `Valid US number: ${input}`
  } else {
    result.style.backgroundColor = "var(--wrong-colour)";
    result.style.color = "var(--wrong-text-colour)";
    result.style.display="block";
    const input = userInput.value;
    result.textContent = `Invalid US number: ${input}`
  }
};

const clearResults = () => {
  result.style.display="none";
  result.textContent = "";
};

// Clicking check-btn checks number
checkButton.addEventListener("click", checkUserInput);

// Allow user to press enter as well as clicking the check button
checkButton.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkUserInput();
  }
});

// Clicking clear-btn clears output screen
clearButton.addEventListener("click", clearResults);