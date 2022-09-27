import React, { useState, useCallback } from "react";
import logo from './logo.svg';
import './App.css';

import { useQuery, useMutation, gql } from "@apollo/client";

const VOCAB_QUERY = gql`
{
  words {
    id
    tango
    yomi
    pitch
    learned
  }
}`

const CREATE_WORD = gql`
mutation createWord ($tango: String!, $yomi: String!, $pitch: Int!, $learned: Boolean!) {
  createWord (tango: $tango, yomi: $yomi, pitch: $pitch, learned: $learned) {
    word {
      id
      tango
      yomi
      pitch
      learned
    }
  }
}
`;

const UPDATE_WORD = gql`
mutation updateWord ($id: Int!, $tango: String!, $yomi: String!, $pitch: Int!, $learned: Boolean!) {
  updateWord (id: $id, tango: $tango, yomi: $yomi, pitch: $pitch, learned: $learned) {
    word {
      id
      tango
      yomi
      pitch
      learned
    }
  }
}
`;

const DELETE_WORD = gql`
mutation deleteWord ($id: Int!) {
  deleteWord (id: $id) {
    ok
  }
}
`;

function App() {
  return (
    <main className="content" style={{margin: 50 + 'px'}}>
      <div className="">
          <CreateWord/>
      </div>
      <h1 className="text-success text-uppercase text-center my-4">
      単語表
      </h1>
      <hr/>
      <WordList/>
    </main>
  );
};

const WordList = () => {
  
  const { data, loading, error } = useQuery(VOCAB_QUERY);

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>;

  return (
    <ul className="list-group list-group-flush">
      {data.words.map((word) => (
        <li key={word.id}>{word.tango} {word.yomi} {word.pitch} <span>学習済み</span> <UpdateWord word={word}/> <DeleteWord word={word}/> </li>
      ))}
    </ul>
  );
};

const DeleteWord = (props) => {

  const [deleteWord] = useMutation(DELETE_WORD);
  
  return(<button onClick={e => {
    e.preventDefault();
    let id = parseInt(props.word.id);
    deleteWord({variables: {id: id}, refetchQueries: [ { query: VOCAB_QUERY}]})
  }}>
    削除
    </button>
  );
}

const UpdateWord = (props) => {

  const [updateWord] = useMutation(UPDATE_WORD);
  
  return(
  <input type="checkbox" onChange={e => {
    e.preventDefault();
    let id = parseInt(props.word.id);
    updateWord({variables: {id: id, tango: props.word.tango, yomi: props.word.yomi, pitch: props.word.pitch, learned: !props.word.learned}, refetchQueries: [ { query: VOCAB_QUERY}]})
  }} checked={props.word.learned} ></input>
  );
}

const CreateWord = (tango, yomi, pitch) => {
  
  const [createWord] = useMutation(CREATE_WORD);

  return (
    <div>
      <form
        onSubmit={e => {
          
          e.preventDefault();
         
          createWord({ variables: {
            tango: tango.value,
            yomi: yomi.value,
            pitch: parseInt(pitch.value),
            learned: false
          },
          refetchQueries: [{ query: VOCAB_QUERY }]

        });

        tango.value = '';
        yomi.value = '';
        pitch.value = -1;

      }}

      style = {{ marginTop: '2em', marginBottom: '2em' }}
     > 
     
     <label>単語：</label>
     <input
       ref={node => {
         tango = node;
       }}
       style={{ marginRight: '1em' }}
     />
    
     <label>読み：</label>
     <input
       ref={node => {
         yomi = node;
       }}
       style={{ marginRight: '1em' }}
     />

    <label>アクセント：</label>
    <input
       ref={node => {
         pitch = node;
       }}
       style={{ marginRight: '1em' }}
     />
     
     <button type="submit" style={{ cursor: 'pointer' }}>単語を追加する</button>
     </form>
   </div>
  );}

const DeleteItem = (item) => {
  
};

export default App;
