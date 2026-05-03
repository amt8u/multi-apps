import { useState } from 'react'

const firstNames = [
  'Aarav',
  'Diya',
  'Kabir',
  'Ira',
  'Vihaan',
  'Anaya',
  'Reyansh',
  'Myra',
]

const lastNames = [
  'Sharma',
  'Patel',
  'Reddy',
  'Mehta',
  'Iyer',
  'Singh',
  'Verma',
  'Kapoor',
]

const randomItem = (items) => items[Math.floor(Math.random() * items.length)]

function App() {
  const [generatedNames, setGeneratedNames] = useState([])

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    window.location.assign('/')
  }

  const generateName = () => {
    const nextName = `${randomItem(firstNames)} ${randomItem(lastNames)}`
    setGeneratedNames((previous) => [nextName, ...previous].slice(0, 10))
  }

  return (
    <main className="app">
      <button type="button" className="back-button" onClick={handleBack}>
        ← Back
      </button>
      <h1>Random Name Generator</h1>
      <p>Generate random names instantly.</p>

      <button type="button" className="action-button" onClick={generateName}>
        Generate Name
      </button>

      <ul>
        {generatedNames.length === 0 ? (
          <li>No names generated yet.</li>
        ) : (
          generatedNames.map((name, index) => <li key={`${name}-${index}`}>{name}</li>)
        )}
      </ul>
    </main>
  )
}

export default App
