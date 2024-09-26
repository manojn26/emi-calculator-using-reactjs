
import { useEffect, useState } from 'react'
import './App.css'
import { tenureData } from './utils/constants'
import { numberWithCommas } from './utils/config'

function App() {

  const [cost, setCost] = useState(0)
  const [interest, setInterest] = useState(10)
  const [fee, setFee] = useState(1)
  const [downPayment, setDownPayment] = useState(0)
  const [tenure, setTenure] = useState(12)
  const [emi, setEmi] = useState(0)

  const calculateEmi = (downPayment) => {
    if (!cost) return;

    const loanAmt = cost - downPayment;
    const rateOfInterest = interest / 100;
    const numberOfYears = tenure / 12;

    const EMI = (loanAmt * rateOfInterest * (1 + rateOfInterest) ** numberOfYears) /
      ((1 + rateOfInterest) ** numberOfYears - 1);

    return Number(EMI / 12).toFixed(0)
  }

  const calculateDownPayment = (emi) => {
    if (!cost) return;

    const downPaymentPercent = 100 - (emi / calculateEmi(0) * 100)
    return Number((downPaymentPercent / 100) * cost).toFixed(0)
  }

  const updateEmi = (e) => {
    if (!cost) return;

    const dp = Number(e.target.value);
    setDownPayment(dp.toFixed(0))

    // calculate the emi and update it
    const emi = calculateEmi(dp)
    setEmi(emi)

  }
  const updateDownPayment = (e) => {
    if (!cost) return;

    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0))

    // calculate the DP and update it
    const dp = calculateDownPayment(emi)
    setDownPayment(dp)
  }


  useEffect(() => {
    if (!(cost > 0)) {
      setDownPayment(0)
      setEmi(0)
    }

    const emi = calculateEmi(downPayment);
    setEmi(emi);
  }, [tenure, cost])


  return (
    <div className='app'>
      <span className='title' style={{ color: "red", fontSize: "xx-large" }}>EMI Calculator</span>
      <span className='title'>Total Cost of Asset</span>
      <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder='Total Cost of Asset' />

      <span className='title'>Interest Rate (in 1%)</span>
      <input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder='Interest Rate (in 1%)' />

      <span className='title'>Processing fee (in 1%)</span>
      <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} placeholder='Processing fee (in 1%)' />

      <span className='title'>Down Payment</span>
      <span style={{ textDecoration: "underline" }}>
        Total Down Payment - {numberWithCommas((Number(downPayment) + (cost - downPayment) * (fee) / 100).toFixed(0))}
      </span>
      <div>
        <input type="range" min={0} max={cost} className='slider' value={downPayment} onChange={updateEmi} />
        <div className='labels'>
          <label >0%</label>
          <label>{numberWithCommas(downPayment)}</label>
          <label >100%</label>
        </div>
      </div>

      <span className='title'>Loan per Month</span>
      <span style={{ textDecoration: "underline" }}>
        Total Loan Amount - {numberWithCommas((emi * tenure).toFixed(0))}
      </span>
      <div>
        <input type="range" min={calculateEmi(cost)} max={calculateEmi(0)} className='slider' value={emi} onChange={updateDownPayment} />
        <div className='labels'>
          <label >{calculateEmi(cost)}</label>
          <label>{numberWithCommas(emi)}</label>
          <label >{calculateEmi(0)}</label>
        </div>
      </div>

      <span className='title'>Tenure</span>
      <div className='tenure-container'>

        {tenureData.map((t, i) => (
          <button key={i} className={`tenure ${t === tenure ? 'selected' : ''}`} onClick={() => setTenure(t)}>{t}</button>
        ))}
      </div>

    </div>
  )
}

export default App
