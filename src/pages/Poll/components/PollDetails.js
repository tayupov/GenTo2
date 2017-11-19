import React from 'react';

import { Divider, Button } from 'semantic-ui-react';
import { Doughnut } from  'react-chartjs-2';

const votingClosed = false;

const PollDetails = ({
    header
}) => {

	const data = {
		dataTokens : {
			labels: [
				'Tokens for',
				'Tokens against'
			],
			datasets: [{
				data: [300, 50],
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
				data: [200, 170],
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
		<div className="flex-center" style={{flexDirection: 'column'}}>
			<h2 style={{ textAlign: 'center', marginTop: '1em' }}>{header}</h2>
			<Divider />
			{votingClosed && <Doughnut data={data.dataTokens} />}
			{votingClosed && <Doughnut data={data.dataAddresses} />}
			<Divider />
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

export default PollDetails;