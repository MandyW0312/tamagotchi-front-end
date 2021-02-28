//@ts-nocheck
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom'
import format from 'date-fns/format'

export function PetList() {
  const [pets, setPets] = useState({})
  const [newNameText, setNewNameText] = useState('')

  useEffect(async () => {
    const response = await axios.get(
      'https://mandyw-tamagotchi.herokuapp.com/api/pets'
    )
    setPets(response.data)
  }, [])

  async function handleCreatePet(event) {
    event.preventDefault()
    const response = await axios.post(
      'https://mandyw-tamagotchi.herokuapp.com/api/pets',
      { name: newNameText }
    )
    const refreshPetResponse = await axios.get(
      'https://mandyw-tamagotchi.herokuapp.com/api/pets'
    )
    setPets(refreshPetResponse.data)
    setNewNameText('')
  }

  return (
    <>
      <ul>
        {Object.entries(pets).map(([petCode, petDetails]) => {
          return (
            <li className="home" key={petDetails.id}>
              <Link to={`/pets/${petDetails.id}`}>{petDetails.name}</Link>
            </li>
          )
        })}
      </ul>
      <form onSubmit={handleCreatePet}>
        <label htmlFor="NewPet">Create a New Pet: </label>
        <input
          type="text"
          placeholder="New Pet Name?"
          value={newNameText}
          name="NewPet"
          onChange={function (event) {
            setNewNameText(event.target.value)
          }}
        />
      </form>
      <section>
        <img
          className="homeImage"
          src="https://i.pinimg.com/736x/f8/5d/c0/f85dc087a502e4fb58dbe7ee5587a372.jpg"
          height="500"
          width="500"
        />
      </section>
    </>
  )
}

export function PetPage() {
  const [pet, setPet] = useState({
    id: undefined,
    name: '',
    birthday: '2001-01-01',
  })
  const dateFormat = `MMMM do, yyyy`

  const history = useHistory()
  const params = useParams()

  const [marvelImage, setMarvelImage] = useState('')

  useEffect(
    async function () {
      if (pet.name) {
        const response = await fetch(
          `https://sdg-cors-proxy.herokuapp.com/suncoast/https://superheroapi.com/api/10160671863784167/search/${pet.name}`
        )
        const json = await response.json()
        console.log(json.results[0].image.url)
        setMarvelImage(json.results[0].image.url)
      }
    },
    [pet.name]
  )

  useEffect(
    async function () {
      const response = await axios.get(
        `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}`
      )
      console.log(response.data)
      setPet(response.data)
    },
    [params.id]
  )

  async function deletePet() {
    const response = await axios.delete(
      `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}`
    )
    history.push('/')
  }

  async function playtimesWithPet() {
    const response = await axios.post(
      `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}/playtimes`
    )
    const refreshPetResponse = await axios.get(
      `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}`
    )
    setPet(refreshPetResponse.data)
  }

  async function feedingsThePet() {
    const response = await axios.post(
      `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}/feedings`
    )
    const refreshPetResponse = await axios.get(
      `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}`
    )
    setPet(refreshPetResponse.data)
  }

  async function scoldingsThePet() {
    const response = await axios.post(
      `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}/scoldings`
    )
    const refreshPetResponse = await axios.get(
      `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}`
    )
    setPet(refreshPetResponse.data)
  }
  if (pet.id === undefined) {
    return <div>Loading...</div>
  }

  return (
    <>
      <p>
        <Link to="/">Go Home</Link>
      </p>
      <p>Pet's Name: {pet.name}</p>
      <p>
        Pet's Birthday:
        <time>{format(new Date(pet.birthday), dateFormat)}</time>
      </p>
      <p>Pet's Happiness Level: {pet.happinessLevel}</p>
      <p>Pet's Hunger Level: {pet.hungerLevel}</p>
      <article>
        <button onClick={playtimesWithPet}>Play</button>
        <button onClick={feedingsThePet}>Feed</button>
        <button onClick={scoldingsThePet}>Scold</button>
        <button onClick={deletePet}>Delete</button>
      </article>
      <section>
        <img className="petImage" src={marvelImage} width="300" height="300" />
      </section>
    </>
  )
}

export function App() {
  return (
    <>
      <header>
        <h1></h1>
      </header>
      <section>
        <Switch>
          <Route exact path="/">
            <PetList />
          </Route>
          <Route exact path="/pets/:id">
            <PetPage />
          </Route>
          <Route path="*">
            <p>Sorry, this page is Not Found!</p>
          </Route>
        </Switch>
      </section>
      <footer>This Marvel Tamagotchi App was created by Mandy Wade</footer>
    </>
  )
}
