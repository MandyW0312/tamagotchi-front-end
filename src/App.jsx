//@ts-nocheck
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, useParams } from 'react-router-dom'

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
      {Object.entries(pets).map(([petCode, petDetails]) => {
        return (
          <li key={petDetails.id}>
            {petDetails.name}: Birthday: {petDetails.birthday} Hunger Level:{' '}
            {petDetails.hungerLevel}, Happiness Level:{' '}
            {petDetails.happinessLevel}
          </li>
        )
      })}
      <form onSubmit={handleCreatePet}>
        <input
          type="text"
          placeholder="New Pet Name?"
          value={newNameText}
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
  const params = useParams()

  useEffect(
    async function () {
      const response = await axios.get(
        `https://mandyw-tamagotchi.herokuapp.com/api/pets${params.id}`
      )
      setPet(response.data)
    },
    [params.id]
  )

  return (
    <div>
      <p>
        <Link to="/">Go Home</Link>
      </p>
      <p>{pet.name}</p>
      <p>{pet.birthday}</p>
      <p>{pet.hungerLevel}</p>
      <p>{pet.happinessLevel}</p>
      <button>Play With the Pet</button>
      <button>Feed the Pet</button>
      <button>Scold the Pet</button>
      <button>Delete Pet</button>
    </div>
  )
}

export function App() {
  const [feedings, setFeedings] = useState()
  const [playtimes, setPlaytimes] = useState()
  const [scoldings, setScoldings] = useState()

  return (
    <>
      <header>
        <h1>Welcome to my SPA</h1>
        <nav>
          <ul>
            <Switch>
              <Route exact path="/">
                <PetList />
              </Route>
              <Route exact path="/pets/:id">
                <PetPage />
                Page 1
              </Route>
              <Route exact path="/2">
                Page 2
              </Route>
              <Route path="*">
                <p>Sorry, this page is Not Found!</p>
              </Route>
            </Switch>
            {/* <li>
              <Link to="/">Go Home</Link>
            </li> */}
            <li>
              <Link to="/pets/id">Show</Link>
            </li>
            {/* <li>
              <Link to="/2">Page 2</Link>
            </li> */}
          </ul>
        </nav>
      </header>
    </>
  )
}
