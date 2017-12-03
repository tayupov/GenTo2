import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {Grid, Icon, Button} from 'semantic-ui-react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css






class DaoSettings extends Component {

    submit = () => {
        confirmAlert({
            title: 'Confirm to submit changes',                        // Title dialog
            message: 'Before the changes will be applied, a voting will be held',               // Message dialog
            confirmLabel: 'Confirm',                           // Text button confirm
            cancelLabel: 'Cancel',                             // Text button cancel
            onConfirm: () => {return true},    // Action after Confirm
        })
    };
    render() {
        return(
            <div>
                <h2>Dao Settings</h2>
                <Grid>
                    <Grid.Row>
                        <h2>Field of works</h2>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            Field of work
                        </Grid.Column>
                        <Grid.Column width={4}>
                            voting points per vote
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            Organisational
                        </Grid.Column>
                        <Grid.Column width={4}>
                            10
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Icon name="remove" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            Product
                        </Grid.Column>
                        <Grid.Column width={4}>
                            40
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Icon name="remove" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            Finance
                        </Grid.Column>
                        <Grid.Column width={4}>
                            30
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Icon name="remove" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            Marketing
                        </Grid.Column>
                        <Grid.Column width={4}>
                            10
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Icon name="remove" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Button><Icon name="add" />Add</Button>
                        <Button onClick={this.submit}><Icon name="save" />Save</Button>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default DaoSettings;