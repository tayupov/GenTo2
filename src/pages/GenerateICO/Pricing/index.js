import React from 'react';

const Pricing = () => (
  <div>
    <h1>Pricing</h1>
    <h2>What is the tokens Minimum and Maximum price during the auction?</h2>
    <select>
      <option value="kether-grand">kether / grand</option>
      <option value="ether">ether</option>
      <option value="finney">finney</option>
      <option value="gwei-shannon">gwei / shannon</option>
      <option value="mwei-babbage">mwei / babbage</option>
    </select>

    <h2>Choose your <strong>Min</strong> and <strong>Max</strong> price</h2>

    <form id="price-form">
      <label>Minimum</label>
      <br/>
      <input type="number" name="minimum-price"/>
      <br/>
      <label>Maximum</label>
      <br/>
      <input type="number" name="maximum-price"/>
      <br/>
      <input type="submit" name="create-button" value="Create Contract"/>
    </form>
  </div>

)

export default Pricing;
