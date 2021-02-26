//@ts-nocheck
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom'

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
              {petDetails.name}
              <Link to={`/pets/${petDetails.id}`}>Visit Pet</Link>
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
    </>
  )
}

export function PetPage() {
  const [pet, setPet] = useState({
    id: undefined,
    name: '',
  })
  const history = useHistory()
  const params = useParams()

  useEffect(
    async function () {
      const response = await axios.get(
        `https://mandyw-tamagotchi.herokuapp.com/api/pets/${params.id}`
      )
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

  return (
    <>
      <p>
        <Link to="/">Go Home</Link>
      </p>
      <p>Pet's Name: {pet.name}</p>
      <p>Pet's Birthday: {pet.birthday} </p>
      <p>Pet's Happiness Level: {pet.happinessLevel}</p>
      <p>Pet's Hunger Level: {pet.hungerLevel}</p>
      <article>
        <button onClick={playtimesWithPet}>Play With the Pet</button>
        <button onClick={feedingsThePet}>Feed the Pet</button>
        <button onClick={scoldingsThePet}>Scold the Pet</button>
        <button onClick={deletePet}>Delete Pet</button>
      </article>
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
