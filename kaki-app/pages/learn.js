import styles from '../styles/Learn.module.css'
import Pitch from "../components/pitch";
import CategoryPicker from '../components/categorypicker';

import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { useSession } from "next-auth/react";


const CREATE_STUDY_ITEM = gql`
mutation CreateUpdateStudyItem($username: String!, $tangoId: [Int]!, $due: String!) {
    createUpdateStudyItem(username: $username, tangoId: $tangoId, due: $due) {
        ok
        items {
            id
            item {
                tango
                yomi
                pitch
                definition
                pos
            }
            due
            interval
            easingFactor
        }
    }
}`

const UPDATE_STUDY_ITEM = gql`
mutation UpdateStudyItem($username: String!, $id: Int!, $due: String!) {
    updateStudyItem(username: $username, id: $id, due: $due) {
        ok
    }
}`

const QUERY_STUDY_ITEMS = gql`
query StudyItems($username: String, $category: String, $getDue: Boolean) {
    studyItems(username: $username, category: $category, getDue: $getDue) {
        id
        item {
            tango
            yomi
            pitch
            definition
            pos
        }
        due
        interval
        easingFactor
    }
}`

const QUERY_WORDS = gql`
query Words($category: String) {
    words(category: $category) {
        id
        tango
        yomi
        pitch
        definition
        pos
    }
}`

/* Things to look into: Children, context, redux? */

const Loading = ( { lang } ) => {

    const text = {
        "EN": "Loading study session...",
        "JA": "読み込み中..."
    };

    return(
        <section className="w-3/4 text-center">
        <div className="text-2xl">
            <h2 className={styles.tango}>{text[lang]}</h2>
        </div>
        </section>
    );
}

function Learn( { lang } ) {

    const { data: session, status } = useSession();
    const [ category, setCategory ] = useState('');

    return(
        <section className={styles.learn}>
            {status === "loading" && (<Loading lang={lang}/>)}
            {category !== '' && (<QuizWrapper lang={lang} user={session?.user} category={category} setCategory={setCategory}/>)}
            {category === '' && (<CategoryPicker lang={lang} displayStyle={"full"} setCategory={setCategory}/>)}
        </section>
    );
}

const QuizWrapper = ( { lang, user, category, setCategory } ) => {
   
    const [ studyState, setStudyState ] = useState({
        username: user?.username, 
        word: null,
        due: null,
        interval: null,
        easing_factor: null,
        words: [], 
        answerList: []
    });
    
    console.log("Rendering study page.");

    const [ queryStudyItems, studyItemStatus ] = useLazyQuery(QUERY_STUDY_ITEMS, {
        variables: { username: studyState.username, category: category, getDue: true }
    });

    const [ queryWords, wordStatus ] = useLazyQuery(QUERY_WORDS, {
        variables: { category: category }
    });

    const [ createStudyItems, mutationStatus ] = useMutation(CREATE_STUDY_ITEM, {
        refetchQueries: [ 
            {
                query: QUERY_STUDY_ITEMS, 
                variables: { username: studyState.username, category: category, getDue: true }
            },
            'StudyItems'
        ]
      });

    useEffect(() => {
        console.log("Study item data has changed!");
        
        // Don't try to check study items if no one is logged in
        if(!studyState.username) {
            console.log("Querying words...");
            queryWords();
            return;
        }
    
        // Avoid multiple queries?
        if(studyItemStatus.loading) return;

        // If we don't have any data yet, query it
        if(!studyItemStatus.data) {
            console.log("Study item data is null. Querying...");
            queryStudyItems();
            return;
        }
        
        console.log("Got study items: ");
        console.log(studyItemStatus.data.studyItems);
        
        // If there is no study data for this category, create it
        // Otherwise, initialize the study session
        if (studyItemStatus.data.studyItems.length == 0) {
            console.log("Study items are length 0!");
            queryWords();
        } else {
            let state = getNextWord(fisherYates(studyItemStatus.data.studyItems));
            state.username = studyState.username;
            console.log(state);
            setStudyState(state);
        }

    }, [studyItemStatus.data]);

    useEffect(() => {

        console.log("Word data has changed!");

        // Avoid unnecessary queries
        if(wordStatus.loading) return;
        if(studyState.username && (studyItemStatus.loading || studyItemStatus.data == undefined )) return; 
        if(studyState.username && studyItemStatus.data.studyItems.length > 0) return;

        // If we don't have any data yet, query it
        if(! wordStatus.data) {
            console.log("Word data is null. Querying...");
            queryWords();
            return;
        }

        // If we're querying because the user needs to add words, run mutation
        // Otherwise, initialize a non-logged-in study session
        if(studyState.username) {
            console.log("Creating study items.");
            let ids = Object.values(wordStatus.data.words).map(item => parseInt(item.id));
            console.log({variables: {username: studyState.username, tangoId: ids, due: new Date(Date.now()).toISOString()}});
            createStudyItems({variables: {username: studyState.username, tangoId: ids, due: new Date(Date.now()).toISOString()}});
        } else {
            let state = getNextWord(fisherYates(wordStatus.data.words));
            state.username = studyState.username;
            console.log(state);
            setStudyState(state);
        }
    }, [wordStatus.data]);
    

    if (wordStatus.loading || studyItemStatus.loading || mutationStatus.loading) return(<Loading lang={lang}/>);
        
    if (wordStatus.error || studyItemStatus.error || mutationStatus.error) {
        return <pre>{wordStatus?.error?.message}{studyItemStatus?.error?.message}{mutationStatus?.error?.message}</pre>;
    }

    if (studyState.word === '') return <Loading lang={lang}/>

    return(
        <StudyCard lang={lang} chooseCategory={setCategory} studyState={studyState} setStudyState={setStudyState}/>
    );
}

