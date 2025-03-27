// initialise elements from HTML
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const pkmnContainer = document.getElementById("pokemon-container");
const imgContainer = document.getElementById("img-container");
const statContainer = document.getElementById("stat-container");
const pkmnName = document.getElementById("pokemon-name");
const pkmnId = document.getElementById("pokemon-id");
const pkmnWeight = document.getElementById("weight");
const pkmnHeight = document.getElementById("height");
const pkmnTypes = document.getElementById("types");
const pkmnHP = document.getElementById("hp");
const pkmnATK = document.getElementById("attack");
const pkmnDEF = document.getElementById("defense");
const pkmnSpATK = document.getElementById("special-attack");
const pkmnSpDEF = document.getElementById("special-defense");
const pkmnSPD = document.getElementById("speed");
const pkmnStatTotal = document.getElementById("stat-total");
const altForms = document.getElementById("alt-forms");
const altFormsContainer = document.getElementById("alt-forms-container");
const nameHead = document.getElementById("name-head")
const modal = document.getElementById("rulesModal");
const openModalBtn = document.getElementById("openModalBtn");
const acceptBtn = document.getElementById("acceptBtn");

// Initalise variables
let pkmnDataArr = []; 
let pokemon = null;
let levPkmn = null;
let baseURL = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";
let firstTypeName = "";
let secondTypeName = "";
let foundPokemonArr = [];
let searchTerm = "";
let baseName = "";

/*
List of all available pokemon names/ids
https://pokeapi-proxy.freecodecamp.rocks/api/pokemon
[{ id: 1,
       name: 'bulbasaur',
       url: 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/1/' }, ... ]

more Data can be fetched for a pokemon from its url 

*/

// Fetch data function, will need to call twice per search.
const getData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // Check if results property exists and is an array
    if (Array.isArray(data.results) && data.results.length > 0) {
      return data.results;  
    } else {
      return data;  
    }

  } catch (err) {
    alert("There was an error loading the Pokémon")
  }
};

const reset = () => {
  pkmnContainer.style.display = "none"
  statContainer.style.display = "none"
  altFormsContainer.style.display = "none"
  pkmnTypes.innerHTML = ""
  imgContainer.innerHTML = ""
  altForms.innerHTML = ""
}

// charizard-mega -> charizard
function getBaseName(fullName) {
  const baseName = fullName.split('-')[0];
  return baseName;
}

