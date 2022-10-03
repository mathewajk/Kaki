import styles from '../styles/Home.module.css'
import Pitch from "../components/pitch";
import 'underscore'

import React, { useState, useCallback, useEffect } from "react";
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

function Learn() {
    
    const { data, loading, error } = useQuery(VOCAB_QUERY);
    
    if (loading) return "Loading...";
    if (error)   return <pre>{error.message}</pre>;

    return(
        <main className={styles.content}>
            <StudyCard words={data.words}/>
        </main>
    );
}

function getRandomWord(words) {
    let rand = Math.floor(Math.random() * words.length);
    return words[rand];
}

const StudyCard = (props) => {

    const [randomWord, setRandomWord] = useState(getRandomWord(props.words));

    return(
        <section className={styles.studyCard}>
            <StudyItem word={randomWord} words={props.words} setRandomWord={setRandomWord}/>
        </section>
    )
}

const StudyItem = (props) => {

    return(
        <div className={styles.studyItem}>
            <p>正しい発音を選択しなさい。</p>
            <h2 className={styles.tango}>{props.word.tango}</h2>
            <ButtonGrid word={props.word} words={props.words} setRandomWord={props.setRandomWord}/>
        </div>
    );
}

function fisherYates(arr) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled;
}

const ButtonGrid = (props) => {

    let [answers, setAnswers]   = useState([]);
    let [answered, setAnswered]   = useState(false);

    if( answers.length == 0 ) {
        let numPitches = props.word.yomi.split('').length + 1;
        let multiChoice = []
        
        for(let i=0; i<numPitches; i++) {
            multiChoice.push({ 
                tango: props.word.tango,
                yomi: props.word.yomi,
                pitch: i,
                correct: (i == props.word.pitch ? true : false)
            });
        }
        multiChoice = fisherYates(multiChoice);
        if(multiChoice.length > 4) {
            multiChoice = multiChoice.slice(0, 4);
        }
        setAnswers(multiChoice);
    }

    return(
        <div className={styles.buttonGrid}>
            {answers.map((option) => 
            <AnswerButton word={option} answered={answered} setAnswered={setAnswered} setAnswers={setAnswers} words={props.words} setRandomWord={props.setRandomWord}/>)}
        </div>
    );

}

const AnswerButton = (props) => {
    let [status, setStatus] = useState('');

    if(props.answered && status == '') {
        if(props.word.correct) {
            setStatus('correct');
        }
    }

    return (
        <button className={styles[status]} onClick={e => {
            e.preventDefault();
            if(!props.answered) {
                props.setAnswered(true);
            }
            if(!props.word.correct) {
                setStatus('incorrect');
            }
            setTimeout(() => {
                props.setRandomWord(getRandomWord(props.words));
                props.setAnswered(false);
                props.setAnswers([]);
            }, 5000);
        }}>
        <Pitch word={props.word} /></button>
    );
}

export default Learn;