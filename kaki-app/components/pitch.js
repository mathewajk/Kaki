import styles from '../styles/Pitch.module.css'

import React from "react";

export const getMorae = (word) => {
    
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

const Pitch = (props) => {

    let word = props.word;

    return (
      <div className={styles.pitchDisplay} style={{"--pitch": word.pitch}}>
      
      {getMorae(word.yomi).map((mora, i) => {
        
        let height = "low";
        
        /* The first mora can only be either peak pitch (pitch = 1) or low pitch.
           Subsequent morae are high until the peak is encountered, then low.
           If there is no peak (pitch = 0), all subsequent morae are high.
           Sequences like しゃ, しゅ, しょ are considered one mora.
        */

        if(i == 0) { 
          height = ( word.pitch == 1 ? "peak" : "start" );
        } else {
          if (word.pitch == 0 || i < word.pitch - 1)
            height = "high"
          else if (i == word.pitch - 1)
            height = "peak"
        }

        let key = i + '_' + mora;
        let numChars = mora.split('').length;
        return (<span className={styles.mora} key={key} data-pitch={height} data-characters={numChars}>{mora}</span>);

      })}

      <span className={styles["sr-only"]}> - Pitch accent: {word.pitch}</span></div>
    );
  }

export default Pitch;