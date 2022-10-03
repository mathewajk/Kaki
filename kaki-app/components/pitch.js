import styles from '../styles/Home.module.css'
import React from "react";

const Pitch = (props) => {

    let word = props.word;
    console.log(word);
    console.log(word.yomi);
    return (
      <p className={styles.pitchDisplay} style={{"--pitch": word.pitch}}>
        {word.yomi.split('').map((mora, i) => {
          if(i == 0) {
            if(word.pitch == 1)
              return <span className={styles.mora} key={mora} data-pitch="peak">{mora}</span>
            else
              return <span className={styles.mora} key={mora} data-pitch="low">{mora}</span>
          }
          else {
            if (word.pitch == 0)
              return <span className={styles.mora} key={mora} data-pitch="high">{mora}</span>
            if(i < word.pitch - 1)
              return <span className={styles.mora} data-pitch="high">{mora}</span>
            if (i == word.pitch - 1)
              return <span className={styles.mora} key={mora} data-pitch="peak">{mora}</span>
          }
          return <span className={styles.mora} key={mora} data-pitch="low">{mora}</span>
        })}
      <span className={styles["sr-only"]}> - Pitch accent: {word.pitch}</span></p>
    );
  }

export default Pitch;