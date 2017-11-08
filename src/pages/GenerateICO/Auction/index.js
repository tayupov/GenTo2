import React from 'react';

const Auction = () => (
  <div>
    <h1>Auction</h1>
    <h2>Choose a type of Auction</h2>
    <canvas id="auctionChart" width="400px" height="200px"></canvas>
  </div>

)

var c = document.getElementById('auctionChart');
//var ctx = c.getContext('2d');
//var img = document.getElementById('image');
//ctx.drawImage(img, 10,10);

export default Auction;
