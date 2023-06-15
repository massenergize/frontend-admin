import React from 'react';
import { PapperBlock } from 'dan-components';
import CreateTaskForm from './CreateTaskForm';


class CreateTask extends React.Component {
    render() {
        return (
            <div>
                <PapperBlock title="Tasks" desc="">
                    <CreateTaskForm />
                </PapperBlock>
            </div>
        );
    }
}

export default CreateTask;
