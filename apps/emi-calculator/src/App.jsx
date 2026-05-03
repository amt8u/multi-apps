import { useMemo, useState } from 'react'

function App() {
  const [loanAmount, setLoanAmount] = useState('500000')
  const [annualRate, setAnnualRate] = useState('8.5')
  const [tenureMonths, setTenureMonths] = useState('240')

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    window.location.assign('/')
  }

  const calculation = useMemo(() => {
    const principal = Number(loanAmount)
    const yearlyRate = Number(annualRate)
    const months = Number(tenureMonths)

    if (principal <= 0 || yearlyRate < 0 || months <= 0) {
      return null
    }

    const monthlyRate = yearlyRate / 12 / 100
    const emi =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1)

    const totalPayment = emi * months
    const totalInterest = totalPayment - principal

    return {
      emi,
      totalPayment,
      totalInterest,
    }
  }, [loanAmount, annualRate, tenureMonths])

  const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value)

  return (
    <main className="app">
      <button type="button" className="back-button" onClick={handleBack}>
        ← Back
      </button>
      <h1>EMI Calculator</h1>
      <p>Calculate monthly EMI, total interest, and total payment.</p>

      <section className="card">
        <label>
          Loan Amount (INR)
          <input
            type="number"
            min="0"
            value={loanAmount}
            onChange={(event) => setLoanAmount(event.target.value)}
          />
        </label>

        <label>
          Annual Interest Rate (%)
          <input
            type="number"
            min="0"
            step="0.01"
            value={annualRate}
            onChange={(event) => setAnnualRate(event.target.value)}
          />
        </label>

        <label>
          Tenure (Months)
          <input
            type="number"
            min="1"
            value={tenureMonths}
            onChange={(event) => setTenureMonths(event.target.value)}
          />
        </label>
      </section>

      {calculation ? (
        <section className="results">
          <div>
            <h2>Monthly EMI</h2>
            <strong>{formatINR(calculation.emi)}</strong>
          </div>
          <div>
            <h2>Total Interest</h2>
            <strong>{formatINR(calculation.totalInterest)}</strong>
          </div>
          <div>
            <h2>Total Payment</h2>
            <strong>{formatINR(calculation.totalPayment)}</strong>
          </div>
        </section>
      ) : (
        <p className="error">Please enter valid positive numbers.</p>
      )}
    </main>
  )
}

export default App
