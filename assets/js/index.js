const pokemonsList = document.querySelector('#pokemonsList');
const loaderContainer = document.querySelector('.loader');
const searchBarInput = document.querySelector('#searchBar');

const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`


const generatePokemonPromises = () => Array(20).fill().map((_, index) =>
    fetch(getPokemonUrl(index + 1)).then(response => response.json()))

var getNextPokemons = null;

const generatePokemonPromises = async () => {
    let pokemonUrl = 'https://pokeapi.co/api/v2/pokemon';

    if (getNextPokemons != null) {
        pokemonUrl = getNextPokemons;
    }

    const response = await fetch(pokemonUrl, {
        method: 'GET'
    });
    const responseJSON = await response.json();
    const pokemons = responseJSON.results;

    let pokeInfo = [];
    for (const pokemon of pokemons) {
        const pokemonResponse = await fetch(pokemon.url, {
            method: 'GET'
        });
        const pokemonJSON = await pokemonResponse.json();
        pokeInfo.push(pokemonJSON);
    }

    getNextPokemons = responseJSON.next;

    return pokeInfo;
}

const generateHTML = pokemons =>
    pokemons.reduce((accumulator, {
        name,
        id,
        types
    }) => {
        const elementTypes = types.map(typeInfo => typeInfo.type.name)

        accumulator += `
        <li class="card ${elementTypes[0]}" onclick="selectPokemon(${id})">
            <img class="card-image" alt="${name}" src="https://pokeres.bastionbot.org/images/pokemon/${id}.png">
            <h2 class="card-title">#${id.toString().padStart(3, '0')} ${name}</h2>
            <p class="card-subtitle">${elementTypes.join(' | ')}</p>
        </li>
      `
        return accumulator
    }, '')

const insertPokemonsIntoPage = pokemons => {
    const ul = document.querySelector('[data-js="pokedex"]')
    ul.innerHTML = pokemons
}

const pokemonPromises = generatePokemonPromises()

Promise.all(pokemonPromises)
    .then(generateHTML)
    .then(insertPokemonsIntoPage)

// ----------
const addPokemonsIntoDOM = async () => {
    const pokemons = await getPokemons()
    const pokemonsTemplate = generatePokemonsTemplate(pokemons)

    pokemonsList.innerHTML += pokemonsTemplate
}

const response = () => {
    setTimeout(() => {
        addPokemonsIntoDOM()
    }, 300)
}

const removeLoader = () => {
    setTimeout(() => {
        loaderContainer.classList.remove('show');
        getNextPokemons()
    }, 1000)
}

const showLoader = () => {
    loaderContainer.classList.add('show');
    removeLoader()
}

const handleScrollToPageBottom = () => {
    const {
        clientHeight,
        scrollHeight,
        scrollTop
    } = document.documentElement
    const isPageBottomAlmostReached = scrollTop + clientHeight >= scrollHeight - 10

    if (isPageBottomAlmostReached) {
        showLoader()
    }
}

const showPokemonIfMatchInputValue = inputValue => card => {
    const pokemonNumber = card.querySelector('.card-title').textContent.toLowerCase()
    const pokemonName = card.querySelector('.card-title').textContent.toLowerCase()
    const pokemonContainsInputValue = pokemonNumber.includes(inputValue) || pokemonName.includes(inputValue)

    if (pokemonContainsInputValue) {
        card.style.display = 'flex'
        return
    }

    card.style.display = 'none'
}

const handleInputValue = event => {
    const inputValue = event.target.value.toLowerCase();
    const pokemons = document.querySelectorAll('.card');

    pokemons.forEach(showPokemonIfMatchInputValue(inputValue))
}

addPokemonsIntoDOM()

window.addEventListener('scroll', handleScrollToPageBottom)
searchBarInput.addEventListener('input', handleInputValue)