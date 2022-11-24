import styles from '../styles/Learn.module.css'
import Pitch from "../components/pitch";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useSession } from "next-auth/react";


const CREATE_STUDY_ITEM = gql`
mutation CreateStudyItem($username: String!, $tangoId: [Int]!, $due: String!) {
    createStudyItem(username: $username, tangoId: $tangoId, due: $due) {
        ok
        items {
            item {
                tango
                yomi
                pitch
                definition
                pos
            }
            priority
        }
    }
}`

const QUERY_STUDY_ITEMS = gql`
query StudyItemsAndWords($username: String, $category: String) {
    studyItems(username: $username, category: $category) {
        item {
            tango
            yomi
            pitch
            definition
            pos
        }
        priority
    }
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

const ChooseCategory = ( { lang, setCategory, displayStyle } ) => {
    const categories = ["n5", "n4", "n3", "n2", "n1"];
    
    if(displayStyle == "menu") {
        return (
        <div className="categoryGrid sm:text-lg md:text-xl lg:text-2xl">
        {
            categories.map((category, i) => {
            function handleClick(e) {
                e.preventDefault();
                setCategory(category);
            }
            return <button key={"cat-button-" + i} tag={"cat-button-" + i} className="text-sm text-white py-1 px-2 mr-4" style={{'background-color': 'rgb(' + (0 + 60 * i) + ', ' + (160 - 20 * i) + ', ' + (180 - 40 * i) + ')'}} onClick={handleClick}>{category.toUpperCase()}</button>
            })
        }
        </div>
        );
    }
    
    return (
        <main className={styles.content}>
            <section className={styles.studyCard}>
                <div className={styles.studyItem}>
                <p className="mb-8">{lang === "EN" ? "Choose a level:" : "挑戦するレベルを選択してください。"}</p>
                <div className={styles.categoryGrid}>
                {
                    categories.map((category, i) => {
                    function handleClick(e) {
                        e.preventDefault();
                        setCategory(category);
                    }
                    return <button className="py-8 rounded-md text-white" key={"cat-button-" + i} tag={"cat-button-" + i} style={{'backgroundColor': 'rgb(' + (0 + 60 * i) + ', ' + (160 - 20 * i) + ', ' + (180 - 40 * i) + ')'}} onClick={handleClick}>{category.toUpperCase()}</button>
                    })
                }
                </div>
                </div>
            </section>
        </main>
    );
}

const Loading = ( { lang } ) => {

    const text = {
        "EN": "Loading study session...",
        "JA": "読み込み中..."
    };

    return(
        <section className={styles.studyCard}>
        <div className="text-2xl">
            <h2 className={styles.tango}>{text[lang]}</h2>
        </div>
        </section>
    );
}

function Learn( { lang } ) {

    const [category, setCategory] = useState('');
    const { data: session, status } = useSession();

    return(
        <>
            {status === "loading" && (<Loading lang={lang}/>)}
            {category === '' && (<ChooseCategory lang={lang} setCategory={setCategory}/>)}
            {category !== '' && (<StudyPage lang={lang} session={session} category={category} setCategory={setCategory}/>)}
        </>
    );
}

function StudyPage( { lang, session, category, setCategory } ) {

    const username = session?.user.username;
    const [studyState, setStudyState] = useState({word: "", words: [], answerList: []});
    
    const { data, loading, error } = useQuery(QUERY_STUDY_ITEMS, {
        variables: { username: username, category: category }
    });

    const [mutateStudyItem, mutationStatus] = useMutation(CREATE_STUDY_ITEM, {
        refetchQueries: [ 
            {
                query: QUERY_STUDY_ITEMS, 
                variables: { username: username, category: category }
            },
            'StudyItemsAndWords'
        ]
      });

    useEffect(() => {
        if(!data) return;
        if(username) {
            if (data.studyItems.length == 0) {
                let ids = Object.values(data.words).map(item => parseInt(item.id));
                mutateStudyItem({variables: {username: username, tangoId: ids, due: Date.now().toString()}});
                wordList = data.studyItems.slice();
            }
        }
        
        let wordList; 
        wordList = fisherYates(data.words); // TODO
        setStudyState(getNextWord(wordList));
    }, [data]);

    if (loading || mutationStatus.loading) return(<Loading lang={lang}/>);
        
    if (error) {
        return <pre>{error.message}</pre>;
    }

    if (mutationStatus.error) {
        return <pre>{mutationStatus.error.message}</pre>;
    }

    // Shuffle currently-due words. TODO: Will need to shuffle according to time due?
   
    if (studyState.word === '') return <Loading lang={lang}/>
    
    return(
        <main className={styles.content}>
            <StudyCard lang={lang} chooseCategory={setCategory} studyState={studyState} setStudyState={setStudyState}/>
        </main>
    );
}

const StudyCard = ( { lang, studyState, setStudyState, setCategory }) => {

    const [answerState, setAnswerState] = useState({ clicked: -1, result: ''});
    const [visible, setVisible] = useState(false);

    // Hide info when word changes
    useEffect(() => {
        setVisible(false)
    }, [studyState.word]);
    
    let feedback = (lang === "EN" ? "Correct!" : "正解！");
    if(answerState.result === "incorrect") {
        feedback = (lang === "EN" ? "Too bad!" : "次は頑張ってね！");
    }

    const toNextWordB = () => {
        setStudyState(getNextWord(studyState.words));
        setAnswerState({ clicked: -1, result: ''});
    }

    if(studyState.word == null && studyState.words.length == 0) {
        return(
            <section className={styles.studyCard}>
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

    const handleInput = (e) => {
        console.log(e.code);
		if(answerState.clicked != -1) {
            if(e.code === 'Enter' || e.code === 'ArrowRight'){
                toNextWordB();
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

    return(
        <section relative tabIndex={0} onKeyDown={handleInput} className="flex flex-col w-full h-full text-lg md:text-xl lg:text-2xl items-center content-center justify-center">
            <section className="relative flex flex-col w-full h-full justify-center items-center md:h-3/4 overflow-hidden md:overflow-scroll shadow-md">
                <div className="relative flex flex-col justify-evenly h-full md:h-3/4 w-full md:w-3/4">
                    <div className={(visible ? '' : 'hidden') + " absolute h-full w-full bg-white/50 md:hidden"}/>
                    <div class="flex justify-center">
                    <h2 className={styles.tango + " text-7xl md:text-8xl lg:text-9xl mb-2"}>{studyState.word?.tango}</h2>
                    </div>
                    <div>
                        <ButtonGrid answerList={studyState.answerList} setAnswerState={setAnswerState} answerState={answerState} />
                    </div>
                    <div className="text-center" style={{"visibility": (answerState.clicked == -1 ? "hidden" : "visible")} }>
                        <button className="kaki-button" onClick={() => toNextWordB()}>{feedback} →</button>
                    </div>       
                </div>
            
                <div className="md:absolute bottom-0 flex w-full justify-between md:justify-end items-end pb-2">
                <button onClick={handleClick} className="text-sm block md:hidden rounded-md bg-gray-400 p-3 ml-4">{visible ? "Hide info" : "Show info"}</button>
                    <ChooseCategory setCategory={setCategory} displayStyle={"menu"}/>
                </div>
            </section>
            <Definition word={studyState.word} answerState={answerState} lang={lang} visible={visible} setVisible={setVisible}/>
        </section>
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
        <div className={(visible ? '' : "hidden") + " rounded-md w-3/4 h-1/2 shadow-lg absolute md:shadow-none md:relative md:block bg-gray-200 md:h-1/4 border-t-4 border-gray-200 md:w-full"}>
            <div className="overflow-scroll h-full">
                {! visible && (<div onClick={handleClick} className="hover:cursor-pointer flex w-full h-full items-center justify-center">
                    <button onClick={handleClick}>{text}</button>
                    </div>)}
                {visible && (
                <div style={{visibility: (visible ? "visible" : "hidden")}} className="flex flex-col items-center align-center md:flex-row h-full">
                    <div className="flex md:border-r-2 border-gray-400 w-1/2 md:w-1/4 justify-center items-center text-center px-1">
                        <div className="mt-2">
                            <p className="text-orange-700 text-5xl md:text-2xl mb-3">{word.tango}</p>
                            {answerState.clicked != -1 && (<p className="text-lg font-normal text-black"><Pitch word={word}/></p>)}
                            {answerState.clicked == -1 && (<p className="text-lg font-normal text-black">{word.yomi}</p>)}
                        </div>
                    </div>
                    <div className="text-lg font-normal text-black border-t-2 md:border-t-0 border-gray-400 md:w-3/4 p-4">
                        <p className="text-base text-italic text-gray-700">{word.pos}</p>
                        <p>{word.definition}</p>
                    </div>
                </div>)}
            </div>
        </div>
    );
}

const ButtonGrid = ( { answerList, setAnswerState, answerState } ) => {

    

    const toNextWord = ( result, i ) => {
        setAnswerState({ clicked: i, result: result });
    }

    return(
        <div className={styles.response}>
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
        <button disabled={ (feedback != '' ? true : false) } className={styles[feedback]} onClick={handleClick}>
            <Pitch word={option} />
        </button>
    );
}

function getNextWord(words) {
    let word = words.pop();
    console.log("Got word " + word);
    return { word: word, words: words, answerList: generateAnswers(word)};
}

function getRandomWord(words) {
    return words.pop();
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

export default Learn;