/* https://www.30secondsofcode.org/js/s/levenshtein-distance/ 
I had an idea of finding the closest match for a failed search result, but didn't know the method. This source states the name of the method and explains how to calculate the Levenshtein distance between 2 strings and so I am sourcing my information.

I have expanded on this code.

*/
const levenshteinDistance = (s, t) => {
  // Handle base cases
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  const arr = Array.from({ length: t.length + 1 }, () => Array(s.length + 1));

  // Set up the base case for the first row and column
  for (let i = 0; i <= t.length; i++) {
    arr[i][0] = i;
  }
  for (let j = 0; j <= s.length; j++) {
    arr[0][j] = j;
  }

  // Fill the array with calculated values
  for (let i = 1; i <= t.length; i++) {
    for (let j = 1; j <= s.length; j++) {
      const cost = s[j - 1] === t[i - 1] ? 0 : 1; // If chars match, cost = 0, else 1
      arr[i][j] = Math.min(
        arr[i - 1][j] + 1, // Deletion
        arr[i][j - 1] + 1, // Insertion
        arr[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  // Return the Levenshtein distance
  return arr[t.length][s.length];
};

// Want to find the closest match for the searchTerm and the entire pkmnDataArr
const findClosestMatch = (searchTerm, arr) => {
  const levenshteinDistances = arr.map(item => {
    const distance = levenshteinDistance(searchTerm, item.name);
    return isNaN(distance) ? Infinity : distance;  // Ensure no NaN values, else the minimum index returned is -1
  });

  const minDistance = Math.min(...levenshteinDistances);
  
  // If all distances are Infinity (or invalid), return -1
  if (minDistance === Infinity) {
    return -1;
  }

  return levenshteinDistances.indexOf(minDistance);
};

const pkmnSearch = async (searchTerm) => {
  // reset search screen on each click
  reset()
  if (!searchTerm || !/^[A-Za-z0-9]/.test(searchTerm)) {
    alert("A pokemon name must start with a letter, or enter a valid Id number")
    return}

  // Need to tell code to wait for fetch to retrive data due to async nature 
  pkmnDataArr = await getData(baseURL);

  
  let levIndex = findClosestMatch(searchTerm,pkmnDataArr )
  // Account for alt-forms starting index at #10,001 and pokedex ending at #1025
  let levNum = levIndex < 1025 ? levIndex+1 : levIndex + 8976;


  let likeMatches = []
  let likeMatchesNames = []
  
  // Find the pokemon in pkmnDataArr 
  let foundPokemon = null
  pkmnDataArr.map((pkmn) => {
    if (pkmn.id === Number(searchTerm) || pkmn.name === searchTerm) {
      foundPokemon = pkmn;
      return} else if (pkmn.id === levNum) {
        levPkmn = pkmn;
      }

/* 
levenshteinDistance is good for picking up typos, not so much formatting errors.
'deoxys' and 'deoxys-normal' have a levDist of 7, so the levDist picks up a 'closer' pokemon Ekans. Need to add extra logic to provide more options.
*/
    if (pkmn.name.startsWith(searchTerm) || pkmn.name.endsWith(searchTerm) ){
      likeMatches.push(pkmn)
      likeMatchesNames.push(pkmn.name)
    }
      }) 

 // If searchTerm does not match any pokemon, alert user and return closest match from lev distance as a searchable option
    if (foundPokemon === null) {
    alert("Pokémon not found")

    // altForms logic from later in code is reused here
    let levPokemon = await getData(levPkmn.url);
    altFormsContainer.style.display = "block"
    altForms.style.display = "block"

    altForms.innerHTML = `<p>Pokemon Not Found, did you mean #${levNum}, ${levPkmn.name}?</p>
    <div class = "img-btn-pair">
      <img class="pkmn-img" src="${levPokemon.sprites.front_default}" alt="${levPokemon.id}_front_default">
      <button id = "${levPokemon.id}" class = "alt-search-btn">${levPokemon.name} #${levPokemon.id}</button>
      <img class="pkmn-img" src="${levPokemon.sprites.front_shiny}" alt="${levPokemon.id}_front_shiny">
      </div>
      <p>Or did you mean: ${likeMatchesNames.join(',<br>')}</p>`

      // for each begins.with/ends.with matches defined earlier, create a similar button pair
    let likePKMNArr = [];
    for (const like of likeMatches) {
      let like2 = await getData(like.url)
      altForms.innerHTML += `
      <div class = "img-btn-pair">
      <img class="pkmn-img" src="${like2.sprites.front_default}" alt="${like2.id}_front_default">
      <button id = "${like.id}" class = "alt-search-btn">${like.name} #${like.id}</button>
      <img class="pkmn-img" src="${like2.sprites.front_shiny}" alt="${like2.id}_front_shiny">
      </div>`
      console.log(like.id)
      likePKMNArr.push(like)
    }

    let likePokemon = [levPokemon].concat(likePKMNArr); 

    // likePokemon analagous to foundPokemonArr defined later.
    return likePokemon}

 /* After all the "pokemon not found" logic, time to code what happens when pokemon is found
 // extract url of pokemon's page */
 
  let pkmnURL = foundPokemon.url;
  let pkmnNAME = foundPokemon.name;

  // Fetch data of the pokemon
  pokemon = await getData(pkmnURL);

  // Display pkmn information html elements
  pkmnContainer.style.display = "block";
  statContainer.style.display = "block";
  
  pkmnName.textContent = pokemon.name.toUpperCase();
  pkmnId.textContent = `#${pokemon.id}`;
  pkmnWeight.textContent = `Weight: ${pokemon.weight}`;
  pkmnHeight.textContent = `Height: ${pokemon.height}`;

  firstTypeName = pokemon.types[0].type.name.toUpperCase();
  nameHead.className = `${firstTypeName}`;
  
  if (!pokemon.types[1]){
    console.log("one type")
    pkmnTypes.innerHTML += `<p class = "${firstTypeName}">${firstTypeName}</p>`
  } else {
    secondTypeName = pokemon.types[1].type.name.toUpperCase();
    pkmnTypes.innerHTML += `<p class = "${firstTypeName}">${firstTypeName}</p>`
    pkmnTypes.innerHTML += `<p class = "${secondTypeName}">${secondTypeName}</p>`
    };
  
  pkmnHP.innerHTML = pokemon.stats[0].base_stat
  pkmnATK.innerHTML = pokemon.stats[1].base_stat
  pkmnDEF.innerHTML = pokemon.stats[2].base_stat
  pkmnSpATK.innerHTML = pokemon.stats[3].base_stat
  pkmnSpDEF.innerHTML = pokemon.stats[4].base_stat
  pkmnSPD.innerHTML = pokemon.stats[5].base_stat
  let statTotal = pokemon.stats[0].base_stat + pokemon.stats[1].base_stat+pokemon.stats[2].base_stat + pokemon.stats[3].base_stat+pokemon.stats[4].base_stat + pokemon.stats[5].base_stat

  pkmnStatTotal.innerHTML = statTotal

  imgContainer.innerHTML += `<img class="pkmn-img" id = "sprite" src="${pokemon.sprites.front_default}" alt=" front_default"><img class="pkmn-img" class = "sprite" src="${pokemon.sprites.back_default}" alt=" back_default"><img class="pkmn-img" class = "sprite" src="${pokemon.sprites.front_shiny}" alt=" front_shiny"><img class="pkmn-img" class = "sprite" src="${pokemon.sprites.back_shiny}" alt=" back_shiny">`


  // Also find LIKE forms to suggest to user
  // 10034 charizard-mega-x
  // Find all Pokémon in pkmnDataArr that match the search term

  let foundPokemons = [];
  const baseName = getBaseName(pokemon.name);  

  // Check for exact matches or base name matches
  pkmnDataArr.forEach((pkmn) => { // Base name of the pokemon
    const pkmnBaseName = getBaseName(pkmn.name.toLowerCase()); 
    
    // edge case handling: pkmn with punctuation that share a base name
    // if user searches porygon-z, dont return porygon.
    const edgecases = ["porygon-z", "porygon", "nidoran-f", "nidoran-m", "iron-treads", "iron-bundle", "iron-hands", "iron-jugulis", "iron-moth", "iron-thorns", "iron-valiant", "iron-leaves", "iron-boulder", "iron-crown", "mr-rime", "mr-mime-galar", "mr-mime" ]
    if (edgecases.includes(pokemon.name)){
    } 
    else if (pkmnBaseName === baseName) {
      foundPokemons.push(pkmn);
    } 
  });
  // Special-edge case: mr-mime can't be matched with mr-rime, but should be matched with mr-mime-galar, easiest just to fix this one manually.
  if (pokemon.name === "mr-mime" || pokemon.name === "mr-mime-galar"){
    foundPokemons.push(pkmnDataArr.find(obj => obj.name === "mr-mime"))
    foundPokemons.push(pkmnDataArr.find(obj => obj.name === "mr-mime-galar"));}
  
  let foundPokemonArr = [];
  if (foundPokemons.slice(1).length > 0) {
    altFormsContainer.style.display = "block"
    altForms.innerHTML = `<h3>Alt forms:</h3>`
    altForms.style.display = "block"
    
    for (const item of foundPokemons) {
      let item2 = await getData(item.url)
      altForms.innerHTML += `<div class = "img-btn-pair">
      <img class="pkmn-img" src="${item2.sprites.front_default}" alt="${item2.id}_front_default">
      <button id = "${item.id}" class = "alt-search-btn">${item.name} #${item.id}</button>
      <img class="pkmn-img" src="${item2.sprites.front_shiny}" alt="${item2.id}_front_shiny">
      </div>`
      foundPokemonArr.push(item)
    }

    return foundPokemonArr;

    // Alts found and returned in array, end of search
  } else {
    // No alts found, end of search
  }
}

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  searchTerm = searchInput.value.toLowerCase();
  foundPokemonArr = await pkmnSearch(searchTerm);
});

document.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
    e.preventDefault();
    searchTerm = searchInput.value.toLowerCase();
    foundPokemonArr = await pkmnSearch(searchTerm);
    }
});


// Listen for click on parent class, applies to any button inside
altForms.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target && e.target.classList.contains('alt-search-btn')) {
    const clickedButtonId = e.target.id;  // ID of the clicked button
    const clickedItem = foundPokemonArr.find(item => String(item.id) === clickedButtonId);  // Convert item.id to string if necessary
    if (clickedItem) {
      searchTerm = clickedItem.name
      foundPokemonArr = await pkmnSearch(searchTerm); // Re-run search
      } else { // "No matching item found for ID:"
    }
  }
});

openModalBtn.addEventListener("click", function() {modal.style.display = "block";});

acceptBtn.addEventListener("click", function() { modal.style.display = "none";});