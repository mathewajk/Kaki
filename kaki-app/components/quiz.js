import styles from '../styles/Learn.module.css'
import Pitch from "../components/pitch";
import Categories from './categories';

import React, { useEffect, useState } from "react";

import { handleStudyItems, handleWords, getNextWord } from "../src/quizhelpers"
import { useMutation, gql } from "@apollo/client";

const UPDATE_STUDY_ITEM = gql`
mutation UpdateStudyItem($username: String!, $id: Int!, $due: String!) {
    updateStudyItem(username: $username, id: $id, due: $due) {
        ok
    }
}`

const Quiz = ( { lang, user, setCategory, queries, mutations }) => {
    
    const [ answerState, setAnswerState ] = useState( { clicked: -1, result: '' } );
    const [ visible,     setVisible ]     = useState( false );
    const [ quizState,  setQuizState ]  = useState( {
        username: user?.username, 
        word: null,
        words: [], 
        answerList: []
    });
    
    // Keep track of changes in our study items query and words query
    // If these change, handle any changes to the available words
    useEffect(() => {
        handleStudyItems(quizState, setQuizState, queries)
    }, [queries.items.status]);

    useEffect(() => {
        handleWords(quizState, setQuizState, queries, mutations);
    }, [queries.words.status]);

    // Hide info when the current word advanced
    useEffect(() => {
        setVisible(false)
    }, [quizState.word]);


    // Keyboard-based input for the quiz view
    const handleInput = (e) => {
        
        console.log(e.code);
        
        if(answerState.clicked != -1) {
            if(e.code === 'Enter' || e.code === 'ArrowRight'){
                toNextWord();
            }
        }
    
        if(e.code === 'KeyD') {
            setVisible(!visible);
        }
    
        // Check number input for each possible response
        for(let i=0; i<quizState.answerList.length; i++) {
            if(e.code === `Digit${i+1}`) {
            setAnswerState({clicked: i});
           }
        }
    }

    
    let feedback = (lang === "EN" ? "Correct!" : "正解！");
    if(answerState.result === "incorrect") {
        feedback = (lang === "EN" ? "Too bad!" : "次は頑張ってね！");
    }

    const toNextWord = () => {
        let words = quizState.words;

        // If the user got the word wrong, add it to the end of the queue
        if(answerState.result === 'incorrect') {
            words.unshift(quizState.word);
        }

        // Get next word and update the state
        let state = getNextWord(words);
        state.username = quizState.username;
        setQuizState(state);
        setAnswerState({ clicked: -1, result: ''});
    }

    if(quizState.word == null) {
        return(
            <section className="w-3/4 text-center">
                <div className="text-2xl">
                    <h2 className={styles.tango}>{lang === "EN" ? "Congrats! You finished studying for today!" : "おめでとうございます！今日の学習が終わりました。"}</h2>
                </div>
            </section>
        );
    }

    // Handler for the "show info" button
    function handleClick(e) {
        e.preventDefault();
        setVisible(!visible);
    }

    return(
    <>
        <section tabIndex={0} onKeyDown={handleInput} className="relative flex flex-col basis-full md:basis-3/4 w-full justify-between items-center shadow-md">
            <div className="relative flex flex-col justify-evenly w-full basis-full">
                <div className={(visible ? '' : 'hidden') + " absolute h-full w-full bg-white/50 md:hidden"}/>
                <div className="flex justify-center">
                <h2 className={styles.tango + " my-2 text-7xl md:text-7xl lg:text-7xl mb-2"}>{quizState.word.item.tango}</h2>
                </div>
                <ButtonGrid answerList={quizState.answerList} setAnswerState={setAnswerState} answerState={answerState} quizState={quizState}/>
                <div className="text-center" style={{"visibility": (answerState.clicked == -1 ? "hidden" : "visible")} }>
                    <button type="button" className="my-2" onClick={() => toNextWord()}>{feedback} →</button>
                </div>       
            </div>
            <div className="flex w-full justify-between md:justify-end items-end pb-2">
                    <button onClick={handleClick} className="text-white text-sm block md:hidden rounded-md bg-gray-400 p-3 ml-4">{visible ? "Hide info" : "Show info"}</button>
                    <Categories setCategory={setCategory} displayStyle={"menu"}/>
            </div>
        </section>
        <Definition word={quizState.word.item} answerState={answerState} lang={lang} visible={visible} setVisible={setVisible}/>
    </> 
    );
}

