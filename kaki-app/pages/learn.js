import styles from '../styles/Learn.module.css'
import Pitch from "../components/pitch";
import 'underscore'

import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// Stipulate user for now
const userId = 1


// States: List of words, answer the user has chosen

const VOCAB_QUERY = gql`
query StudyItemsByUser($userId: Int!) {
    studyItemsByUser(userId: $userId) {
        priority
        item {
            tango
            yomi
            pitch
        }
    }
}`

/* Things to look into: Children, context, redux? */

function getRandomWord(words) {
    return words.pop().item;
}

function Learn() {

    const { data, loading, error } = useQuery(VOCAB_QUERY, {
        variables: {userId}
    });

    const [currentWord, setCurrentWord] = useState(null);

    if (loading) return "Loading...";
    if (error)   return <pre>{error.message}</pre>;
    
    let words = fisherYates(data.studyItemsByUser);

    if (currentWord == null) {
        setCurrentWord(getRandomWord(words));
    }

    let answerList = [];
    if(currentWord) {
        let morae = getMorae(currentWord.yomi);
    
        let multiChoice = [];
        let correctAnswer;

        for(let i=0; i < morae.length+1; i++) {
            let answer = { 
                tango: currentWord.tango,
                yomi: currentWord.yomi,
                pitch: i,
                correct: (i == currentWord.pitch ? true : false)
            };

            if( i != currentWord.pitch) {
                multiChoice.push(answer);
            } else {
                correctAnswer = answer;
            }
        }

        multiChoice = fisherYates(multiChoice).filter((word) => {
            if(word.pitch != 0 && ["っ","ー"].includes(word.yomi[word.pitch-1])) {
                return false;
            }
            return true;
        });

        if(multiChoice.length > 3) {
            multiChoice = multiChoice.slice(0, 3);
        }
        multiChoice.push(correctAnswer);
        answerList = multiChoice;
    }


    return(
        <main className={styles.content}>
            <section className={styles.studyCard}>
                <div className={styles.studyItem}>
                    <p>正しい発音を選択しなさい。</p>
                    <h2 className={styles.tango}>{currentWord?.tango}</h2>
                    <ButtonGrid currentWord={currentWord} wordList={words} answerList={answerList} setCurrentWord={setCurrentWord} />
                </div>
            </section>
        </main>
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

// TODO: Currently duplicated in pitch.js
const getMorae = (word) => {
    
    let chars = word.split('');
    let morae = [];
    let currentMora = chars.shift();
  
    for(let i in chars) {
        if(['ゃ','ゅ','ょ'].includes(chars[i])) {
            currentMora += chars[i];
        } else {
            morae.push(currentMora);
            currentMora = chars[i];
        }
    }
    morae.push(currentMora);
    return morae;
}

const ButtonGrid = ( {currentWord, wordList, answerList, setCurrentWord} ) => {

    const [answered,   setAnswered]   = useState(false);

    return(
        <div className={styles.buttonGrid}>
            {answerList.map((option, i) =>             
            <AnswerButton key={"button" + i} answered={answered} word={option} words={wordList} setRandomWord={setCurrentWord} setAnswered={setAnswered}/>)}
        </div>
    );

}

const AnswerButton = ( { word, words, answered, setRandomWord, setAnswered } ) => {
    const [status, setStatus] = useState('');

    if(answered && status == '') {
        if(word.correct) {
            setStatus('correct');
        }
    }

    function handleClick(e) {
        e.preventDefault();
        
        if(!answered) {
            setAnswered(true);
        }

        if(!word.correct) {
            setStatus('incorrect');
        }

        setTimeout(() => {
            setRandomWord(getRandomWord(words));
            setAnswered(false);
            setStatus('');
        }, 3000);
    }

    return (
        <button disabled={answered} className={styles[status]} onClick={handleClick}>
            <Pitch word={word} />
        </button>
    );
}

export default Learn;