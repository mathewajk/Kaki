import React, { useState } from "react";
import styles from '../styles/Learn.module.css'

import Categories from '../components/categories';
import Quiz from '../components/quiz';

import { useLazyQuery, useMutation, gql } from "@apollo/client";
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

    console.log(session);

    if(status === 'loading') {
        console.log("Loading Learn...");
        return (<Loading lang={lang}/>);
    }

    return(
        <section className={styles.learn}>
            {category !== '' && (<QuizWrapper lang={lang} user={session?.user} category={category} setCategory={setCategory}/>)}
            {category === '' && (<Categories lang={lang} displayStyle={"full"} setCategory={setCategory}/>)}
        </section>
    );
}

const QuizWrapper = ( { lang, user, category, setCategory } ) => {
    
    const username = user?.username;

    // Query a user's study items
    const [ queryItems, itemStatus ] = useLazyQuery(QUERY_STUDY_ITEMS, { 
        variables: { username: username, category: category, getDue: true } 
    });

    // Query all words in the current category
    const [ queryWords, wordStatus ] = useLazyQuery(QUERY_WORDS, { 
        variables: { category: category } 
    });

    // Add study items for a user
    const [ createItems, createStatus ] = useMutation(CREATE_STUDY_ITEM, {
        refetchQueries: [ 
            {
                query: QUERY_STUDY_ITEMS, 
                variables: { username: username, category: category, getDue: true }
            },
            'StudyItems'
        ]
      });   

    // Make it easier to access queries and mutations later
    const queries = {
        items: {
            query: queryItems,
            data: itemStatus.data,
            loading: itemStatus.loading,
            error: itemStatus.error
        },
        words: {
            query: queryWords,
            data: wordStatus.data,
            loading: wordStatus.loading,
            error: wordStatus.error
        }
    }
    const mutations = {
        create: {
            mutation: createItems,
            data: createStatus.data,
            loading: createStatus.loading,
            error: createStatus.error
        }
    }

    if (wordStatus.loading || itemStatus.loading || createStatus.loading) {
        return(<Loading lang={lang}/>);
    }
        
    if (wordStatus.error || itemStatus.error || createStatus.error) {
        return(
            <pre>
                {wordStatus?.error?.message}
                {itemStatus?.error?.message}
                {createStatus?.error?.message}
            </pre>
        );
    }

    return(
        <Quiz lang={lang} user={user} setCategory={setCategory} queries={queries} mutations={mutations}/>
    );
}

export default Learn;