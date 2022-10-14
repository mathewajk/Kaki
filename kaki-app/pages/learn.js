import styles from '../styles/Learn.module.css'
import Pitch from "../components/pitch";
import 'underscore'

import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { map } from 'underscore';

// Stipulate user for now
const userId = 1;
const category = "";


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

const VOCAB_QUERY_LEVEL = gql`
query VocabByLevel($category: String!) {
    vocabByLevel(category: $category) {
        tango
        yomi
        pitch
        definition
    }
}`

/* Things to look into: Children, context, redux? */

function getRandomWord(words) {
    return words.pop();
}

const ChooseCategory = ( { setCategory, displayStyle } ) => {
    const categories = ["N5", "N4", "N3", "N2", "N1"];
    
    if(displayStyle == "menu") {
        return (
        <div className={styles.menuBottom}>
            <div className={styles.categoryGrid}>
        {
            categories.map((category, i) => {
            function handleClick(e) {
                e.preventDefault();
                setCategory(category);
            }
            return <button tag={"catbutton" + i} style={{'background-color': 'rgb(' + (0 + 60 * i) + ', ' + (160 - 20 * i) + ', ' + (180 - 40 * i) + ')'}} onClick={handleClick}>{category}</button>
            })
        }
        </div>
        </div>
        );
    }
    
    return (
        <main className={styles.content}>
            <section className={styles.studyCard}>
                <div className={styles.studyItem}>
                <p>挑戦するレベルを選択してください。</p>
                <div className={styles.categoryGrid}>
                {
                    categories.map((category, i) => {
                    function handleClick(e) {
                        e.preventDefault();
                        setCategory(category);
                    }
                    return <button tag={"catbutton" + i} style={{'background-color': 'rgb(' + (0 + 60 * i) + ', ' + (160 - 20 * i) + ', ' + (180 - 40 * i) + ')'}} onClick={handleClick}>{category}</button>
                    })
                }
                </div>
                </div>
            </section>
        </main>
    );
}

function Learn() {

    const [category, setCategory] = useState('')

    if (category == '') {
        return <ChooseCategory setCategory={setCategory}/>
    }
    else {
        return <StudyPage category={category} setCategory={setCategory}/>
    }
}


function getNextWord(words) {
    let word = words.pop();
    console.log("Got word " + word);
    return { word: word, words: words};
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

function StudyPage( {category, setCategory} ) {

    const { data, loading, error } = useQuery(VOCAB_QUERY_LEVEL, {
        variables: {category}
    });

    if (loading) return "Loading...";
    if (error)   return <pre>{error.message}</pre>;
    
    // Shuffle currently-due words. TODO: Will need to shuffle according to time due?
    let wordList = fisherYates(data.vocabByLevel);
    let initialState = getNextWord(wordList);

    return(
        <main className={styles.content}>
            <ChooseCategory setCategory={setCategory} displayStyle={"menu"}/>
            <StudyCard currentWord={initialState.word} wordList={initialState.words}/>
        </main>
    );
}

const StudyCard = ( { currentWord, wordList }) => {

    const [studyState, setStudyState] = useState({word: currentWord, words: wordList});;

    if(wordList != studyState.words) {
        setStudyState( {word: currentWord, words: wordList});
    }
    
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
                <h2 className={styles.tango}>{studyState.word?.tango}</h2>
                <Definition word={studyState.word} />
                {<ButtonGrid currentWord={studyState.word} wordList={wordList} answerList={answerList} setCurrentWord={setStudyState} />}
            </div>
        </section>
    );
}

const Definition = ( { word } ) => {
    const [visible, setVisible] = useState(false);
    
    function handleClick(e) {
        e.preventDefault();
        setVisible(!visible);
    }

    let text = visible ? "定義を非表示する" : "定義を表示する";
 
    return(
        <div>
            <button onClick={handleClick}>{text}</button>
                <p style={{visibility: (visible ? "visible" : "hidden")}}>{word.definition}</p>
        </div>
    );
}

const ButtonGrid = ( { wordList, answerList, setCurrentWord } ) => {

    const [answerState, setAnswerState] = useState({ clicked: -1, result: ''});

    const toNextWord = ( result, i ) => {
        setAnswerState({ clicked: i, result: result });
        setTimeout(() => {
            setCurrentWord(getNextWord(wordList));
            setAnswerState({ clicked: -1, result: ''});
        }, 1500);
    }

    let feedback = (answerState.result == "correct" ? "正解！" : "次は頑張ってね！");
    return(
        <div className={styles.response}>
            <div className={styles.buttonGrid}>
                {answerList.map((option, i) =>             
                <AnswerButton key={"button" + i} i={i} answerState={answerState} option={option} toNextWord={toNextWord}/>)}
            </div>
            <p style={{"visibility": (answerState.clicked == -1 ? "hidden" : "visible")} }>
                {feedback}
            </p>
        </div>
    );

}

const AnswerButton = ( { i, option, answerState, toNextWord } ) => {
    
    let feedback = '';
    console.log(answerState.clicked);

    if(answerState.clicked >= 0) {
        if (option.correct) {
            feedback = "correct";
        }
        else if (i == answerState.clicked && !option.correct) {
            feedback = "incorrect";
        }
    } 

    const handleClick = (e) => {
        e.preventDefault;
        let result = "correct";
        if(!option.correct) {
            result = "incorrect"
        }
        toNextWord(result, i);
    }

    return (
        <button disabled={ (feedback != '' ? true : false) } className={styles[feedback]} onClick={handleClick}>
            <Pitch word={option} />
        </button>
    );
}

export default Learn;