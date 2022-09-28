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
    <section className="wordList">
      {data.words.map((word) => (
        <article className="wordCard" key={word.id} data-learned={word.learned}>
          <h2 className="tango">{word.tango}</h2>
          <p style={{"--pitch": word.pitch}}>
            {word.yomi.split('').map((mora, i) => {
              if(i == 0) {
                if(word.pitch == 1)
                  return <span className="mora" key={mora} data-pitch="peak">{mora}</span>
              }
              else {
                if (word.pitch == 0)
                  return <span className="mora" key={mora} data-pitch="high">{mora}</span>
                if(i < word.pitch - 1)
                  return <span data-pitch="high">{mora}</span>
                else if (i == word.pitch - 1)
                  return <span className="mora" key={mora} data-pitch="peak">{mora}</span>
              }
              return <span className="mora" key={mora} data-pitch="low">{mora}</span>
            })}
          <span className="sr-only"> - Pitch accent: {word.pitch}</span></p>
          <UpdateWord word={word}/><DeleteWord word={word}/>
        </article>
      ))}
    </section>
  );
};

const DeleteWord = (props) => {

  const [deleteWord] = useMutation(DELETE_WORD);
  
  return(<button className="deleteWord" onClick={e => {
    e.preventDefault();
    let id = parseInt(props.word.id);
    deleteWord({variables: {id: id}, refetchQueries: [ { query: VOCAB_QUERY}]})
  }}>
    <svg width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 5h4a2 2 0 1 0-4 0ZM8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5H8.5Zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5ZM14.25 9a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75Z"></path></svg>
    削除
    </button>
  );
}

const UpdateWord = (props) => {

  const [updateWord] = useMutation(UPDATE_WORD);
  
  return(
  <label className="learned"><div className="sr-only">学習済み<input type="checkbox" onChange={e => {
    e.preventDefault();
    let id = parseInt(props.word.id);
    updateWord({variables: {id: id, tango: props.word.tango, yomi: props.word.yomi, pitch: props.word.pitch, learned: !props.word.learned}, refetchQueries: [ { query: VOCAB_QUERY}]})
  }} checked={props.word.learned} ></input></div></label>
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
        pitch.value = '';

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

export default App;
