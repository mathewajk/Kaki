import logo from './logo.svg';
import './App.css';

import React, { Component } from "react";
import Modal from "./Components/Modal";
import axios from 'axios';

class App extends Component {

  constructor(properties) {
    
    super(properties);

    this.state = {

      viewLearned: false,

      activeItem: {
        tango: "",
        yomi: "",
        pitch: ""
      }, 
      wordList: []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/tango/")
      .then(res => this.setState({ wordList: res.data }))
      .catch(err => console.log(err));
  };

  displayCompleted = status => {
    if (status) {
      return this.setState({ viewLearned: true });
    }
    return this.setState({ viewLearned: false });
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
      <span
        onClick={() => this.displayCompleted(true)}
        className={this.state.viewLearned ? "active" : ""}
      >
        Complete
          </span>
      <span
        onClick={() => this.displayCompleted(false)}
        className={this.state.viewLearned ? "" : "active"}
      >
        Incomplete
          </span>
    </div>
    );
  };

  renderItems = () => {
    const { viewLearned } = this.state;
    const newWords = this.state.wordList.filter(
      (item) => item.learned === viewLearned
    );

    return newWords.map((item) => (
      <li
      key={item.id}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      <span
        className={`todo-title mr-2 ${
          this.state.viewLearned ? "completed-todo" : ""
        }`}
        title={item.tango}
      >
        {item.tango} {item.yomi} {item.pitch}
      </span>
      <span>
        <button
          onClick={() => this.editItem(item)}
          className="btn btn-secondary mr-2"
        >
          編集
        </button>
        <button
          onClick={() => this.handleDelete(item)}
          className="btn btn-danger"
        >
          削除
        </button>
      </span>
    </li>
    ));
  };

  toggle = () => {
    //add this after modal creation
    this.setState({ modal: !this.state.modal });
  };
  handleSubmit = (item) => {
    this.toggle();
    alert("save" + JSON.stringify(item));
  };
  
  // Submit an item
  handleSubmit = (item) => {
    this.toggle();
    if (item.id) {
      // if old post to edit and submit
      axios
        .put(`http://localhost:8000/api/tango/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    // if new post to submit
    axios
      .post("http://localhost:8000/api/tango/", item)
      .then((res) => this.refreshList());
  };
  
  // Delete item
  handleDelete = (item) => {
    axios
      .delete(`http://localhost:8000/api/tango/${item.id}/`)
      .then((res) => this.refreshList());
  };
  handleDelete = (item) => {
    alert("delete" + JSON.stringify(item));
  };
  
  // Create item
  createItem = () => {
    const item = { tango: "", yomi: "", pitch: "", learned: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  
  //Edit item
  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  
  // Start by visual effects to viewer
  render() {
    return (
      <main className="content">
        <h1 className="text-success text-uppercase text-center my-4">
          GFG Task Manager
        </h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-info">
                  単語を追加する
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  };
}

export default App;
