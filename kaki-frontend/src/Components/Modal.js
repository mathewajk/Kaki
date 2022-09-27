import React, { Component } from "react";
 
// importing all of these classes from reactstrap module
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
 
// build a class base component
class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem
    };
  }
  // changes handler to check if a checkbox is checed or not
  handleChange = e => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
  };
 
  // rendering modal in the custommodal class received toggle and on save as props,
  render() {
    const { toggle, onSave } = this.props;
    return (
      <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}> Task Item </ModalHeader>
        <ModalBody>
         
          <Form>
 
            {/* 3 formgroups
            1 title label */}
            <FormGroup>
              <Label for="title">単語</Label>
              <Input
                type="text"
                name="title"
                value={this.state.activeItem.tango}
                onChange={this.handleChange}
                placeholder="単語を入力してください"
              />
            </FormGroup>
 
            {/* 2 description label */}
            <FormGroup>
              <Label for="description">読み</Label>
              <Input
                type="text"
                name="yomi"
                value={this.state.activeItem.yomi}
                onChange={this.handleChange}
                placeholder="単語の読みを入力してください"
              />
            </FormGroup>
 
            {/* 2 description label */}
            <FormGroup>
              <Label for="description">Pitch</Label>
              <Input
                type="text"
                name="pitch"
                value={this.state.activeItem.pitch}
                onChange={this.handleChange}
                placeholder="Pitch number"
              />
            </FormGroup>

            <FormGroup check>
              <Label for="learned">
                <Input
                  type="checkbox"
                  name="learned"
                  checked={this.state.activeItem.learned}
                  onChange={this.handleChange}
                />
                Completed
              </Label>
            </FormGroup>

          </Form>
        </ModalBody>
        {/* create a modal footer */}
        <ModalFooter>
        <button color="success" onClick={() => onSave(this.state.activeItem)}>
            Save
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default CustomModal