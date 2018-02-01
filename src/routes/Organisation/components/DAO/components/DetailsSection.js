import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment, Checkbox, Input, Button, Icon } from 'semantic-ui-react';

class DetailsSection extends Component {
	onClick = () => (
		this.props.notify('Power transferred!', 'success')
	)

	render() {
		return (
			<Grid>
				<Grid.Row>
					<Grid.Column width={16}>
						<Header as='h2' attached>
							Primary Goal
                    </Header>
						<Segment attached padded raised textAlign='center' color='olive'>
							Details Placeholder
						</Segment>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column width={8}>
						<Header as='h2' attached textAlign='left'>
							Dao Name
                    </Header>
						<Segment attached padded raised textAlign='left' color='olive'>
						  Name Placeholder
						</Segment>
					</Grid.Column>
					<Grid.Column width={8}>
						<Header as='h2' attached textAlign='right'>
							Created at
                    </Header>
						<Segment attached padded raised textAlign='right' color='olive'>
							Salesstart Placeholder
						</Segment>
					</Grid.Column>
				</Grid.Row>

				<Grid.Row>
					<Grid.Column width={8}>
						<Header as='h2' attached textAlign='left'>
							Ticker Symbol
                    </Header>
						<Segment attached padded raised textAlign='left' color='olive'>
							Tickersymbol Placeholder
						</Segment>
					</Grid.Column>
					<Grid.Column width={8}>
						<Header as='h2' attached textAlign='right'>
							Web Page
                    </Header>
						<Segment attached padded raised textAlign='right' color='olive'>
							Website Placeholder
						</Segment>
					</Grid.Column>
				</Grid.Row>

				<Grid.Row>
					<Grid.Column width={8}>
						<Header as='h2' attached textAlign='left'>
							Tokens Owned
                    </Header>
						<Segment attached padded raised textAlign='left' color='olive'>
							SH Token Placeholder
						</Segment>
					</Grid.Column>
					<Grid.Column width={8}>
						<Header as='h2' attached textAlign='right'>
							Total voting power
                    </Header>
						<Segment attached padded raised textAlign='right' color='olive'>
							78
                    </Segment>
					</Grid.Column>
				</Grid.Row>

				<Grid.Row>
					<Grid.Column width={8}>
						<Header as='h2' attached textAlign='center'>
							Voting Power
                    </Header>
						<Segment attached padded color='olive'>
							<Grid>
								<Grid.Row>
									<Grid.Column width={8}>
										FoW
                                </Grid.Column>
									<Grid.Column width={4}>
										VP
                                </Grid.Column>
									<Grid.Column width={4}>
										VRT
                                </Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={8}>
										<Icon name='bar chart' />
										Organisational
                                </Grid.Column>
									<Grid.Column width={4}>
										16/1000
                                </Grid.Column>
									<Grid.Column width={4}>
										1
                                </Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={8}>
										<Icon name='bicycle' />
										Product
                                </Grid.Column>
									<Grid.Column width={4}>
										100/1000
                                </Grid.Column>
									<Grid.Column width={4}>
										120
                                </Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={8}>
										<Icon name='money' />
										Finance
                                </Grid.Column>
									<Grid.Column width={4}>
										5/1000
                                </Grid.Column>
									<Grid.Column width={4}>
										0
                                </Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={8}>
										<Icon name='suitcase' />
										Partnership
                                </Grid.Column>
									<Grid.Column width={4}>
										50/1000
                                </Grid.Column>
									<Grid.Column width={4}>
										50
                                </Grid.Column>
								</Grid.Row>
							</Grid>
						</Segment>
					</Grid.Column>
					<Grid.Column width={8}>
						<Header as='h2' attached textAlign='center'>
							Transfer Voting Power
                    </Header>
						<Segment attached padded color='olive'>
							<Grid>
								<Grid.Row>
									<Grid.Column width={7}>
										<Checkbox label='Organisational' />
									</Grid.Column>
									<Grid.Column width={8}>
										<Input name="foo" type="text" placeholder="address" class="prompt" autoComplete="on" style={{ width: '200px' }} />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={7}>
										<Checkbox label='Product' />
									</Grid.Column>
									<Grid.Column width={8}>
										<Input name="foo" type="text" placeholder="address" class="prompt" autoComplete="on" style={{ width: '200px' }} />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={7}>
										<Checkbox label='Finance' />
									</Grid.Column>
									<Grid.Column width={8}>
										<Input name="foo" type="text" placeholder="address" class="prompt" autoComplete="on" style={{ width: '200px' }} />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={7}>
										<Checkbox label='Partnership' />
									</Grid.Column>
									<Grid.Column width={8}>
										<Input name="foo" type="text" placeholder="address" class="prompt" autoComplete="on" style={{ width: '200px' }} />
									</Grid.Column>
								</Grid.Row>
								<Grid.Row style={{ marginBottom: '0' }}>
									<Button color='teal' style={{ width: '100%' }} onClick={this.onClick}>Transfer Power</Button>
								</Grid.Row>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}

DetailsSection.propTypes = {
	details: PropTypes.object.isRequired,
	priceDevelopmentString: PropTypes.string.isRequired,
	timeCountDown: PropTypes.string.isRequired,
	currentPercentage: PropTypes.number.isRequired,
	status: PropTypes.string.isRequired,
	setSupplyInterval: PropTypes.func.isRequired,
	listenForTokenBuy: PropTypes.func.isRequired
}

export default DetailsSection;