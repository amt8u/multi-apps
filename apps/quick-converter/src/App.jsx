import React, { useState, useEffect } from 'react'

const CollapsibleSection = ({ title, children, defaultCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  
  return (
    <div className="rates-section">
      <div className="rates-header">
        <h3>{title}</h3>
        <button 
          type="button" 
          className="edit-rates-button" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? 'Edit Rates' : 'Done'}
        </button>
      </div>
      
      {!isCollapsed && children}
    </div>
  )
}

const westernUnits = [
  { value: 1, label: 'Ones', symbol: '' },
  { value: 1000, label: 'Thousand', symbol: 'K' },
  { value: 1000000, label: 'Million', symbol: 'M' },
  { value: 1000000000, label: 'Billion', symbol: 'B' },
  { value: 1000000000000, label: 'Trillion', symbol: 'T' }
]

const indianUnits = [
  { value: 1, label: 'Ones', symbol: '' },
  { value: 100, label: 'Hundred', symbol: '' },
  { value: 1000, label: 'Thousand', symbol: '' },
  { value: 100000, label: 'Lakh', symbol: 'L' },
  { value: 10000000, label: 'Crore', symbol: 'Cr' },
  { value: 1000000000, label: 'Arab', symbol: 'Arab' },
  { value: 100000000000, label: 'Kharab', symbol: 'Kharab' }
]

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' }
]

function formatIndianNumber(num) {
  const numStr = num.toString()
  let result = ''
  let count = 0
  
  for (let i = numStr.length - 1; i >= 0; i--) {
    result = numStr[i] + result
    count++
    
    if (count === 3 && i > 0) {
      result = ',' + result
      count = 0
    } else if (count === 2 && i > 0) {
      result = ',' + result
      count = 0
    }
  }
  
  return result
}

function formatWesternNumber(num) {
  return num.toLocaleString('en-US')
}

