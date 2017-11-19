import React, {Component} from 'react';

import {
    Button,
    Dimmer,
    Segment,
    Icon,
    Header,
    Container,
    Modal
} from 'semantic-ui-react';
import StepZilla from 'react-stepzilla';

import HeaderSection from 'components/Header';

import './main.css';

/*const GenerateICO = ({
    handleShow, handleHide, active, steps
}) => (*/

class GenerateICO extends Component {


  constructor(props) {
    super(props);


    this.state = {
      steps: this.props.steps,
      handleShow: this.props.handleShow,
      handleHide: this.pops.handleHide,
      active: this.props.active,
      open: false
    }
  }

  state = {}


  closeConfigShow = (closeOnRootNodeClick) => () => {
    this.setState({closeOnRootNodeClick, open: true})
  }


  //close = () => this.setState(open: false);

  render() {

    const { open, closeOnRootNodeClick } = this.state

    return(

      <div>
          <HeaderSection text="GENERATE YOUR OWN SMART CONTRACTS" />
          <Button onClick={this.state.handleShow} color='teal'>Create an ICO</Button>
          <Dimmer
              page
              active={this.state.active}
          >
              <Container
                  style={{ width: '700px', position: 'relative' }}
              >
                  <Button
                      onClick={this.state.handleHide}
                      icon='close'
                      floated='right'
                      basic
                      circular
                  />
                  <div
                      className='step-progress'
                      style={{ width: '600px', marginLeft: '3.3em' }}
                  >
                    <Modal open={this.state.open}
                           closeOnRootNodeClick={closeOnRootNodeClick}
                           onClose={this.close}
                    >

                      <Modal.Header>
                        Create an ICO
                      </Modal.Header>
                      <Modal.Content>
                        <StepZilla
                            steps={this.state.steps}
                            nextButtonCls="ui positive button"
                            backButtonCls="ui positive button"
                        />
                      </Modal.Content>
                    </Modal>
                  </div>
              </Container>
          </Dimmer>
      </div>
    )
  }
//)
}

export default GenerateICO;
