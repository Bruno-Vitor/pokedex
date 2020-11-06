const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const generatePokemonPromises = () => Array(20).fill().map((_, index) =>
    fetch(getPokemonUrl(index + 1)).then(response => response.json()))

const generateHTML = pokemons =>
    pokemons.reduce((accumulator, {
        name,
        id,
        types
    }) => {
        const elementTypes = types.map(typeInfo => typeInfo.type.name)

        // https://raw.githubusercontent.com/jnovack/pokemon-svg/3c3ea26da58331d7202e7cdb1aab9b8347d8587f/svg/${id}.svg
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