let price = 1.87;

let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];


// initialise constants from HTML
const button = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const totalChangeDue = document.getElementById("total-change-due");
const cashInput = document.getElementById("cash");
const priceLabel = document.getElementById("price-label");

const cidTotalMessage = document.getElementById("cid-total");

priceLabel.textContent = `Price of item: $${price}`


// Using map to extract the second value and reduce to sum them
// *100 then /100 to remove floating point errors.
const totalCid = (cid) => cid.map(item => item[1]*100).reduce((sum, value) => sum + value, 0)/100;

let total = totalCid(cid)

cidTotalMessage.textContent = total


// Build a table
function generateTable() {
    const tableBody = document.querySelector("#cid-table tbody");
    tableBody.innerHTML = ''; // Clear current table rows
    
    cid.forEach(item => {
        const row = document.createElement('tr');
        
        const denomCell = document.createElement('td');
        denomCell.textContent = item[0];
        row.appendChild(denomCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = `$${item[1].toFixed(2)}`; 
        row.appendChild(amountCell);
        
        tableBody.appendChild(row);
    });
  cidTotalMessage.textContent = totalCid(cid)
}

// Initialise table
generateTable()

const enoughCashDraw = (inputCash, cid) => (inputCash - totalCid(cid)) > 0 ? true : false

let hunCount = 0, twentyCount = 0, tenCount = 0, fiveCount = 0, dollarCount = 0, quarterCount = 0, dimeCount = 0, nickelCount = 0, pennyCount = 0;

const isHundred = (input, output)=>{
  if ((Math.floor(input / 100)) > 0 && cid[8][1] >= 100){ 
    hunCount++;
    input -= 100;
    cid[8][1] -= 100;
    return isHundred(input, output + "100");
  } else {
      return isTwenty(input, output);
  }
}

const isTwenty = (input, output)=>{
  if ((Math.floor(input / 20)) > 0 && cid[7][1] >= 20){
    twentyCount++;
    input -= 20;
    cid[7][1] -= 20;
    return isTwenty(input, output + "20");
  } else {
      return isTen(input, output);
  }
}

const isTen = (input, output)=>{
  if ((Math.floor(input / 10)) > 0 && cid[6][1] >= 10){
    tenCount++;
    input -= 10;
    cid[6][1] -= 10;
    return isTen(input, output + "10");
  } else {
      return isFive(input, output);
  }
}

const isFive = (input, output)=>{
  if ((Math.floor(input / 5)) > 0 && cid[5][1] >= 5){
    fiveCount++;
    input -= 5;
    cid[5][1] -= 5;
    return isFive(input, output + "5");
  } else {
    return isDollar (input, output);
  }
}

const isDollar = (input, output)=>{
  if ((Math.floor(input / 1)) > 0 && cid[4][1] >= 1){
    dollarCount++;
    input -= 1;
    cid[4][1] -= 1;
    return isDollar (input, output + "1");
  } else {
    return isQuarter(input, output);
  }
}


const isQuarter = (input, output)=>{
  if ((Math.floor(input / 0.25)) > 0 && cid[3][1] >= 0.25){
    quarterCount++;
    input = parseFloat((input- 0.25).toFixed(2))
    cid[3][1] = parseFloat((cid[3][1]- 0.25).toFixed(2))
    return isQuarter (input, output + "0.25");
  } else {
    return isDime(input, output);
  }
}

const isDime = (input, output)=>{
  if ((Math.floor(input / 0.1)) > 0 && cid[2][1] >= 0.1){
    dimeCount++;
    input = parseFloat((input- 0.1).toFixed(2))
    cid[2][1] = parseFloat((cid[2][1]- 0.1).toFixed(2))
    return isDime(input, output + "0.1");
  } else {
    return isNickel(input, output);
  }
}

const isNickel = (input, output)=>{
  if ((Math.floor(input / 0.05)) > 0 && cid[1][1] >= 0.05){
    nickelCount++;
    input = parseFloat((input- 0.05).toFixed(2))
    cid[1][1] = parseFloat((cid[1][1]- 0.05).toFixed(2))
    return isNickel(input, output + "0.05");
  } 
  else {
    return isPenny(input, output);
  }
}


/* for the final coin check using recursion on such small values leads to floating point errors near zero. Using a while loop fixes */
const isPenny = (input, output) => {
  if (totalCid(cid.slice(0, 1)) < input){
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS"
      // ran out of coins? put money back in register
    cid[8][1] += 100*hunCount;
    cid[7][1] += 20*twentyCount;
    cid[6][1] += 10*tenCount;
    cid[5][1] += 5*fiveCount;
    cid[4][1] += 1*dollarCount;
    cid[3][1] += 0.25*quarterCount;
    cid[2][1] += 0.10*dimeCount; 
    cid[1][1] += 0.05*nickelCount;
    cid[0][1] += 0.01*pennyCount;

    
    // reset counts after returning money to register
    hunCount = 0, twentyCount = 0, tenCount = 0, fiveCount = 0, dollarCount = 0, quarterCount = 0, dimeCount = 0, nickelCount = 0, pennyCount = 0;
    
    output = "Status: INSUFFICIENT_FUNDS";
    return output
  }

// If enough coins, ignore if statement above
  while ((Math.floor(input / 0.01)) > 0 && cid[0][1] >= 0.01) {
    
    pennyCount++;
    input = parseFloat((input - 0.01).toFixed(2));
    cid[0][1] = parseFloat((cid[0][1] - 0.01).toFixed(2));
    output += "0.01, ";
  }
  return output
};

// Update #changeDue with coins and values given to customer
const changeDueUpdate = () => {
  if (hunCount > 0){
    changeDue.innerHTML += `${cid[8][0]}: $${100*hunCount}<br>`
  }
  if (twentyCount > 0){
    changeDue.innerHTML += `${cid[7][0]}: $${20*twentyCount}<br>`
  }
  if (tenCount > 0){
    changeDue.innerHTML += `${cid[6][0]}: $${10*tenCount}<br>`
  }
  if (fiveCount > 0){
    changeDue.innerHTML += `${cid[5][0]}: $${5*fiveCount}<br>`
  }
  if (dollarCount > 0){
    changeDue.innerHTML += `${cid[4][0]}: $${1*dollarCount}<br>`
  }
  if (quarterCount > 0){
    changeDue.innerHTML += `${cid[3][0]}: $${0.25*quarterCount}<br>`
  }
  if (dimeCount > 0){
    changeDue.innerHTML += `${cid[2][0]}: $${0.1*dimeCount}<br>`
  }
  if (nickelCount > 0){
    changeDue.innerHTML += `${cid[1][0]}: $${0.05*nickelCount}<br>`
  }
  if (pennyCount > 0){
    changeDue.innerHTML += `${cid[0][0]}: $${0.01*pennyCount}<br>`
  }
}


const howMuchChange = (cash) => {
  let diff = parseFloat((cash - price).toFixed(2))
  totalChangeDue.textContent += `$${diff}`
  isHundred(diff, "") // Money counting call stack
  changeDueUpdate() // changeDue output
}

const purchaseAttempt = () =>{
  let cash = parseFloat((parseFloat(cashInput.value)).toFixed(2));
  let diff = parseFloat((cash - price).toFixed(2));
  // Reset call stack counts before every purchase click
  hunCount = 0, twentyCount = 0, tenCount = 0, fiveCount = 0, dollarCount = 0, quarterCount = 0, dimeCount = 0, nickelCount = 0, pennyCount = 0;

  // default behaviour of response elements
  changeDue.style.backgroundColor = "var(--change-due)";
  changeDue.style.color = "var(--correct-text-color)";
  totalChangeDue.style.display="none"
  if (cash < price){
    alert("Customer does not have enough money to purchase the item")
    return 
  }
  else if (!cashInput.value || isNaN(cash)) {
  alert("Please enter a valid number");

  } else if (cash === price){
  changeDue.textContent = `No change due - customer paid with exact cash`
  changeDue.style.display="block";
  changeDue.style.backgroundColor = "var(--change-due)";
  changeDue.style.color = "var(--correct-text-color)";
  return

  } else if (enoughCashDraw(diff, cid)) {
    // Total cid < change due
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS"
    changeDue.style.display="block";
    changeDue.style.backgroundColor = "var(--closed-colour)";
    changeDue.style.color = "var(--closed-text-colour)";

    let diff = parseFloat((cash - price).toFixed(2))
    totalChangeDue.style.display="block";
    totalChangeDue.innerHTML = "Total change due:<br>"
    totalChangeDue.textContent += `$${diff}`
    totalChangeDue.style.backgroundColor = "var(--closed-colour)";
    totalChangeDue.style.color = "var(--closed-text-colour)";
    return
  }
  else{
  changeDue.style.display="block";

  changeDue.innerHTML = "Status: OPEN<br>"
  totalChangeDue.style.display="block";
  totalChangeDue.innerHTML = "Total change due:<br>"
  howMuchChange(cash) 
  generateTable() // update cid table
  
  // Register empty?
  if (totalCid(cid) === 0) {
    changeDue.style.display="block";
    totalChangeDue.style.display="block";
    changeDue.innerHTML = "Status: CLOSED<br>"
    changeDueUpdate()
    return
  }
  }
}

button.addEventListener("click", (e) => {
e.preventDefault();
purchaseAttempt()
});
