import React from "react";
import { useEffect, useState } from "react";

export default function Main() {
  const [pokemons, setPokemons] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const initialUrl = "https://pokeapi.co/api/v2/pokemon?limit=9";

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=9");
        const json = await res.json();
        console.log(json);
      } catch (e) {
        setIsError(e);
      }
    };
    fetchPokemons();
  }, []);

  return (
    <main className="game-container">
      <p>I am main</p>
    </main>
  );
}
