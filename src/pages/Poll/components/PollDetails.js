import React from 'react';

import { Divider} from 'semantic-ui-react';
import { Doughnut } from  'react-chartjs-2';

const data = {
	labels: [
		'Red',
		'Green',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		]
	}]
};

const PollDetails = ({
    header
}) => (
    <div>
        <h1 style={{ textAlign: 'center' }}>{header}</h1>
        <Divider />
        <Doughnut data={data} />
    </div>
)

export default PollDetails;