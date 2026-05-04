import React, { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [time, setTime] = useState('')
  const [emi, setEmi] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [selectedField, setSelectedField] = useState('')

  // EMI calculation formulas
  const calculateEMI = (P, r, n) => {
    const monthlyRate = r / 12 / 100
    const months = n * 12
    const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return emi
  }

  const calculatePrincipal = (emi, r, n) => {
    const monthlyRate = r / 12 / 100
    const months = n * 12
    const principal = (emi * (Math.pow(1 + monthlyRate, months) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, months))
    return principal
  }

  const calculateRate = (P, emi, n) => {
    const months = n * 12
    // Using Newton-Raphson method to find rate
    let rate = 1 // Initial guess
    const tolerance = 0.0001
    const maxIterations = 100
    
    for (let i = 0; i < maxIterations; i++) {
      const monthlyRate = rate / 12 / 100
      const f = (P * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) - emi
      const df = P * months * Math.pow(1 + monthlyRate, months + 1) * (monthlyRate * Math.pow(1 + monthlyRate, months) - Math.pow(1 + monthlyRate, months) + monthlyRate) / Math.pow(monthlyRate * Math.pow(1 + monthlyRate, months) - Math.pow(1 + monthlyRate, months) + monthlyRate, 2)
      
      const newRate = rate - f / df
      
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate
      }
      
      rate = newRate
    }
    
    return rate
  }

  const calculateTime = (P, r, emi) => {
    const monthlyRate = r / 12 / 100
    let months = 0
    
    // Using approximation and iteration
    let remainingPrincipal = P
    while (remainingPrincipal > 0 && months < 1200) { // Max 100 years
      const interestPayment = remainingPrincipal * monthlyRate
      const principalPayment = emi - interestPayment
      
      if (principalPayment <= 0) break
      
      remainingPrincipal -= principalPayment
      months++
    }
    
    return months / 12
  }

  const calculateTotalInterest = (P, emi, n) => {
    const totalPayment = emi * n * 12
    return totalPayment - P
  }

  const calculateTotalPayment = (P, emi, n) => {
    return emi * n * 12
  }

  const calculateSelectedField = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate)
    const t = parseFloat(time)
    const e = parseFloat(emi)

    if (selectedField === 'principal' && !isNaN(r) && r > 0 && !isNaN(t) && t > 0 && !isNaN(e) && e > 0) {
      const calculatedPrincipal = calculatePrincipal(e, r, t)
      setPrincipal(calculatedPrincipal.toFixed(2))
      setStatusMessage('Principal amount calculated!')
    } else if (selectedField === 'rate' && !isNaN(p) && p > 0 && !isNaN(t) && t > 0 && !isNaN(e) && e > 0) {
      const calculatedRate = calculateRate(p, e, t)
      if (calculatedRate > 0 && calculatedRate < 100) {
        setRate(calculatedRate.toFixed(2))
        setStatusMessage('Interest rate calculated!')
      } else {
        setStatusMessage('Cannot calculate rate with given values. Please check your inputs.')
      }
    } else if (selectedField === 'time' && !isNaN(p) && p > 0 && !isNaN(r) && r > 0 && !isNaN(e) && e > 0) {
      const calculatedTime = calculateTime(p, r, e)
      if (calculatedTime > 0 && calculatedTime < 100) {
        setTime(calculatedTime.toFixed(2))
        setStatusMessage('Loan tenure calculated!')
      } else {
        setStatusMessage('Cannot calculate tenure with given values. Please check your inputs.')
      }
    } else if (selectedField === 'emi' && !isNaN(p) && p > 0 && !isNaN(r) && r > 0 && !isNaN(t) && t > 0) {
      const calculatedEMI = calculateEMI(p, r, t)
      setEmi(calculatedEMI.toFixed(2))
      setStatusMessage('EMI calculated!')
    }
  }

  useEffect(() => {
    const p = parseFloat(principal)
    const r = parseFloat(rate)
    const t = parseFloat(time)
    const e = parseFloat(emi)

    const filledFields = [!isNaN(p) && p > 0, !isNaN(r) && r > 0, !isNaN(t) && t > 0, !isNaN(e) && e > 0].filter(Boolean).length

    if (selectedField) {
      // Calculate selected field when other 3 fields are filled
      if (filledFields >= 3) {
        calculateSelectedField()
      } else {
        setStatusMessage(`Enter 3 values to calculate the selected field (${3 - filledFields} more needed)`)
      }
    } else {
      // Original logic when no field is selected
      if (filledFields === 3) {
        setStatusMessage('Select a field to calculate or enter the 4th value')
      } else if (filledFields === 4) {
        setStatusMessage('All values entered. Here are your loan details:')
      } else {
        setStatusMessage(`Select a field to calculate or enter any 3 values (${Math.max(3 - filledFields, 0)} more needed)`)
      }
    }
  }, [principal, rate, time, emi, selectedField])

  const handleInputChange = (setter, value, fieldName) => {
    // Prevent changing the value of the selected field
    if (selectedField === fieldName) {
      return
    }
    setter(value)
  }

  const clearFields = () => {
    setPrincipal('')
    setRate('')
    setTime('')
    setEmi('')
    setSelectedField('')
    setStatusMessage('Select a field to calculate or enter any 3 values')
  }

  const handleFieldSelect = (field) => {
    // Always select the new field (radio buttons cannot be deselected)
    setSelectedField(field)
    setStatusMessage(`Selected ${field.charAt(0).toUpperCase() + field.slice(1)} - Enter 3 other values to calculate`)
    
    // Clear the selected field value when selecting it
    if (field === 'principal') setPrincipal('')
    else if (field === 'rate') setRate('')
    else if (field === 'time') setTime('')
    else if (field === 'emi') setEmi('')
  }

  const isFieldDisabled = (field) => {
    return selectedField === field
  }

  const getStatusType = () => {
    if (statusMessage.includes('calculated') || statusMessage.includes('All values entered')) return 'success'
    if (statusMessage.includes('Enter') || statusMessage.includes('more needed') || statusMessage.includes('Select a field')) return 'info'
    if (statusMessage.includes('Cannot calculate')) return 'error'
    return 'success'
  }

  return (
    <div className="container">
      <header className="header">
        <h1>EMI Calculator 2.0</h1>
        <p>Advanced loan calculator - Enter any 3 values to calculate the 4th automatically</p>
      </header>

      <main className="calculator-form">
        {statusMessage && (
          <div className={`status-message ${getStatusType()}`}>
            {statusMessage}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="principal">Principal Amount (P)</label>
            <div className="input-wrapper">
              <label className="radio-wrapper">
                <input
                  type="radio"
                  name="calculate-field"
                  value="principal"
                  checked={selectedField === 'principal'}
                  onChange={() => handleFieldSelect('principal')}
                  className="radio-input"
                />
                <span className="radio-label">Calculate</span>
              </label>
              <input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => handleInputChange(setPrincipal, e.target.value, 'principal')}
                placeholder="Enter principal amount"
                min="0"
                step="100"
                disabled={isFieldDisabled('principal')}
                className={isFieldDisabled('principal') ? 'disabled' : ''}
              />
              <span className="input-suffix">₹</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rate">Interest Rate (R)</label>
            <div className="input-wrapper">
              <label className="radio-wrapper">
                <input
                  type="radio"
                  name="calculate-field"
                  value="rate"
                  checked={selectedField === 'rate'}
                  onChange={() => handleFieldSelect('rate')}
                  className="radio-input"
                />
                <span className="radio-label">Calculate</span>
              </label>
              <input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => handleInputChange(setRate, e.target.value, 'rate')}
                placeholder="Enter annual interest rate"
                min="0"
                max="100"
                step="0.1"
                disabled={isFieldDisabled('rate')}
                className={isFieldDisabled('rate') ? 'disabled' : ''}
              />
              <span className="input-suffix">%</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="time">Loan Tenure (T)</label>
            <div className="input-wrapper">
              <label className="radio-wrapper">
                <input
                  type="radio"
                  name="calculate-field"
                  value="time"
                  checked={selectedField === 'time'}
                  onChange={() => handleFieldSelect('time')}
                  className="radio-input"
                />
                <span className="radio-label">Calculate</span>
              </label>
              <input
                id="time"
                type="number"
                value={time}
                onChange={(e) => handleInputChange(setTime, e.target.value, 'time')}
                placeholder="Enter loan period"
                min="0"
                max="100"
                step="0.5"
                disabled={isFieldDisabled('time')}
                className={isFieldDisabled('time') ? 'disabled' : ''}
              />
              <span className="input-suffix">Years</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="emi">Monthly EMI</label>
            <div className="input-wrapper">
              <label className="radio-wrapper">
                <input
                  type="radio"
                  name="calculate-field"
                  value="emi"
                  checked={selectedField === 'emi'}
                  onChange={() => handleFieldSelect('emi')}
                  className="radio-input"
                />
                <span className="radio-label">Calculate</span>
              </label>
              <input
                id="emi"
                type="number"
                value={emi}
                onChange={(e) => handleInputChange(setEmi, e.target.value, 'emi')}
                placeholder="Enter monthly EMI"
                min="0"
                step="100"
                disabled={isFieldDisabled('emi')}
                className={isFieldDisabled('emi') ? 'disabled' : ''}
              />
              <span className="input-suffix">₹</span>
            </div>
          </div>
        </div>

        <button type="button" onClick={clearFields} className="calculate-button">
          Clear All Fields
        </button>

              </main>
    </div>
  )
}

export default App
