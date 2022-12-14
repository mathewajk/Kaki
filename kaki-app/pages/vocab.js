import styles from '../styles/Home.module.css'

import React, { useState, useEffect } from "react";
import Pitch from "../components/pitch";

import { useQuery, useMutation, gql } from "@apollo/client";
import { Dialog } from '@headlessui/react'

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

function VocabList() {
  return (
    <div className="flex h-full justify-center items-center">
      <div>Coming soon!</div>
      {/* <div className="">
          <CreateWord/>
      </div>
      <h1>
      単語表
      </h1>
      <hr/>
      <WordList/> */}
    </div>
  );
};

const WordList = () => {
  
  const { data, loading, error } = useQuery(VOCAB_QUERY);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);

  const [selectedWord, setSelectedWord] = useState('');

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>;

  return (
    <section className={styles.wordList}>
      {data.words.map((word) => (
        <article className={styles.wordCard} key={word.id} data-learned={word.learned}>
          <h2 className={styles.tango}>{word.tango}</h2>
          <Pitch word={word}/>
          <LearnWord word={word}/>
          <UpdateWordButton word={word} setSelectedWord={setSelectedWord} setIsOpen={setIsEditOpen}/>
          <DeleteWordButton word={word} setSelectedWord={setSelectedWord} setIsOpen={setIsDeleteOpen}/>
        </article>
      ))}
      <UpdateWordDialogue word={selectedWord} isOpen={isEditOpen}   setIsOpen={setIsEditOpen}/>
      <DeleteWordDialogue word={selectedWord} isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen}/>
    </section>
  );
};

const DeleteWordButton = (props) => {
  return(
      <button className={styles.deleteWord} onClick={e => {
        e.preventDefault();
        props.setIsOpen(true);
        props.setSelectedWord(props.word);
      }}>
      <svg width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 5h4a2 2 0 1 0-4 0ZM8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5H8.5Zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5ZM14.25 9a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75Z"></path></svg> 削除
      </button>
  );
}

const DeleteWordDialogue = (props) => {
  
  const [deleteWord] = useMutation(DELETE_WORD);

  return(<Dialog className={styles.editWord} open={props.isOpen} onClose={() => props.setIsOpen(false)}>
        <div>
          <Dialog.Panel className={styles.dialogPanel}>
            
            <Dialog.Description className={styles['sr-only']}><h3>単語を削除中</h3></Dialog.Description>  
            <Dialog.Title></Dialog.Title>
            <p>「<span style={{color: 'orangered'}}>{props.word.tango}</span>」をこのリストから削除してもよろしいですか？</p>
            <button className={styles.deleteWord} onClick={e => {
              e.preventDefault();
              let id = parseInt(props.word.id);
              deleteWord({variables: {id: id}, refetchQueries: [ { query: VOCAB_QUERY}]});
              props.setIsOpen(false);
            }}>
            <svg width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10 5h4a2 2 0 1 0-4 0ZM8.5 5a3.5 3.5 0 1 1 7 0h5.75a.75.75 0 0 1 0 1.5h-1.32l-1.17 12.111A3.75 3.75 0 0 1 15.026 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5H8.5Zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5ZM14.25 9a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75Z"></path></svg> 削除
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
  );
}

const UpdateWordButton = (props, yomi, pitch) => {
  const [updateWord] = useMutation(UPDATE_WORD);

  return (
   <button className={styles.editWord} onClick={e => {
      props.setIsOpen(true);
      props.setSelectedWord(props.word);
    }}>
     <svg width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 22q-.825 0-1.412-.587Q4 20.825 4 20V4q0-.825.588-1.413Q5.175 2 6 2h8l6 6v4h-2V9h-5V4H6v16h6v2Zm0-2V4v16Zm12.3-5.475l1.075 1.075l-3.875 3.85v1.05h1.05l3.875-3.85l1.05 1.05l-4.3 4.3H14v-3.175Zm3.175 3.175L18.3 14.525l1.45-1.45q.275-.275.7-.275q.425 0 .7.275l1.775 1.775q.275.275.275.7q0 .425-.275.7Z"></path></svg> 編集</button>
  );
}

const UpdateWordDialogue = (props, yomi, pitch) => {
  const [updateWord] = useMutation(UPDATE_WORD);

  return (
    <Dialog className={styles.editWord} open={props.isOpen} onClose={() => props.setIsOpen(false)}>
    <div>
    <Dialog.Panel className={styles.dialogPanel}>
      
      <Dialog.Description className={styles['sr-only']}><h3>単語を編集中</h3></Dialog.Description>  
      <Dialog.Title><h2 className={styles.tango}>{props.word.tango}</h2></Dialog.Title>
      <Pitch word={props.word}/>
        <form
          onSubmit={e => {
            
            e.preventDefault();

            updateWord({ variables: {
              id: parseInt(props.word.id),
              tango: props.word.tango,
              yomi: yomi.value,
              pitch: parseInt(pitch.value),
              learned: props.word.learned
            },
            refetchQueries: [{ query: VOCAB_QUERY }]

          });

          yomi.value = props.word.yomi;
          pitch.value = props.word.pitch;
          props.setIsOpen(false);
        }}
      > 
    
      <p><label><b>読み　</b></label>
      <input
        defaultValue={props.word.yomi} 
        ref={node => {
          yomi = node;
        }}
        style={{ marginRight: '1em' }}
      /></p>

      <p><label><b>アクセント　</b></label>
      <input
        type="text"
        defaultValue={props.word.pitch} 
        ref={node => {
          pitch = node;
        }}
        style={{ marginRight: '1em' }} 
        /></p>
      
      <button type="submit" style={{ cursor: 'pointer' }}>更新</button>
      </form>
      </Dialog.Panel>
      </div>
  </Dialog>
  );
}

const LearnWord = (props) => {

  const [updateWord] = useMutation(UPDATE_WORD);
  
  return(
  <label className={styles.learned}><div className={styles["sr-only"]}>学習済み<input type="checkbox" onChange={e => {
    e.preventDefault();
    let id = parseInt(props.word.id);
    updateWord({variables: {
      id: id, 
      tango: props.word.tango, 
      yomi: props.word.yomi, 
      pitch: props.word.pitch, 
      learned: !props.word.learned
    }, refetchQueries: [ { query: VOCAB_QUERY}]})
  }} checked={props.word.learned} ></input></div></label>
  );
}

const CreateWord = (tango, yomi, pitch) => {
  
  const [createWord] = useMutation(CREATE_WORD);

  return (
    <div className={styles.createWord}>
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

export default VocabList;
