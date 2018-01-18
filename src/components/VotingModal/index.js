import React from 'react';

import {
    Modal,
    Button,
    Header,
    Icon
} from 'semantic-ui-react';

const proposalModal = ({
    modalOpen,
    modalState,
    modalSubmitted,
    handleClose,
    handleOk,
    header
}) => {

    if (modalSubmitted) {
        return (
            <Modal
                open={modalOpen}
                
                size='small'
            >
                <Header icon='checkmark box' />
                <Modal.Content>
                    {modalState === 'approve' && <h3>You have successfully voted FOR the following proposal:</h3>}
                    {modalState === 'decline' && <h3>You have successfully voted AGAINST the following proposal:</h3>}
                    <h1>{header}</h1>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={handleClose} inverted>
                        Continue
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
    return (
        <Modal
            open={modalOpen}
            size='small'
            closeOnDimmerClick={false}
            closeOnEscape={false}
        >
            <Header icon='browser' content="Proposal" />
            <Modal.Content>
                {modalState === 'approve' && <h3>You are about to vote FOR the following proposal:</h3>}
                {modalState === 'decline' && <h3>You are about to vote AGAINST the following proposal:</h3>}
                <h1>{header}</h1>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' onClick={handleClose} inverted>
                    No
                </Button>
                <Button color='green' onClick={handleOk} inverted>
                    <Icon name='checkmark' /> Ok
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ProposalModal;