const StudyCard = ( { lang, studyState, setStudyState, setCategory }) => {

    const [answerState, setAnswerState] = useState({ clicked: -1, result: ''});
    const [visible, setVisible] = useState(false);

    console.log("Rendering study card...");

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
    
        if(e.code === 'Digit1') {
            setAnswerState({clicked: 0});
        }
    
        if(e.code === 'Digit2' && studyState.answerList.length >= 2) {
            setAnswerState({clicked: 1});
        }
    
        if(e.code === 'Digit3' && studyState.answerList.length >= 3) {
            setAnswerState({clicked: 2});
        }
    
        if(e.code === 'Digit4' && studyState.answerList.length >= 4) {
            setAnswerState({clicked: 3});
        }
    }

    // Hide info when word changes
    useEffect(() => {
        setVisible(false)
    }, [studyState.word]);
    
    let feedback = (lang === "EN" ? "Correct!" : "正解！");
    if(answerState.result === "incorrect") {
        feedback = (lang === "EN" ? "Too bad!" : "次は頑張ってね！");
    }

    const toNextWord = () => {
        let state = getNextWord(studyState.words);
        state.username = studyState.username;
        setStudyState(state);
        setAnswerState({ clicked: -1, result: ''});
    }

    if(studyState.word == null) {
        return(
            <section className="w-3/4 text-center">
                <div className="text-2xl">
                    <h2 className={styles.tango}>{lang === "EN" ? "Congrats! You finished studying for today!" : "おめでとうございます！今日の学習が終わりました。"}</h2>
                </div>
            </section>
        );
    }

    function handleClick(e) {
        e.preventDefault();
        setVisible(!visible);
    }

    return(
            <><section tabIndex={0} onKeyDown={handleInput} className="relative flex flex-col basis-full md:basis-3/4 w-full justify-between items-center shadow-md">
                <div className="relative flex flex-col justify-evenly w-full basis-full">
                    <div className={(visible ? '' : 'hidden') + " absolute h-full w-full bg-white/50 md:hidden"}/>
                    <div className="flex justify-center">
                    <h2 className={styles.tango + " my-2 text-7xl md:text-7xl lg:text-7xl mb-2"}>{studyState.word?.tango}</h2>
                    </div>
                    <ButtonGrid answerList={studyState.answerList} setAnswerState={setAnswerState} answerState={answerState} studyState={studyState}/>
                    <div className="text-center" style={{"visibility": (answerState.clicked == -1 ? "hidden" : "visible")} }>
                        <button type="button" className="my-2" onClick={() => toNextWord()}>{feedback} →</button>
                    </div>       
                </div>
                <div className="flex w-full justify-between md:justify-end items-end pb-2">
                        <button onClick={handleClick} className="text-white text-sm block md:hidden rounded-md bg-gray-400 p-3 ml-4">{visible ? "Hide info" : "Show info"}</button>
                        <CategoryPicker setCategory={setCategory} displayStyle={"menu"}/>
                </div>
            </section>
            <Definition word={studyState.word} answerState={answerState} lang={lang} visible={visible} setVisible={setVisible}/>
   </> );
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
                {! visible && (<div onClick={handleClick} className="text-gray-900 hover:cursor-pointer hover:text-orange-500 flex w-full h-full items-center justify-center">
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

const ButtonGrid = ( { answerList, setAnswerState, answerState, studyState, setStudyState } ) => {

    
    const [ mutateStudyItem, mutationStatus ] = useMutation(UPDATE_STUDY_ITEM);

    const toNextWord = ( result, i ) => {
        
        setAnswerState({ clicked: i, result: result });
       
        if(studyState.username) {
            
            let interval = parseInt(studyState.interval) * parseInt(studyState.easing_factor);
            let due = new Date(Date.now() + 86400000 * parseInt(studyState.interval)).toISOString();
            if(result == "incorrect") {
                interval = 1;
                due = new Date(Date.now()).toISOString();
            }

            mutateStudyItem({
                variables: {
                    username: studyState.username, 
                    id: parseInt(studyState.id), 
                    due: due,
                    interval: interval
                }
            });

            //TODO append to end of study queue!
            //studyState.words.push(studyState)
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

function getNextWord(words) {
    console.log(words);
    let word = words.pop();
    console.log(word);
    
    if(!word) return { word: null, words: null, answerList: null};

    if(word.__typename === "StudyItemType")
        return { 
            word: word.item, 
            id: word.id, 
            due: word.due, 
            interval: word.interval, 
            easing_factor: word.easingFactor, 
            words: words, answerList: generateAnswers(word.item)
        };

    return { 
        word: word, 
        due: null, 
        interval: null, 
        easing_factor: null, 
        words: words,
        answerList: generateAnswers(word)
    };
}

function getRandomWord(words) {
    return words.pop();
}

function generateAnswers(word) {
   
    if(!word) return [];

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

export default Learn;