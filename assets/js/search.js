const pokeList = document.getElementById('pokedex');
const user = document.getElementById('user');

user.addEventListener('keyup', (e) => {});
const loadCharacters = async () => {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon');
        pokeCharacters = await res.json();
        displayCharacters(pokeCharacters);
    } catch (err) {
        console.error(err);
    }
};

const displayCharacters = (pokemons) => {
    const htmlString = characters
        .map((pokemons) => {
            return `
            <li class="card">
                <h2>${pokemons.name}</h2>
            </li>
        `;
        })
        .join('');
    pokeCharacters.innerHTML = htmlString;
};

loadCharacters();