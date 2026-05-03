import { useMemo, useState } from 'react'

const unitGroups = {
  length: {
    label: 'Length',
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      mile: 1609.34,
      foot: 0.3048,
    },
  },
  weight: {
    label: 'Weight',
    units: {
      kilogram: 1,
      gram: 0.001,
      pound: 0.453592,
      ounce: 0.0283495,
    },
  },
  time: {
    label: 'Time',
    units: {
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
    },
  },
}

function App() {
  const [groupKey, setGroupKey] = useState('length')
  const [fromUnit, setFromUnit] = useState('meter')
  const [toUnit, setToUnit] = useState('kilometer')
  const [inputValue, setInputValue] = useState('1')

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    window.location.assign('/')
  }

  const selectedGroup = unitGroups[groupKey]
  const unitKeys = Object.keys(selectedGroup.units)

  const output = useMemo(() => {
    const value = Number(inputValue)
    if (Number.isNaN(value)) {
      return 'Invalid input'
    }

    const fromFactor = selectedGroup.units[fromUnit]
    const toFactor = selectedGroup.units[toUnit]
    const baseValue = value * fromFactor
    const converted = baseValue / toFactor

    return converted.toLocaleString(undefined, { maximumFractionDigits: 8 })
  }, [inputValue, fromUnit, toUnit, selectedGroup])

  const handleGroupChange = (event) => {
    const nextGroup = event.target.value
    const nextUnits = Object.keys(unitGroups[nextGroup].units)
    setGroupKey(nextGroup)
    setFromUnit(nextUnits[0])
    setToUnit(nextUnits[1] ?? nextUnits[0])
  }

  return (
    <main className="app">
      <button type="button" className="back-button" onClick={handleBack}>
        ← Back
      </button>
      <h1>Unit Converter</h1>
      <p>Convert values across common units.</p>

      <section className="panel">
        <label>
          Category
          <select value={groupKey} onChange={handleGroupChange}>
            {Object.entries(unitGroups).map(([key, group]) => (
              <option key={key} value={key}>
                {group.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Value
          <input
            type="number"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
        </label>

        <label>
          From
          <select value={fromUnit} onChange={(event) => setFromUnit(event.target.value)}>
            {unitKeys.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>

        <label>
          To
          <select value={toUnit} onChange={(event) => setToUnit(event.target.value)}>
            {unitKeys.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="result">
        <h2>Result</h2>
        <strong>{output}</strong>
      </section>
    </main>
  )
}

export default App
