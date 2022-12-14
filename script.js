const poke_container = document.getElementById('poke_container');
const spinner = document.querySelector('#spinner');
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

let limit = 11;
let offset = 1;

//PAGINATION BUTTONS
previous.addEventListener("click", () => {
    if (offset != 1) {
      offset -= 12;
      removeChildNodes(poke_container);
      fetchPokemon(offset, limit);
    }
  });
  
  next.addEventListener("click", () => {
    offset += 12;
    removeChildNodes(poke_container);
    fetchPokemon(offset, limit);
  });  

//Color for background of each card depending on type
const colors = {
    fire: '#FDDFDF',
	grass: '#DEFDE0',
	electric: '#FCF7DE',
	water: '#DEF3FD',
	ground: '#f4e7da',
	rock: '#d5d5d4',
	fairy: '#ffd6ee',
	poison: '#eac1fa',
	bug: '#f8d5a3',
	dragon: '#97b3e6',
	psychic: '#eaeda1',
	flying: '#F5F5F5',
	fighting: '#E6E0D4',
	normal: '#d4d4d4'
};

//Main types array
const main_types = Object.keys(colors);

// Get specific number of pokemon from API
const fetchPokemon = async (offset, limit)=>{
    spinner.style.display = 'none';
    for( let i = offset; i <= offset + limit; i++ ){
        await getPokemon(i);
    }               
}

//Fetch pokemon from API 
const getPokemon  = async id =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokePromise = await fetch(url);
    const poke = await pokePromise.json();  
    
    createCard(poke);   
    spinner.style.display = 'none';
}

fetchPokemon(offset, limit);

//Create Cards
const createCard = pokemon =>{
    const flipCard = document.createElement('article');
    flipCard.classList.add('flip-card');

    const cardContainer = document.createElement('article');
    cardContainer.classList.add('card-container');

    flipCard.appendChild(cardContainer);      

    const poke_types = pokemon.types.map(el => el.type.name);
    const type = main_types.find(type => poke_types.indexOf(type) > -1);
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const pType = type[0].toUpperCase() + type.slice(1);
    const color = colors[type];
    cardContainer.style.backgroundColor = color;

    const frontCard = document.createElement('article');
    frontCard.classList.add('front-card');

    //FRONT OF CARD
    const pokeFront = `
        <div class="img-container">
            <img src="${pokemon.sprites.front_default}">
        </div>
        
        <div class="info">
            <span class="number">#${pokemon.id.toString().padStart(3, 0)}</span>
            <h3 class="name">${name}</h3>
            <small class="type" style="font-family: 'Pokemon Solid', sans-serif;">Type: 
            <span style="font-family:  'Lato', sans-serif;">${pType}</span></small>
        </div>
    `;

    const backCard = document.createElement('article');
    backCard.classList.add('back-card');

    frontCard.innerHTML = pokeFront;
    backCard.appendChild(pokeStats(pokemon.stats));

    cardContainer.appendChild(frontCard);
    cardContainer.appendChild(backCard);
    
    poke_container.appendChild(flipCard);
    
}

// Pokemon Stats - BACK of card
const pokeStats = stats =>{
    const statsContainer = document.createElement('article');
    statsContainer.classList.add('stats-container');

    for (let i = 0; i < 4; i++){
        const stat = stats[i];

        const statPercent = stat.base_stat / 2 + "%";

        const statContainer = document.createElement('article');
        statContainer.classList.add('stat-container');

        const statName = document.createElement('article');
        statName.classList.add('stat-name');
        statName.textContent = stat.stat.name;

        const progress = document.createElement('article'); 
        progress.classList.add('progress');

        const progressBar = document.createElement('article');
        progressBar.classList.add('progress-bar');

        progressBar.setAttribute("aria-valuenow", stat.base_stat);
        progressBar.setAttribute("aria-valuemin", 0);
        progressBar.setAttribute("aria-valuemax", 200);
        progressBar.style.width = statPercent;

        progressBar.textContent = stat.base_stat;

        progress.appendChild(progressBar);
        statContainer.appendChild(statName);
        statContainer.appendChild(progress);

        statsContainer.appendChild(statContainer);

    }
    return statsContainer;
}

//Remove cards
const removeChildNodes = parent =>{
    while (parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

//Change Dark mode/ Light mode
let color = 'light';
let btn = document.querySelector('button');
window.onscroll = () =>{scrollFunction()};

const scrollFunction = () =>{
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
        btn.style.display = 'block';
    }
}

document.getElementById('dlMode').addEventListener('click', () =>{
    if (color === 'light'){
        document.getElementById('dark-mode').style.background =  'linear-gradient(to right, #2b2929, #424242)';
        btn.innerHTML = `<img src="https://img.icons8.com/nolan/64/sun.png"/>`;
        btn.style.background = '#f3f3f3';
        
        color = 'dark';
    }
    else {
        document.getElementById('dark-mode').style.background = 'linear-gradient(to left, #b6d8f2, #6cb7f0)';
        document.querySelector('button').innerHTML = `<img src="https://img.icons8.com/nolan/64/bright-moon.png"/>`;
        btn.style.background = `#222`
        color = 'light';
    }
});
