import React from 'react';

import { Divider, Button, Progress } from 'semantic-ui-react';
import { Doughnut } from  'react-chartjs-2';

const VoteDetails = ({
    header, polls, currDaoDetails
}) => {

	console.log('polls');
	console.log(polls);

	console.log(header);

	const currVote = polls.filter(obj => obj.header === header)[0];
	
	const tokensFor = currVote.tokensFor;
	const tokensAgainst = currVote.tokensAgainst;
	const addressesFor = currVote.addressesFor;
	const addressesAgainst = currVote.addressesAgainst;

	const data = {
		dataTokens : {
			labels: [
				'Tokens for',
				'Tokens against'
			],
			datasets: [{
				data: [tokensFor, tokensAgainst],
				backgroundColor: [
				'#1ecc9b',
				'#778899'
				],
				hoverBackgroundColor: [
				'#1ecc9b',
				'#778899'
				]
			}]
		},
		dataAddresses : {
			labels: [
				'Addresses for',
				'Addresses against'
			],
			datasets: [{
				data: [addressesFor, addressesAgainst],
				backgroundColor: [
				'#1ecc9b',
				'#778899'
				],
				hoverBackgroundColor: [
				'#1ecc9b',
				'#778899'
				]
			}]
		}
	}

	const votingClosed = true;
	
	return (
		<div>
			<h2 style={{ textAlign: 'center', marginTop: '0' }}>{header}</h2>
				<Divider />
				{votingClosed && <Doughnut data={data.dataTokens} />}
				{votingClosed && <Doughnut data={data.dataAddresses} />}
				<Divider />
                <Progress percent={(((tokensFor + tokensAgainst) / currDaoDetails.totalSupply) * 100).toFixed(0)} indicating progress label='Tokens have already voted' />
                <Progress percent={(((addressesFor + addressesAgainst) / currDaoDetails.totalAddresses) * 100).toFixed(0)} indicating progress label='Adresses have already voted' />
			{!votingClosed &&
			<div style={{ marginBottom: '1em' }}>
				<h3>Detailed information about the Voting:</h3>
				<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
			</div>
			}
			{!votingClosed && 
			<Button.Group>
				<Button positive>Approve</Button>
				<Button.Or />
				<Button negative style={{ marginRight: '1em' }}>Reject</Button>
			</Button.Group>}
		</div>
	)
}

export default VoteDetails;