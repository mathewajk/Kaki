import styles from '../styles/Learn.module.css'
import React, { useEffect, useState } from "react";

const Categories = ( { lang, setCategory, displayStyle } ) => {
    
    const categories = ["n5", "n4", "n3", "n2", "n1"];
    const text = {
        'EN': 'Choose a level:',
        'JA': '挑戦するレベルを選択してください。'
    }

    return (
        <>
            {   // Display prompt when in "full" mode 
                displayStyle === "full" && (<p className="mb-8 text-2xl">{text[lang]}</p>)
            }

            <div className={styles.categoryGrid} data-display={displayStyle}>
                {
                    categories.map((category, i) => {
                        
                        const handleClick = (e) => {
                            e.preventDefault();
                            setCategory(category);
                        }
                        
                        const color = `rgb(${0 + 60 * i}, ${160 - 20 * i}, ${180 - 40 * i})`;
                        const id = `cat-button-${i}`
                        return (
                            <button 
                                key={id} 
                                tag={id} 
                                style={{'backgroundColor': color}} 
                                onClick={handleClick}>
                                {category.toUpperCase()}
                            </button>
                        )
                    })
                }
            </div>
        </>
    );
}

export default Categories;