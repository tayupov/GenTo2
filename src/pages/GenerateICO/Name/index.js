import React from 'react';

const Name = () => (
  <div>
    <h1>Name</h1>
    <form id="name-form">
      <label>How shall your Token be named?</label>
      <br/>
      <input type="text" name="token-name"/>
      <br/>
      <label>What would be your ticker symbol?</label>
      <br/>
      <input type="text" name="ticker-name"/>
    </form>
  </div>

)

export default Name;
