import React, { useEffect, useState } from "react";
import axios from "axios";
import { Switch, Route, Link, History } from 'react-router-dom';
import 'bootstrap';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    // https://en.wikipedia.org/api/rest_v1/page/random/summary
    // https://dictionaryapi.dev/


    // each entry: [ original word, punctuation, part of speech, new word ]
    const [data, setData] = useState(null);
    const [words, setWords] = useState([]);
    const [articleInfo, setArticleInfo] = useState({});

    const getPartsOfSpeech = (map) => {
        console.log("--------------- Getting Word Information");
        let promises = [];
        for (const [key, value] of map.entries()) {
            promises.push(
                axios
                    .get("https://api.dictionaryapi.dev/api/v2/entries/en/" + value[0])
                    .then(res => {
                        // console.log(res.data[0].meanings[0].partOfSpeech);
                        value[2] = res.data[0].meanings[0].partOfSpeech;
                    })
                    .catch(err => {
                        console.log(`${value[0]} was not found with dictionaryapi.dev. Word deleted.`);
                        map.delete(key);
                    })
            )
        }
        // After all promises are fulfilled, set state
        Promise.all(promises).then(() => {
            console.log(map);
            setData(map);
        });
    }


    const generateRandom = (string) => {
        console.log("--------------- Generating Random Selection");
        let wordsArr = string.split(" ");
        let sentences = string.split(".");
        let inputs = Math.floor(wordsArr.length / 4);
        let map = new Map();
        const punctuation = [".", ",", ":", "!", "?"];
        for (let x = 0; x < inputs; x++) {
            let rand = Math.floor(Math.random() * wordsArr.length);
            // Keep going until each random number is unique
            while (map.hasOwnProperty(rand)) {
                rand = Math.floor(Math.random() * wordsArr.length);
            }

            // if string contains ending punctuation, set ending punctuation boolean
            // remove last char from string
            if (punctuation.includes(wordsArr[rand].charAt(wordsArr[rand].length - 1))) {
                map.set(rand, [wordsArr[rand].slice(0, -1), wordsArr[rand].slice(-1), "", ""]);


                // console.log(`${wordsArr[rand]} has punctuation.`);
                // console.log("inserted " + wordsArr[rand].slice(0, -1));
            }
            else {
                // [ original word, punctuation, part of speech, new word ]
                map.set(rand, [wordsArr[rand], "", "", ""]);
                
            }
        }

        // console.log(map);
        // console.log(wordsArr.length);
        // console.log(map.size);

        getPartsOfSpeech(map);
        setWords(wordsArr);
        // console.log(sentences);
    }

    const getRandArticle = () => {
        console.log("--------------- Getting Random Wikipedia Article");
        axios
            .get("https://en.wikipedia.org/api/rest_v1/page/random/summary")
            .then(res => {
                // console.log("GET Success");
                // console.log(res.data);
                console.log(res.data.title);
                console.log(res.data.content_urls.desktop.page);
                console.log(res.data.extract);
                setArticleInfo({
                    title: res.data.title,
                    url: res.data.content_urls.desktop.page,
                    summary: res.data.extract
                });
                generateRandom(res.data.extract);
            })
            .catch(err => {
                console.log("Wikipedia GET Failed");
                console.log(err.data);
            })
    }


    return (
        <div className="App" style={{ textAlign: "center" }}>
            <div className="container">
                <h1 className="h1" style={{ marginBottom: 50 }}>adLibs.wiki</h1>
                <Route exact path="/">
                    <button onClick={getRandArticle} type="button" className="btn btn-primary btn-lg">Get Random Article</button>
                </Route>
            </div>
        </div>
    );
}

export default App;
