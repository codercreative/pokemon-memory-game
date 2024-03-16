import { useState, useEffect } from "react";

//DEFINE THE ENTIRE CARD COMPONENT
export default function Card() {
  //STATE MANAGEMENT
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  //function to shuffle the array of Pokémon cards when starting a new game
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  //FETCHING DATA
  //getting the pokemons from the PokéAPI
  const fetchPokemons = () => {
    setIsLoading(true); //SET LOADING STATE TO TRUE

    //Fetch Pokémon data from the API
    fetch("https://pokeapi.co/api/v2/pokemon?limit=8")
      .then((res) => res.json()) //PARSE THE RESPONSE AS JSON
      .then((data) => {
        //Extract pokemonNames from the API response
        const speciesNames = shuffleArray(
          data.results.map((species) => species.name)
        ).slice(0, 8);
        //Fetch two cards fro each Pokemon species
        const promises = speciesNames.map((species) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${species}`)
            .then((res) => res.json())
            .then((data) => ({
              name: data.name,
              image: data.sprites.front_default,
            }))
        );

        //Resolve all promises
        Promise.all(promises)
          .then((pokemonDetails) => {
            const duplicatedPokemons = [...pokemonDetails, ...pokemonDetails];
            setPokemons(shuffleArray(duplicatedPokemons));
            setFlippedCards(Array(16).fill(false));
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching Pokémon data:", error);
            setIsLoading(false);
          });
      });
  };

  //GETTING NEW POKÉMONS EVERY TIME THE GAME IS RESET
  const resetGame = () => {
    setMatchedCards([]);
    setSelectedCards([]);
    setGameOver(false);
    fetchPokemons();
  };

  //USE EFFECT HOOK TO FETCH POKEMON DATA WHEN THE COMPONENT MOUNTS
  useEffect(() => {
    if (matchedCards.length === pokemons.length) {
      setGameOver(true);
    } else {
      setGameOver(false);
    }
  }, [matchedCards, pokemons]);

  //HANDLE CARD CLICK EVENT
  const handleCardClick = (index) => {
    //If the card is already matched or selected, do nothing
    if (matchedCards.includes(index) || selectedCards.length === 2) return;

    //Flip the clicked card
    setFlippedCards((prevFlippedCards) => {
      const newFlippedCards = [...prevFlippedCards];
      newFlippedCards[index] = true;
      return newFlippedCards;
    });

    //Add the clicked card to the selected cards array
    setSelectedCards([...selectedCards, index]);

    //if two cards are selected, check if they match
    if (selectedCards.length === 1) {
      //Check if the two selected cards match
      if (pokemons[selectedCards[0]].name === pokemons[index].name) {
        setMatchedCards((prevMatchedCards) => [
          ...prevMatchedCards,
          selectedCards[0],
          index,
        ]);
        setSelectedCards([]);
      } else {
        //If the cards don't match, reset them after a delay
        setTimeout(() => {
          setFlippedCards((prevFlippedCards) => {
            const newFlippedCards = [...prevFlippedCards];
            newFlippedCards[selectedCards[0]] = false;
            newFlippedCards[index] = false;
            return newFlippedCards;
          });
          setSelectedCards([]);
          setTimeoutActive(false);
        }, 1500);
        setTimeoutActive(true);
      }
    }
  };

  //RETURN JSX FOR THE CARD COMPONENT
  return (
    <section className="game-container">
      {gameOver ? <h1>Yay! Way to go!✨</h1> : <h1>Memory Game</h1>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        //Render the Pokemon cards if data is loaded
        <div className="cards-grid">
          {pokemons.map((pokemon, index) => (
            <div
              key={index}
              className={`card ${
                selectedCards.includes(index) ? "selected" : ""
              } ${matchedCards.includes(index) ? "matched" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              {flippedCards[index] ? (
                <img src={pokemon.image} alt={pokemon.name} />
              ) : (
                <img src="./assets/flamingo.png" alt="Back of card" />
              )}
            </div>
          ))}
        </div>
      )}
      <button className="reset-btn" onClick={resetGame}>
        Reset Game
      </button>
    </section>
  );
}
