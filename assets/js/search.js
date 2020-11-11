const pokemonsList = document.getElementById('pokemonsList');
const searchBar = document.getElementById('searchBar');
let pokeCharacters = [];

searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.val;
    const filteredCharacters = pokeCharacters.filter((character) => {
        return (
            character.name.toLowerCase().includes(searchString)
        );
    });
    displayCharacters(filteredCharacters);
});

const loadCharacters = async () => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        pokeCharacters = await res.json();
        displayCharacters(pokeCharacters);
    } catch (err) {
        console.error(err);
    }
};

const displayCharacters = (characters) => {
    const htmlString = characters
        .map((card) => {
            return `
            <li class="card">
                <h2>${card.name}</h2>                
            </li>
        `;
        })
        .join('');
    pokemonsList.innerHTML = htmlString;
};

loadCharacters();