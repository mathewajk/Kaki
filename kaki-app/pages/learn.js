import styles from '../styles/Learn.module.css'
import Pitch from "../components/pitch";
import 'underscore'

import React, { useState } from "react";
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

function getNextWord(words) {
    let word = words.pop();
    console.log("Got word " + word?.item?.tango);
    return { word: word?.item, words: words};
}

function generateAnswers(word) {
   
    let morae = getMorae(word.yomi);
    let answers = [];
    let correctAnswer = {};

    for(let i=0; i < morae.length+1; i++) {
        let answer = { 
            yomi: word.yomi,
            pitch: i,
            correct: (i == word.pitch ? true : false)
        };
        if( i != word.pitch) {
            answers.push(answer);
        } else {
            correctAnswer = answer;
        }
    }

    answers = fisherYates(answers).filter((word) => {
        let pitchedMora = word.yomi[word.pitch-1];
        let invalidMorae = ["っ", "ー"];
        return (word.pitch == 0 || !invalidMorae.includes(pitchedMora));
    });

    answers = answers.length > 3 ? answers.slice(0, 3) : answers;
    
    let randIdx = Math.floor(Math.random() * answers.length);
    answers.splice(randIdx, 0, correctAnswer);
    
    return answers;
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

function Learn() {

    const { data, loading, error } = useQuery(VOCAB_QUERY, {
        variables: {userId}
    });

    if (loading) return "Loading...";
    if (error)   return <pre>{error.message}</pre>;
    
    console.log("rendering");
    console.log(data);
    
    // Shuffle currently-due words. TODO: Will need to shuffle according to time due?
    let wordList = fisherYates(data.studyItemsByUser);
    let initialState = getNextWord(wordList);

    return(
        <main className={styles.content}>
            <StudyCard currentWord={initialState.word} wordList={initialState.words}/>
        </main>
    );
}

const StudyCard = ( { currentWord, wordList }) => {

    const [studyState, setStudyState] = useState({word: currentWord, words: wordList});
    
    if(studyState.word == null && studyState.words.length == 0) {
        return(
            <section className={styles.studyCard}>
                <div className={styles.studyItem}>
                    <h2 className={styles.tango}>おめでとうございます！</h2>
                    <h2 className={styles.tango}>今日の学習が終わりました。</h2>
                </div>
            </section>
        );
    }

    let answerList = [];
    if (studyState.word != null) {
        answerList = generateAnswers(studyState.word);
    }

    return(
        <section className={styles.studyCard}>
            <div className={styles.studyItem}>
                <p>正しい発音を選択しなさい。</p>
                <h2 className={styles.tango}>{studyState.word?.tango}</h2>
                {<ButtonGrid currentWord={studyState.word} wordList={wordList} answerList={answerList} setCurrentWord={setStudyState} />}
            </div>
        </section>
    );
}

const ButtonGrid = ( { wordList, answerList, setCurrentWord } ) => {

    const [answerState, setAnswerState] = useState('');

    const toNextWord = ( result ) => {
        setAnswerState(result);
        setTimeout(() => {
            setCurrentWord(getNextWord(wordList));
            setAnswerState('');
        }, 1000);
    }

    let feedback = (answerState == "correct" ? "正解！" : "次は頑張ってね！");
    return(
        <div className={styles.response}>
            <p style={{"visibility": (answerState == '' ? "hidden" : "visible")} }>
                {feedback}
            </p>
            <div className={styles.buttonGrid}>
                {answerList.map((option, i) =>             
                <AnswerButton key={"button" + i} answerState={answerState} option={option} toNextWord={toNextWord}/>)}
            </div>
        </div>
    );

}

const AnswerButton = ( { option, answerState, toNextWord } ) => {
    
    let feedback = '';
    if(answerState && option.correct) {
        feedback = "correct";
    }   
    else if(!answerState && feedback != '') {
        feedback = '';
    }

    const handleClick = (e) => {
        e.preventDefault;
        let result = "correct";
        if(!option.correct) {
            result = "incorrect"
        }
        toNextWord(result);
    }

    return (
        <button disabled={ (answerState != '' ? true : false) } className={styles[feedback]} onClick={handleClick}>
            <Pitch word={option} />
        </button>
    );
}

export default Learn;