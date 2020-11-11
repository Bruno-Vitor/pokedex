const pokemonsList = document.querySelector('#pokemonsList');
const loaderContainer = document.querySelector('.loader');
const searchBarInput = document.querySelector('#searchBar');

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

const addPokemonsIntoDOM = async () => {
    const pokemons = await generatePokemonPromises()
    const pokemonsTemplate = generateHTML(pokemons)

    pokemonsList.innerHTML += pokemonsTemplate
}

const handleScrollToPageBottom = async () => {
    const {
        clientHeight,
        scrollHeight,
        scrollTop
    } = document.documentElement
    const isPageBottomAlmostReached = scrollTop + clientHeight >= scrollHeight - 1

    if (isPageBottomAlmostReached) {
        loaderContainer.classList.add('show')
        await addPokemonsIntoDOM()
        loaderContainer.classList.remove('show');
    }
}

const addPokemonsIntoPage = async () => {
    const pokemonsInfo = await generatePokemonPromises()
    const pokemonsHtml = generateHTML(pokemonsInfo)
    insertPokemonsIntoPage(pokemonsHtml)
}

addPokemonsIntoPage();

window.addEventListener('scroll', handleScrollToPageBottom)