function App() {
  const [activeTab, setActiveTab] = useState('numerical')
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState('western')
  const [fromScale, setFromScale] = useState(1) // One
  const [toUnit, setToUnit] = useState('indian')
  const [toScale, setToScale] = useState(1) // One
  const [result, setResult] = useState('')
  const [customRates, setCustomRates] = useState({
    'million-to-lakh': 10,
    'billion-to-crore': 100,
    'thousand-to-thousand': 1
  })
  const [showRateEditor, setShowRateEditor] = useState(false)
  
  // Currency conversion states
  const [currencyAmount, setCurrencyAmount] = useState('')
  const [inputCurrency, setInputCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('INR')
  const [currencyResult, setCurrencyResult] = useState('')
  const [currencyRates, setCurrencyRates] = useState({
    'USD-INR': 83.12,
    'EUR-INR': 90.45,
    'GBP-INR': 105.67,
    'USD-EUR': 0.92,
    'USD-GBP': 0.79,
    'USD-JPY': 149.50
  })
  const [showCurrencyRateEditor, setShowCurrencyRateEditor] = useState(false)
  const [loadingRates, setLoadingRates] = useState(false)

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    window.location.assign('/')
  }

  const fetchCurrencyRates = async () => {
    setLoadingRates(true)
    try {
      // Using a free API for demo purposes
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      if (response.ok) {
        const data = await response.json()
        const newRates = { ...currencyRates }
        
        // Update common rates
        newRates['USD-INR'] = data.rates.INR || 83.12
        newRates['USD-EUR'] = data.rates.EUR || 0.92
        newRates['USD-GBP'] = data.rates.GBP || 0.79
        newRates['USD-JPY'] = data.rates.JPY || 149.50
        newRates['USD-CAD'] = data.rates.CAD || 1.36
        newRates['USD-AUD'] = data.rates.AUD || 1.52
        newRates['USD-CNY'] = data.rates.CNY || 7.24
        newRates['USD-CHF'] = data.rates.CHF || 0.88
        newRates['USD-SAR'] = data.rates.SAR || 3.75
        
        // Calculate cross rates
        newRates['EUR-INR'] = newRates['USD-INR'] / newRates['USD-EUR']
        newRates['GBP-INR'] = newRates['USD-INR'] / newRates['USD-GBP']
        
        setCurrencyRates(newRates)
      }
    } catch (error) {
      console.error('Failed to fetch currency rates:', error)
    } finally {
      setLoadingRates(false)
    }
  }

  const convertCurrency = () => {
    if (!currencyAmount || isNaN(currencyAmount)) {
      setCurrencyResult('')
      return
    }

    const amount = parseFloat(currencyAmount)
    let convertedAmount = 0
    
    if (fromCurrency === toCurrency) {
      convertedAmount = amount
    } else {
      const rateKey = `${fromCurrency}-${toCurrency}`
      const reverseRateKey = `${toCurrency}-${fromCurrency}`
      
      if (currencyRates[rateKey]) {
        convertedAmount = amount * currencyRates[rateKey]
      } else if (currencyRates[reverseRateKey]) {
        convertedAmount = amount / currencyRates[reverseRateKey]
      } else {
        // Try to convert via USD as base
        const toUsdRate = currencyRates[`USD-${fromCurrency}`]
        const fromUsdRate = currencyRates[`USD-${toCurrency}`]
        
        if (toUsdRate && fromUsdRate) {
          convertedAmount = (amount / toUsdRate) * fromUsdRate
        } else {
          setCurrencyResult('Exchange rate not available')
          return
        }
      }
    }
    
    const fromCurrencyInfo = currencies.find(c => c.code === fromCurrency)
    const toCurrencyInfo = currencies.find(c => c.code === toCurrency)
    
    const formattedResult = `${fromCurrencyInfo.symbol}${amount.toFixed(2)} ${fromCurrency} = ${toCurrencyInfo.symbol}${convertedAmount.toFixed(2)} ${toCurrency}`
    setCurrencyResult(formattedResult)
  }

  // Auto-convert when inputs change
  React.useEffect(() => {
    if (inputValue) {
      convert()
    } else {
      setResult('')
    }
  }, [inputValue, fromUnit, fromScale, toUnit, toScale, customRates, toCurrency, currencyRates])

  const updateCurrencyRate = (pair, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setCurrencyRates(prev => ({ ...prev, [pair]: numValue }))
    }
  }

  const resetCurrencyRates = () => {
    setCurrencyRates({
      'USD-INR': 83.12,
      'EUR-INR': 90.45,
      'GBP-INR': 105.67,
      'USD-EUR': 0.92,
      'USD-GBP': 0.79,
      'USD-JPY': 149.50
    })
  }

  const convert = () => {
    if (!inputValue || isNaN(inputValue)) {
      setResult('')
      return
    }

    const num = parseFloat(inputValue)
    let baseValue = num * fromScale
    let convertedValue = 0
    let formattedResult = ''
    
    // Apply custom rates for cross-system conversions
    if (fromUnit === 'western' && toUnit === 'indian') {
      if (fromScale === 1000000 && toScale === 100000) { // Million to Lakh
        convertedValue = num * customRates['million-to-lakh']
        baseValue = num * fromScale
      } else if (fromScale === 1000000000 && toScale === 10000000) { // Billion to Crore
        convertedValue = num * customRates['billion-to-crore']
        baseValue = num * fromScale
      } else {
        convertedValue = baseValue / toScale
      }
      formattedResult = `${formatIndianNumber(baseValue)} = ${num} ${westernUnits.find(u => u.value === fromScale)?.label} = ${convertedValue.toFixed(2)} ${indianUnits.find(u => u.value === toScale)?.label}`
    } else if (fromUnit === 'indian' && toUnit === 'western') {
      if (fromScale === 100000 && toScale === 1000000) { // Lakh to Million
        convertedValue = num / customRates['million-to-lakh']
        baseValue = num * fromScale
      } else if (fromScale === 10000000 && toScale === 1000000000) { // Crore to Billion
        convertedValue = num / customRates['billion-to-crore']
        baseValue = num * fromScale
      } else {
        convertedValue = baseValue / toScale
      }
      formattedResult = `${formatIndianNumber(baseValue)} = ${num} ${indianUnits.find(u => u.value === fromScale)?.label} = ${convertedValue.toFixed(2)} ${westernUnits.find(u => u.value === toScale)?.label}`
    } else if (fromUnit === 'western' && toUnit === 'western') {
      convertedValue = baseValue / toScale
      formattedResult = `${num} ${westernUnits.find(u => u.value === fromScale)?.label} = ${convertedValue.toFixed(2)} ${westernUnits.find(u => u.value === toScale)?.label}`
    } else if (fromUnit === 'indian' && toUnit === 'indian') {
      convertedValue = baseValue / toScale
      formattedResult = `${num} ${indianUnits.find(u => u.value === fromScale)?.label} = ${convertedValue.toFixed(2)} ${indianUnits.find(u => u.value === toScale)?.label}`
    }
    
    // Add currency conversion as additional line
    const originalInputValue = parseFloat(inputValue) * fromScale
    const currencyConversionLine = getCurrencyConversionLine(originalInputValue)
    
    const fullResult = currencyConversionLine 
      ? `${formattedResult}\n${currencyConversionLine}`
      : formattedResult
      
    setResult(fullResult)
  }
  
  const getCurrencyConversionLine = (originalValue) => {
    if (!originalValue || originalValue === 0) {
      return ''
    }
    
    const amount = parseFloat(originalValue)
    let convertedAmount = 0
    
    // Convert from input currency to target currency
    if (inputCurrency === toCurrency) {
      convertedAmount = amount
    } else {
      const rateKey = `${inputCurrency}-${toCurrency}`
      const reverseRateKey = `${toCurrency}-${inputCurrency}`
      
      if (currencyRates[rateKey]) {
        convertedAmount = amount * currencyRates[rateKey]
      } else if (currencyRates[reverseRateKey]) {
        convertedAmount = amount / currencyRates[reverseRateKey]
      } else {
        // Try to convert via USD as base
        const toUsdRate = currencyRates[`USD-${inputCurrency}`]
        const fromUsdRate = currencyRates[`USD-${toCurrency}`]
        
        if (toUsdRate && fromUsdRate) {
          const usdAmount = amount / toUsdRate
          convertedAmount = usdAmount * fromUsdRate
        } else {
          return ''
        }
      }
    }
    
    const toCurrencyInfo = currencies.find(c => c.code === toCurrency)
    const fromUnitInfo = (fromUnit === 'western' ? westernUnits : indianUnits).find(u => u.value === fromScale)
    const formattedOriginalValue = `${inputValue} ${fromUnitInfo?.label}`
    
    // Convert the currency amount to the selected target format
    let targetFormat = ''
    if (toUnit === 'indian') {
      if (toScale === 10000000) { // Crores
        const crores = convertedAmount / 10000000
        targetFormat = `${crores.toFixed(2)} Crores`
      } else if (toScale === 100000) { // Lakhs
        const lakhs = convertedAmount / 100000
        targetFormat = `${lakhs.toFixed(2)} Lakhs`
      } else if (toScale === 1000) { // Thousands
        const thousands = convertedAmount / 1000
        targetFormat = `${thousands.toFixed(2)} Thousands`
      } else {
        targetFormat = `${convertedAmount.toFixed(2)}`
      }
    } else { // western units
      if (toScale === 1000000000) { // Billions
        const billions = convertedAmount / 1000000000
        targetFormat = `${billions.toFixed(2)} Billions`
      } else if (toScale === 1000000) { // Millions
        const millions = convertedAmount / 1000000
        targetFormat = `${millions.toFixed(2)} Millions`
      } else if (toScale === 1000) { // Thousands
        const thousands = convertedAmount / 1000
        targetFormat = `${thousands.toFixed(2)} Thousands`
      } else {
        targetFormat = `${convertedAmount.toFixed(2)}`
      }
    }
    
    return `Final Value: ${formattedOriginalValue} = ${toCurrencyInfo.symbol}${convertedAmount.toFixed(2)} ${toCurrency} (${targetFormat})`
  }

  // Auto-convert when inputs change
  React.useEffect(() => {
    if (inputValue) {
      convert()
    }
  }, [inputValue, fromUnit, fromScale, toUnit, toScale, customRates, inputCurrency, toCurrency, currencyRates])

  // Focus on amount input on page load
  React.useEffect(() => {
    const amountInput = document.querySelector('.amount-input')
    if (amountInput) {
      amountInput.focus()
    }
  }, [])

  const updateRate = (rateKey, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setCustomRates(prev => ({ ...prev, [rateKey]: numValue }))
    }
  }

  const resetRates = () => {
    setCustomRates({
      'million-to-lakh': 10,
      'billion-to-crore': 100,
      'thousand-to-thousand': 1
    })
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    const tempScale = fromScale
    setFromScale(toScale)
    setToScale(tempScale)
    if (result) {
      setTimeout(convert, 100)
    }
  }

  return (
    <main className="app">
      <button type="button" className="back-button" onClick={handleBack}>
        ← Back
      </button>
      
      <div className="converter-container">
        <h1>Quick Universal Converter</h1>
        <p>Convert between numerical systems (Million, Billion, Lakhs, Crores) with automatic currency conversion</p>

        <div className="converter-form">
            <div className="input-group">
              <label>Enter Amount:</label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter amount..."
                className="amount-input"
              />
            </div>

            <div className="units-row">
              <div className="unit-selector">
                <label>From:</label>
                <select 
                  value={fromScale} 
                  onChange={(e) => {
                    setFromScale(Number(e.target.value))
                    // Auto-set unit type based on scale
                    const isWesternScale = westernUnits.some(u => u.value === Number(e.target.value))
                    setFromUnit(isWesternScale ? 'western' : 'indian')
                  }}
                  className="unit-scale-select"
                >
                  {(fromUnit === 'western' ? westernUnits : indianUnits).map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label} {unit.symbol && `(${unit.symbol})`}
                    </option>
                  ))}
                </select>
                <select 
                  value={fromUnit} 
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="unit-type-select"
                >
                  <option value="western">Western</option>
                  <option value="indian">Indian</option>
                </select>
              </div>

              <button type="button" onClick={swapUnits} className="swap-button">
                ⇄
              </button>

              <div className="unit-selector">
                <label>To:</label>
                <select 
                  value={toScale} 
                  onChange={(e) => {
                    setToScale(Number(e.target.value))
                    // Auto-set unit type based on scale
                    const isWesternScale = westernUnits.some(u => u.value === Number(e.target.value))
                    setToUnit(isWesternScale ? 'western' : 'indian')
                  }}
                  className="unit-scale-select"
                >
                  {(toUnit === 'western' ? westernUnits : indianUnits).map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label} {unit.symbol && `(${unit.symbol})`}
                    </option>
                  ))}
                </select>
                <select 
                  value={toUnit} 
                  onChange={(e) => setToUnit(e.target.value)}
                  className="unit-type-select"
                >
                  <option value="western">Western</option>
                  <option value="indian">Indian</option>
                </select>
              </div>
            </div>

            <button type="button" onClick={convert} className="convert-button" style={{ display: 'none' }}>
              Convert
            </button>

            <div className="units-row">
              <div className="unit-selector">
                <label>Input Currency:</label>
                <select 
                  value={inputCurrency} 
                  onChange={(e) => setInputCurrency(e.target.value)}
                  className="currency-select"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="unit-selector">
                <label>Convert To Currency:</label>
                <select 
                  value={toCurrency} 
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="currency-select"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {result && (
              <div className="result">
                <h3>Result:</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{result}</p>
              </div>
            )}
          </div>

          <CollapsibleSection title="Numerical Conversion Rates" defaultCollapsed={true}>
            <div className="rates-display">
              <div className="rate-item">
                <span>1 Million =</span>
                <span className="rate-value">{customRates['million-to-lakh']} Lakhs</span>
              </div>
              <div className="rate-item">
                <span>1 Billion =</span>
                <span className="rate-value">{customRates['billion-to-crore']} Crores</span>
              </div>
              <div className="rate-item">
                <span>1 Thousand =</span>
                <span className="rate-value">{customRates['thousand-to-thousand']} Thousand</span>
              </div>
            </div>

            <div className="rate-editor">
              <div className="rate-input-group">
                <label>1 Million =</label>
                <input
                  type="number"
                  step="0.01"
                  value={customRates['million-to-lakh']}
                  onChange={(e) => updateRate('million-to-lakh', e.target.value)}
                  className="rate-input"
                />
                <span>Lakhs</span>
              </div>
              <div className="rate-input-group">
                <label>1 Billion =</label>
                <input
                  type="number"
                  step="0.01"
                  value={customRates['billion-to-crore']}
                  onChange={(e) => updateRate('billion-to-crore', e.target.value)}
                  className="rate-input"
                />
                <span>Crores</span>
              </div>
              <div className="rate-input-group">
                <label>1 Thousand =</label>
                <input
                  type="number"
                  step="0.01"
                  value={customRates['thousand-to-thousand']}
                  onChange={(e) => updateRate('thousand-to-thousand', e.target.value)}
                  className="rate-input"
                />
                <span>Thousand</span>
              </div>
              <button type="button" onClick={resetRates} className="reset-button">
                Reset to Default
              </button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Currency Exchange Rates" defaultCollapsed={true}>
            <div className="rates-header">
              <div className="rate-actions">
                <button 
                  type="button" 
                  onClick={fetchCurrencyRates}
                  disabled={loadingRates}
                  className="refresh-rates-button"
                >
                  {loadingRates ? 'Refreshing...' : 'Refresh Rates'}
                </button>
              </div>
            </div>
            
            <div className="rates-display">
              <div className="rate-item">
                <span>1 USD =</span>
                <span className="rate-value">{currencyRates['USD-INR']?.toFixed(2)} INR</span>
              </div>
              <div className="rate-item">
                <span>1 EUR =</span>
                <span className="rate-value">{currencyRates['EUR-INR']?.toFixed(2)} INR</span>
              </div>
              <div className="rate-item">
                <span>1 GBP =</span>
                <span className="rate-value">{currencyRates['GBP-INR']?.toFixed(2)} INR</span>
              </div>
              <div className="rate-item">
                <span>1 USD =</span>
                <span className="rate-value">{currencyRates['USD-EUR']?.toFixed(2)} EUR</span>
              </div>
            </div>

            <div className="rate-editor">
              <div className="rate-input-group">
                <label>1 USD =</label>
                <input
                  type="number"
                  step="0.01"
                  value={currencyRates['USD-INR'] || ''}
                  onChange={(e) => updateCurrencyRate('USD-INR', e.target.value)}
                  className="rate-input"
                />
                <span>INR</span>
              </div>
              <div className="rate-input-group">
                <label>1 EUR =</label>
                <input
                  type="number"
                  step="0.01"
                  value={currencyRates['EUR-INR'] || ''}
                  onChange={(e) => updateCurrencyRate('EUR-INR', e.target.value)}
                  className="rate-input"
                />
                <span>INR</span>
              </div>
              <div className="rate-input-group">
                <label>1 GBP =</label>
                <input
                  type="number"
                  step="0.01"
                  value={currencyRates['GBP-INR'] || ''}
                  onChange={(e) => updateCurrencyRate('GBP-INR', e.target.value)}
                  className="rate-input"
                />
                <span>INR</span>
              </div>
              <div className="rate-input-group">
                <label>1 USD =</label>
                <input
                  type="number"
                  step="0.01"
                  value={currencyRates['USD-EUR'] || ''}
                  onChange={(e) => updateCurrencyRate('USD-EUR', e.target.value)}
                  className="rate-input"
                />
                <span>EUR</span>
              </div>
              <button type="button" onClick={resetCurrencyRates} className="reset-button">
                Reset to Default
              </button>
            </div>
          </CollapsibleSection>

                  </div>
    </main>
  );
}

export default App
