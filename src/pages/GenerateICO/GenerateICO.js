// import React, {Component} from 'react';

// import {
//     Button,
//     Dimmer,
//     Segment,
//     Icon,
//     Header,
//     Container,
//     Modal
// } from 'semantic-ui-react';
// import StepZilla from 'react-stepzilla';

// import HeaderSection from 'components/Header';

// import './main.css';

// const GenerateICO = ({
//     handleShow, handleHide, active, steps
// }) => (

// /*class GenerateICO extends Component {*/

//   render() {

//     state = {open: false}



//     return(


//       <div>
//           {closeConfigShow = (closeOnRootNodeClick) => () => {
//             this.setState({closeOnRootNodeClick, open: true})
//           }

//           close = () => this.setState(open: false);

//           const { open, closeOnRootNodeClick } = this.state}
//           <HeaderSection text="GENERATE YOUR OWN SMART CONTRACTS" />
//           <Button onClick={this.closeOnRootNodeClick(true, false)} color='teal'>Create an ICO</Button>
//           <Dimmer
//               page
//               active={active}
//           >
//               <Container
//                   style={{ width: '700px', position: 'relative' }}
//               >
//                   <Button
//                       onClick={handleHide}
//                       icon='close'
//                       floated='right'
//                       basic
//                       circular
//                   />
//                   <div
//                       className='step-progress'
//                       style={{ width: '600px', marginLeft: '3.3em' }}
//                   >
//                     <Modal open={open} closeOnRootNodeClick={closeOnRootNodeClick} onClose={this.close}>
//                       <Modal.Header>Create an ICO</Modal.Header>
//                       <Modal.Content>
//                         <StepZilla
//                             steps={steps}
//                             nextButtonCls="ui positive button"
//                             backButtonCls="ui positive button"
//                         />
//                       </Modal.Content>
//                     </Modal>
//                   </div>
//               </Container>
//           </Dimmer>
//       </div>
//     )
//   }
// )
// //}

// export default GenerateICO;
