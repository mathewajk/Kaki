import { getMorae } from "../components/pitch"

export const handleStudyItems = ( quizState, setQuizState, queries ) => {
        
    // Iff no one is logged in, query the entire vocab list
    if(!quizState.username) {
        queries.words.query();
        return;
    }

    // Wait for load
    if(queries.items.loading) return;

    // If we don't have any study item data, query it
    if(!queries.items.data) {
        queries.items.query();
        return;
    }
    
    const items = queries.items.data.studyItems;
    console.log(`Got ${items.length} study items!`);
    
    // If there is no study item data for this category, create it
    if (items.length == 0) {
        queries.words.query();
        return;
    }

    // Study items exist; initialize the study session
    let state = {
        ...getNextWord(fisherYates(items)),
        username: quizState.username
    };
    setQuizState(state);
}

export const handleWords = (quizState, setQuizState, queries, mutations ) => {

    // Avoid unnecessary queries
    if(queries.words.loading) return;
    if(quizState.username && (queries.items.loading || queries.items.data == undefined )) return; 
    if(quizState.username && queries.items.data.studyItems.length > 0) return;

    // If we don't have any data yet, query it
    if(!queries.words.data) {
        queries.words.query();
        return;
    }

    // Add study items associated with $user for each $word
    if(quizState.username) {
        
        // Collect ids of all queried words
        let ids = Object.values(queries.words.data.words).map(item => parseInt(item.id));
       
        mutations.create.mutation({
            variables: { 
                username: quizState.username, 
                tangoId: ids, 
                due: new Date(Date.now()).toISOString()
            }
        });

        // Mutation will trigger a refetch, so just return
        return;
    }

    // No user; initialize a non-logged-in quiz session
    setQuizState(getNextWord(fisherYates(queries.words.data.words)));
}

export function getNextWord(words) {
    console.log(words);
    let word = words.pop();
    console.log(word);
    
    if(!word) return { word: null, words: null, answerList: null};

    if(word.__typename === "StudyItemType") {
        return { 
            word: word,
            words: words, 
            answerList: generateAnswers(word.item)
        };
    }
    return { 
        word: {
            item: word
        },
        words: words,
        answerList: generateAnswers(word)
    };
}

export function generateAnswers(word) {
   
    if(!word) return [];

    const morae = getMorae(word.yomi);
    
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

export function fisherYates(arr) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled;
}