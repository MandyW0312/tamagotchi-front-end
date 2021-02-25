//@ts-nocheck
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, useParams } from 'react-router-dom'

export function App() {
  const [pets, setPets] = useState({})
  const [newNameText, setNewNameText] = useState('')
  const [feedings, setFeedings] = useState()
  const [playtimes, setPlaytimes] = useState()
  const [scoldings, setScoldings] = useState()

  useEffect(async () => {
    const response = await axios.get(
      'https://mandyw-tamagotchi.herokuapp.com/api/pets'
    )
    setPets(response.data)
  }, [])

  function PetPage() {
    return <p>This would be the details of pet 1!</p>
  }

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
      <header>
        <h1>Welcome to my SPA</h1>
        <nav>
          <ul>
            {Object.entries(pets).map(([petCode, petDetails]) => {
              return (
                <li key={petDetails.id}>
                  {petDetails.name}: Hunger Level: {petDetails.hungerLevel},
                  Happiness Level: {petDetails.happinessLevel}
                </li>
              )
            })}
            <li>
              <Link to="/">Go Home</Link>
            </li>
            <li>
              <Link to="/1">Page 1</Link>
            </li>
            <li>
              <Link to="/2">Page 2</Link>
            </li>
          </ul>
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
        </nav>
      </header>
      <Switch>
        <Route exact path="/">
          Home
        </Route>
        <Route exact path="/1">
          <PetPage />
          Page 1
        </Route>
        <Route exact path="/2">
          Page 2
        </Route>
        <Route path="*">Not Found</Route>
      </Switch>
    </>
  )
}
