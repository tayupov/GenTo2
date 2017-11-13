import React from 'react';

import { 
    Button,
    Dimmer,
    Segment,
    Icon,
    Header,
    Container 
} from 'semantic-ui-react';
import StepZilla from 'react-stepzilla';

import HeaderSection from 'components/Header';

import './main.css';

const View = ({
    handleShow, handleHide, active, steps
}) => (
    // <MultiStep />
    <div>
        <HeaderSection text="GENERATE YOUR OWN SMART CONTRACTS" />
        <Button onClick={handleShow} color='teal'>Create an ICO</Button>
        <br />
        <br />
        <Button color='teal'>Create a DAO</Button>
        <Dimmer
            page
            inverted
            active={active}
        >
            <Container
                style={{ width: '700px', position: 'relative' }}
            >
                <Button
                    onClick={handleHide}
                    icon='close'
                    floated='right'
                    basic
                    circular 
                />
                <div
                    className='step-progress'
                    style={{ width: '600px', marginLeft: '3.3em' }}
                >
                    <StepZilla
                        steps={steps}
                        nextButtonCls="ui positive button"
                        backButtonCls="ui positive button"
                    />
                </div>
            </Container>
        </Dimmer>
    </div>
)

export default View;