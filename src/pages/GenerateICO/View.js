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
        <HeaderSection text="GENERATE YOUR OWN ICO" />
        <Button onClick={handleShow}>Create an ICO</Button>
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