const Definition = ( { word, answerState, lang, visible, setVisible } ) => {
    

    function handleClick(e) {
        e.preventDefault();
        setVisible(!visible);
    }

    let text = "";
    if(!visible) {
        text = lang === 'EN' ? "Show word details" : "詳細を表示する";
    }
 
    return(
        <div className={(visible ? '' : "hidden") + " rounded-md w-3/4 h-1/2 shadow-lg absolute md:shadow-none md:relative md:block bg-gray-200 dark:bg-gray-900 dark:border-gray-600 md:basis-1/4 border-t-4 border-gray-200 md:w-full"}>
            <div className="overflow-scroll h-full">
                {! visible && (<div onClick={handleClick} className="text-gray-900 dark:text-gray-200 hover:cursor-pointer hover:text-orange-500 flex w-full h-full items-center justify-center">
                    <button className="font-normal bg-transparent hover:bg-transparent hover:text-orange-500 shadow-none" onClick={handleClick}>{text}</button>
                    </div>)}
                {visible && (
                <div style={{visibility: (visible ? "visible" : "hidden")}} className="flex flex-col items-center align-center md:flex-row h-full">
                    <div className="flex border-b-2 md:border-b-0 md:border-r-2 border-gray-400 w-1/2 md:w-1/4 justify-center items-center text-center px-1">
                        <div className="mt-2">
                            <p className="text-orange-700 dark:text-orange-500 text-5xl md:text-2xl mb-3">{word.tango}</p>
                            {answerState.clicked != -1 && (<p className="text-lg font-normal text-black dark:text-white"><Pitch word={word}/></p>)}
                            {answerState.clicked == -1 && (<p className="text-lg font-normal text-black dark:text-white">{word.yomi}</p>)}
                        </div>
                    </div>
                    <div className="text-lg font-normal text-black dark:text-white w-3/4 p-4">
                        <p className="text-base text-italic text-gray-700 dark:text-gray-100 ">{word.pos}</p>
                        <p>{word.definition}</p>
                    </div>
                </div>)}
            </div>
        </div>
    );
}

const ButtonGrid = ( { answerList, setAnswerState, answerState, quizState } ) => {

    
    const [ mutateStudyItem, mutationStatus ] = useMutation(UPDATE_STUDY_ITEM);

    const toNextWord = ( result, i ) => {
        
        setAnswerState({ clicked: i, result: result });
       
        if(quizState.username) {
                 
            let due = new Date(Date.now() + 86400000 * parseInt(quizState.word.interval)).toISOString();
            let interval = parseInt(quizState.word.interval) * parseInt(quizState.word.easingFactor);
            
            if(result == "incorrect") {
                interval = 1;
                due = new Date(Date.now()).toISOString();
            }

            console.log({
                variables: {
                username: quizState.username, 
                id: parseInt(quizState.word.id), 
                due: due,
                interval: interval
            }});

            // mutateStudyItem({
            //     variables: {
            //         username: quizState.username, 
            //         id: parseInt(quizState.word.id), 
            //         due: due,
            //         interval: interval
            //     }
            // });
        }
    }

    return(
        <div className="flex w-full justify-center">
            <div className={styles.buttonGrid}>
                {answerList.map((option, i) =>             
                <AnswerButton key={"button" + i} i={i} answerState={answerState} option={option} toNextWord={toNextWord}/>)}
            </div>
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
        <button disabled={ (answerState.clicked != -1 ? true : false) } className={styles[feedback]} onClick={handleClick}>
            <Pitch word={option} />
        </button>
    );
}

export default Quiz;