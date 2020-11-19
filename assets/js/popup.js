
// ainda não está funcional, falta corrigir alguns erros!

const pokeCache = {};

const selectPokemon = async (id) => {
    if (!pokeCache[id]) {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const response = await fetch(url);
        const pokemons = await response.json();
        pokeCache[id] = pokemons;
        displayPopup(pokemons);
    }
    displayPopup(pokeCache[id]);
};

const displayPopup = (pokemons, id, height, weight, type) => {
    const elementTypes = pokemons.types.map((type) =>
        type.type.name).join(' | ');
    const name = pokemons.sprites['front_default'];
    const generateHTML = `
        <div class="popup">
            <button id="closeBtn"
            onclick="closePopup()">Fechar</button>
            <div class="card ${elementTypes[0]}">
                <img class="card-image" alt="${name}" src="https://pokeres.bastionbot.org/images/pokemon/${id}.png">
                <h2 class="card-title">#${id.toString().padStart(3, '0')} ${name}</h2>
                <p class="card-subtitle">${elementTypes.join(' | ')}</p>
                <p><small>Height: </small>${height} | <small>Weight: </small>${weight} | <small>Type: </small>${type}
            </div>
        </div>       
    `;
    pokemonsList.innerHTML = generateHTML + pokemonsList.innerHTML;
};

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.parentElement.removeChild(popup);
};