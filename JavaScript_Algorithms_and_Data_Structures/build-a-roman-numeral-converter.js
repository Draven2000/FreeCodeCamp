// initialise constants from HTML
const button = document.getElementById("convert-btn");
const outputMessage = document.getElementById("output");
const numberInput = document.getElementById("number");

/*
M = 1000
D = 500
C = 100
L = 50
X = 10
V = 5
I = 1

Only I, X, and C can be used as numerals for subtraction. (1s)
V, L, and D are never subtracted. (5s)

I can only be subtracted from V and X. 
X can only be subtracted from L and C. 
C can only be subtracted from D and M. 

Create a series of functions to check the current highest numeral available in a call stack.
Also using Recursion to call upon the function within the function.
*/
let output = "";

const isM = (input, output)=>{
  if ((Math.floor(input / 1000)) > 0){
    input -= 1000;
    return isM(input, output + "M");
  } else if (input >= 900 & input < 1000){
    input -= 900;
    return isC(input, output + "CM");
  } else {
      return isD(input, output);
  }
}

const isD = (input, output)=>{
  if ((Math.floor(input / 500)) > 0){
    input -= 500;
    return isD(input, output + "D");
  } else if (input >= 400 & input < 500){
    input -= 400;
    return isC(input, output + "CD");
  } else {
    return isC(input, output);
  }
}
const isC = (input, output)=>{
  if ((Math.floor(input / 100)) > 0){
    input -= 100;
    return isC(input, output + "C");
  } else if (input >= 90 & input < 100){
    input -= 90;
    return isX(input, output + "XC");
  } else {
    return isL(input, output);
  }
}

const isL = (input, output)=>{
  if ((Math.floor(input / 50)) > 0){
    input -= 50;
    return isL(input, output + "L");
  } else if (input >= 40 & input < 50){
    input -= 40;
    return isX(input, output + "XL");
  } else {
    return isX(input, output);
  }
}

const isX = (input, output)=>{
  if ((Math.floor(input / 10)) > 0){
    input -= 10;
    return isX(input, output + "X");
  } else if (input === 9){
    return output + "IX";
  } else {
    return isV(input, output);
  }
}

const isV = (input, output)=>{
  if ((Math.floor(input / 5)) > 0){
    input -= 5;
    return isV(input, output + "V");
  } else if (input === 4){
    return output + "IV";
  }
  else {
    return output + "I".repeat(input);
  }
}

// Finally, add a base for the stack when input = 1
const decimalToRoman = (input) => {
  if  (input === 1) {  return "I"; }
  else  { return isM(input, "");  }
}

// Write function to check input is valid and then convert number if true
const checkUserInput = () => {
  const inputInt = parseInt(numberInput.value);
  outputMessage.style.display="block";
  if (!numberInput.value || isNaN(inputInt)) {
    outputMessage.textContent = "Please enter a valid number";
    outputMessage.style.backgroundColor = "var(--wrong-colour)";
    outputMessage.style.color = "var(--wrong-text-colour)";
    return;
  } else if (inputInt <= 0){
    outputMessage.textContent = "Please enter a number greater than or equal to 1";
    outputMessage.style.backgroundColor = "var(--wrong-colour)";
    outputMessage.style.color = "var(--wrong-text-colour)";
    return;
  } else if (inputInt > 3999){
    outputMessage.textContent = "Please enter a number less than or equal to 3999";
    outputMessage.style.backgroundColor = "var(--wrong-colour)";
    outputMessage.style.color = "var(--wrong-text-colour)";
    return;
  } else { // Input passed all tests
    outputMessage.style.backgroundColor = "var(--correct-colour)";
    outputMessage.style.color = "var(--correct-text-colour)";
  }
  output = "";
  outputMessage.textContent = decimalToRoman(inputInt);
  numberInput.value = "";
};

// Clicking button converts number
button.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent the form from refreshing the page
  checkUserInput();
});

// Allow user to press enter as well as clicking the check button
form.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); 
    checkUserInput();
  }
});

