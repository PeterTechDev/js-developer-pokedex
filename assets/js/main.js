const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// Adicione a função getPokemonDetailByName ao seu objeto pokeApi
pokeApi.getPokemonDetailByName = (pokemonName) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Não foi possível buscar o Pokémon: ${pokemonName}`);
            }
            return response.json();
        })
        .then((pokeDetail) => convertPokeApiDetailToPokemon(pokeDetail))
        .catch((error) => {
            console.error(error);
            return null;
        });
};

// MODAL
// Adicione um evento de clique aos Pokémon na lista
pokemonList.addEventListener('click', (event) => {
    const pokemonElement = event.target.closest('li.pokemon');

    console.log(pokemonElement);

    if (pokemonElement) {
        const pokemonName = pokemonElement.querySelector('.name').textContent;

        // Use o nome do Pokémon para buscar informações detalhadas
        pokeApi.getPokemonDetailByName(pokemonName).then((pokemonDetail) => {
            if (pokemonDetail) {
                // Preencha o conteúdo da modal com as informações detalhadas do Pokémon
                console.log(pokemonDetail);
                const pokemonInfo = document.getElementById('pokemonInfo');
                pokemonInfo.innerHTML = `
                    <h2>${pokemonDetail.name}</h2>
                    <img src="${pokemonDetail.photo}" alt="${pokemonDetail.name}">
                    <p>Types: ${pokemonDetail.types.join(', ')}</p>
                    <!-- Adicionar outras informações detalhadas aqui -->
                `;

                // Exiba a modal
                const modal = document.getElementById('pokemonModal');
                modal.style.display = 'block';

                const modalContent = document.querySelector('.modal-content');
                modalContent.classList.add(pokemonDetail.type);
            }
        });
    }
    
});

// Adicione um evento de clique para fechar a modal quando clicar no botão "Fechar" (×)
const closeModalButton = document.querySelector('.close');
closeModalButton.addEventListener('click', () => {
    const modal = document.getElementById('pokemonModal');
    modal.style.display = 'none';

    const modalContent = document.querySelector('.modal-content');

    Array.from(modalContent.classList).forEach((className) => {
        if (className !== 'modal-content') {
            modalContent.classList.remove(className);
        }
    });
});
