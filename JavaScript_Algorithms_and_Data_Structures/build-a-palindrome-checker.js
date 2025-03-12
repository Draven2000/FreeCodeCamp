// initialise constants
const text = document.querySelector("#text-input");
const button = document.querySelector('#check-btn');
const resultMessage = document.querySelector('#result');
const errorMessage = document.querySelector('#error-message');

// Read text input from document
const textInput = document.getElementById("text-input");

// define function to check if value blank.
const isBlank = (inputValue) => {
    if (inputValue === "") {
      console.log("Please insert value");
      resultMessage.style.display="none";
      errorMessage.style.display="block";
      errorMessage.textContent = `Error: Input cannot be empty!`;
      alert("Please input a value");
      return true
    } else {
      console.log("Value Detected");
      console.log(inputValue);
      resultMessage.style.display="block";
      errorMessage.style.display="none";
      return false
    }
  };

function cleanInputString(str) {
  const regex = /[(),._+:/-\s]/g;
  return str.replace(regex, '');
}


const isPalindrome = (inputValue) =>{
  let cleanInput = cleanInputString(inputValue).toLowerCase();
  const reversedInput = cleanInput.split('').reverse().join('');
  console.log(reversedInput);


  if (isBlank(inputValue)) {
  } else if (cleanInput !== reversedInput) {
    resultMessage.textContent = `${inputValue} is not a palindrome`;
    resultMessage.style.backgroundColor = "var(--wrong-colour)";
    resultMessage.style.color = "var(--wrong-text-colour)";
  } else {
    resultMessage.textContent = `${inputValue} is  a palindrome`;
    resultMessage.style.backgroundColor = "var(--correct-colour)";
    resultMessage.style.color = "var(--correct-text-colour)";
  }
};


button.addEventListener("click", (e) => {
e.preventDefault();
  isPalindrome(textInput.value);
});

