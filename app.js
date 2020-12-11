const searchInput = document.querySelector(".recherche-poke input");
const listePoke = document.querySelector(".liste-poke");
const chargement = document.querySelector(".loader");
let allPokemon = [];
let tableauFin = [];

const types = {
  grass: "#78c850",
  ground: "#E2BF65",
  dragon: "#6F35FC",
  fire: "#F58271",
  electric: "#F7D02C",
  fairy: "#D685AD",
  poison: "#966DA3",
  bug: "#B3F594",
  water: "#6390F0",
  normal: "#D9D5D8",
  psychic: "#F95587",
  flying: "#A98FF3",
  fighting: "#C25956",
  rock: "#B6A136",
  ghost: "#735797",
  ice: "#96D9D6",
};

function fetchPokemonBase() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((reponse) => reponse.json())
    .then((allPoke) => {
      //   console.log(allPoke);

      // Passer l'api en français
      allPoke.results.forEach((pokemon) => {
        fetchPokemonComplet(pokemon);
      });
    });
}
fetchPokemonBase();

function fetchPokemonComplet(pokemon) {
  let objPokemonFull = {};
  let url = pokemon.url;
  let nameP = pokemon.name;

  fetch(url)
    .then((reponse) => reponse.json())
    .then((pokeData) => {
      // images des pokemon :
      objPokemonFull.pic = pokeData.sprites.front_default;

      //   nom des pokemon
      objPokemonFull.type = pokeData.types[0].type.name;

      fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then((reponse) => reponse.json())
        .then((pokeData) => {
          //   Nom des pokemon en français = name[4]
          objPokemonFull.name = pokeData.names[4].name;
          allPokemon.push(objPokemonFull);
          objPokemonFull.id = pokeData.id;

          if (allPokemon.length === 151) {
            // console.log(allPokemon);

            /* sort() permet de comparer un élément avec tous les autres et de le
             ** placer avant ou après ou ne pas bouger,
             ** puis on fait la même chose avec le second, etc...
             */
            // les id (#...) correspondent aux id des pokemon pour les trier dans l'ordre
            tableauFin = allPokemon
              .sort((a, b) => {
                return a.id - b.id;
              })
              .slice(0, 21); // tableau de 21 pokemon
            // console.log(tableauFin);

            createCard(tableauFin);

            // ========== Loader (placé après tous les fetch)==========
            chargement.style.display = "none";
          }
        });
    });
}

// ========== Création des cartes de A à Z ==========
function createCard(arr) {
  for (let i = 0; i < arr.length; i++) {
    const carte = document.createElement("li");
    let couleur = types[arr[i].type]; // pour avoir le type de chaque pokemon
    carte.style.background = couleur;
    const txtCarte = document.createElement("h5");
    txtCarte.innerText = arr[i].name;
    const idCarte = document.createElement("p");
    idCarte.innerText = `ID# ${arr[i].id}`;
    const imgCarte = document.createElement("img");
    imgCarte.src = arr[i].pic;

    carte.appendChild(imgCarte);
    carte.appendChild(txtCarte);
    carte.appendChild(idCarte);

    listePoke.appendChild(carte);
  }
}

// ========== Scroll Infini ==========

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  //   scrollTop = scroll depuis le top
  //   scrollHeight = scroll total
  //   clientHeight = hauteur de la fenêtre, partie visible

  // ajouter 6 pokemon :
  if (clientHeight + scrollHeight >= scrollHeight - 20) {
    addPoke(6);
  }
});

let index = 21;

// ajouter 6 pokemon tant que l'index est < 151 :
function addPoke(nb) {
  if (index > 151) {
    return;
  }

  // ajouter 6 pokemon depuis le tableau de tous les pokemon en évitant de reprendre ceux déjà ajoutés :
  const arrToAdd = allPokemon.slice(index, index + nb); // = slice de 21 à 27 par exemple
  createCard(arrToAdd);
  index += nb; // ajoute 6 pokemon depuis les derniers ajoutés (ex: 27 + 6...)
}

// ========== Recherche ==========
searchInput.addEventListener("keyup", recherche);

/*const formRecherche = document.querySelector("form");
formRecherche.addEventListener("submit", (e) => {
  e.preventDefault; // évite d'actualiser la page
  recherche();
});*/

function recherche() {
  if (index < 151) {
    addPoke(130); // = 151 - 21
  }

  let filter, allLi, tittleValue, allTitles;
  filter = searchInput.value.toUpperCase();
  allLi = document.querySelectorAll("li");
  allTitles = document.querySelectorAll("li > h5");

  for (let i = 0; i < allLi.length; i++) {
    tittleValue = allTitles[i].innerText; // nom pokemon

    // est-ce que le nom du pokemon qu'on cherche est dans le nom
    if (tittleValue.toUpperCase().indexOf(filter) > -1) {
      allLi[i].style.display = "flex";
    } else {
      allLi[i].style.display = "none"; // les pokemon non concernés disparaissent de la recherche
    }
  }
}

// ========== Animation input pour que le label ne revienne pas dans l'input quand il n'est pas vide
searchInput.addEventListener("input", function (e) {
  if (e.target.value !== "") {
    e.target.parentNode.classList.add("active-input");
  } else if (e.target.value === "") {
    e.target.parentNode.classList.remove("active-input");
  }
});
