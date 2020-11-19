
// ainda não está funcional, falta corrigir alguns erros!

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

const searchInput = getElement('#searchBar'),
    searchButton = getElement('.fa-search'),
    container = getElement('.pokedex'),
    erroMessage = getElement('.error');

var pokeName,
    pokemon,
    card;

function getElement(element) {
    return document.querySelector(element);
}

function requestPokeInfo(url, name) {
    fetch(url + name)
        .then(response => response.json())
        .then(data => {
            pokemon = data;
        })
        .catch(err => console.log(err));
}

// console.log(pokemon);

const genHTML = pokemons =>
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


function startApp(pokeName) {
    requestPokeInfo(baseUrl, pokeName);

    setTimeout(function () {
        if (pokemon.detail) {
            erroMessage.style.display = 'block';
            container.style.display = 'none';
        } else {
            erroMessage.style.display = 'none';
            container.style.display = 'flex';
            container.innerHTML = genHTML;
        }
    }, 2000);
}

searchButton.addEventListener('click', event => {
    event.preventDefault();
    pokeName = searchInput.value.toLowerCase();
    startApp(pokeName);
    container.classList.add('fade');

    setTimeout(() => {
        container.classList.remove('fade');
    }, 3000);
});