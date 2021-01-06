const pokeScreen = document.querySelector('.left-screen--view');
const turnButton = document.querySelector
const turnPokedex = document.querySelector('.off--button span');
const pokemonName = document.querySelector('.pokemon--name');
const pokemonId = document.querySelector('.pokemon--number');
const pokemonImgFront = document.querySelector(".pokemon--front-img");
const pokemonImgBack = document.querySelector(".pokemon--back-img");
const pokemonPower = document.querySelector('.pokemon--power')
const pokemonWeight = document.querySelector('.pokemon--weight');
const pokemonHeight = document.querySelector('.pokemon--height');
const pokemonList = document.querySelectorAll('.list--item')
const prevButton = document.querySelector('.prev--button');
const nextButton = document.querySelector('.next--button');

let prevUrl = null;
let nextUrl = null;

pokeScreen.style.display = 'none';

// functions 
function onPokedex() {
  if(pokeScreen.style.display == 'none'){
    pokeScreen.style.display = 'block';

    fetchPokemonData(1)
    turnPokedex.innerHTML = 'OFF'
  } else {
    pokeScreen.style.display = 'none';

    turnPokedex.innerHTML = 'ON'
  }
}

const fetchPokemonData = id => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      const dataTypes = data['types'];
      pokemonPower.innerHTML = dataTypes[0]['type']['name'];

      pokeScreen.classList.add(dataTypes[0]['type']['name'])
      pokemonName.innerHTML = data['name'];
      pokemonId.innerHTML = `#${data['id'].toString().padStart(3, '0')}`;
      pokemonWeight.innerHTML = `Weight: ${data['weight']}`;
      pokemonHeight.innerHTML = `Height: ${data['height']}`;
      pokemonImgFront.src = data['sprites']['front_default'] || '';
      pokemonImgBack.src = data['sprites']['back_default'] || '';  
    });
}

const fetchPokemonList = url => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const { results, previous, next } = data;

      prevUrl = previous;
      nextUrl = next;

      for(let i = 0; i < pokemonList.length; i++){
        const pokemonListItem = pokemonList[i];
        const resultData = results[i];

        if(resultData) {
          const { name, url } = resultData;
          const urlArray = url.split('/');
          const id = urlArray[urlArray.length - 2];

          pokemonListItem.innerHTML = `${id}. ${name}`
        } else {
          pokemonListItem.innerHTML = ''
        }
      }
    })
}

const goNextList = () => {
  if(nextUrl) {
    fetchPokemonList(nextUrl);
  }
};

const goPrevList = () => {
  if(prevUrl) {
    fetchPokemonList(prevUrl);
  }
};

const listPokemon = event => {
  if(!event.target) return;

  const listItem = event.target;

  if(!listItem.innerHTML) return;

  const id = listItem.innerHTML.split('.')[0];

  fetchPokemonData(id);
}

// event listeners


turnPokedex.addEventListener('click', onPokedex);

prevButton.addEventListener('click', goPrevList);
nextButton.addEventListener('click', goNextList);

for(const pokemonListItem of pokemonList) {
  pokemonListItem.addEventListener('click', listPokemon);
}

// init

fetchPokemonList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');