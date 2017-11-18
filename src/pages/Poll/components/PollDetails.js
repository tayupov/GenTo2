import React from 'react';

import { Divider, Button } from 'semantic-ui-react';
import { Doughnut } from  'react-chartjs-2';

const dataTokens = {
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
};

const dataAddresses = {
	labels: [
		'Addresses for',
		'Addresses against'
	],
	datasets: [{
		data: [200, 50],
		backgroundColor: [
		'#1ecc9b',
		'#778899'
		],
		hoverBackgroundColor: [
		'#1ecc9b',
		'#778899'
		]
	}]
};

const votingClosed = false;

const PollDetails = ({
    header
}) => (
    <div className="flex-center" style={{flexDirection: 'column'}}>
        <h2 style={{ textAlign: 'center', marginTop: '1em' }}>{header}</h2>
        <Divider />
		{votingClosed && <Doughnut data={dataTokens} />}
		{votingClosed && <Doughnut data={dataAddresses} />}
		<Divider />
		{!votingClosed && <Button.Group>
			<Button positive>Approve</Button>
			<Button.Or />
			<Button negative style={{ marginRight: '1em' }}>Reject</Button>
		</Button.Group>}
    </div>
)

export default PollDetails;