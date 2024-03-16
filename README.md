# Pokemon Memory Game

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Challenges along the way](#challenges-along-the-way)
  - [What I learned](#what-i-learned)
- [Resources](#resources)

## Overview

### The challenge

A fun memory game built with React Vite and Pokemon API.

The app will hold 8 images x 2 and the user has to flip two cards at time to find the two images that are the same.

The game has a reset button and when the game resets another set of 8 images will load.

### Screenshot

![](./assets/flamingo.png)

## My process

### Built with

- HTML, CSS, React Vite
- Pokemon API

### Challenges along the way

### What I learned

Hopefully, I can remember this way of fetching API's going forward.

```jsx
const fetchPokemons = () => {
  setIsLoading(true);

  fetch("https://pokeapi.co/api/v2/pokemon?limit=8")
    .then((res) => res.json())
    .then((data) => {
      //Extract pokemon names and images
      const pokemonPromise = data.results.map((pokemon) =>
        fetch(pokemon.url)
          .then((res) => res.json())
          .then((details) => ({
            name: pokemon.name,
            image: details.sprites.front_default,
          }))
      );
      return pokemonPromise.reduce((chain, promise) => {
        return chain.then((results) =>
          promise.then((result) => [...results, result])
        );
      }, Promise.resolve([]));
    })
    .then((pokemonDetails) => {
      setPokemons(pokemonDetails);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching Pokémon data:", error);
      setIsLoading(false);
    });
};
```

## Resources

[PokéAPI](https://pokeapi.co/)

[Youtube JS Memory Match Game](https://www.youtube.com/watch?v=Z2O3QxpcdSk)

[Building a React JS App with the Pokémon API](https://www.youtube.com/watch?v=HaEB0vdxpdg)

[React Custom Hooks useFetch - Pokémon API](https://www.youtube.com/watch?v=Xi74CW4lxig)
