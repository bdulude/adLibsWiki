import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, useHistory } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Inputs from './Components/Inputs';
import Output from './Components/Output';

function App() {
    // each data entry: [ original word, punctuation, part of speech, new word ]
    const [data, setData] = useState({});
    const [words, setWords] = useState([]);
    const [articleInfo, setArticleInfo] = useState({ title: "", url: "" });
    const [article, setArticle] = useState("");
    const [error, setError] = useState("");
    const [johnMode, setJohnMode] = useState("");
    const history = useHistory();

    const getPartsOfSpeech = (obj) => {
        console.log("--------------- Getting Parts of Speech");
        let promises = [];
        for (const key in obj) {
            promises.push(
                axios
                    .get("https://api.dictionaryapi.dev/api/v2/entries/en/" + obj[key][0])
                    .then(res => {
                        obj[key][2] = res.data[0].meanings[0].partOfSpeech;
                    })
                    .catch(err => {
                        console.log(`${obj[key][0]} was not found with dictionaryapi.dev. Word deleted.`);
                        delete obj[key];
                    })
            )
        }
        // After all promises are fulfilled, set state
        Promise.all(promises).then(() => {
            setData(obj);
            history.push("/in");
        });
    }

    // Generates a random selection of words, shortens summary to first two sentences, processes punctuation 
    const generateRandom = (string) => {
        console.log("--------------- Generating Random Selection");
        let sentences = string.split(".");
        if (sentences.length > 2) {
            string = sentences[0] + "." + sentences[1] + ".";
            console.log("--------------- Summary Shortened to two sentences");
        }
        let wordsArr = string.split(" ");
        let inputs = Math.floor(wordsArr.length / 4);
        let obj = {};
        const punctuation = [".", ",", ":", "!", "?"];
        for (let x = 0; x < inputs; x++) {
            let rand = Math.floor(Math.random() * wordsArr.length);

            // Keep going until each random number is unique
            while (obj.hasOwnProperty(rand)) {
                rand = Math.floor(Math.random() * wordsArr.length);
            }

            // if string contains ending punctuation, set punctuation string to the character, and remove it so the dictionary api works correctly
            if (punctuation.includes(wordsArr[rand].charAt(wordsArr[rand].length - 1))) {
                obj[rand] = [wordsArr[rand].slice(0, -1), wordsArr[rand].slice(-1), "", ""];
            }
            else {
                obj[rand] = [wordsArr[rand], "", "", ""];
            }
        }
        getPartsOfSpeech(obj);
        setWords(wordsArr);
    }

    // Gets a random article summary from Wikipedia when the button is clicked
    const getRandArticle = () => {
        console.log("--------------- Getting Random Wikipedia Article");
        axios
            .get("https://en.wikipedia.org/api/rest_v1/page/random/summary")
            .then(res => {
                console.log(res.data.title);
                console.log(res.data.content_urls.desktop.page);
                console.log(res.data.extract);
                setArticleInfo({
                    title: res.data.title,
                    url: res.data.content_urls.desktop.page,
                    summary: res.data.extract
                });
                setError("");
                setArticle("");
                generateRandom(res.data.extract);
            })
            .catch(err => {
                console.log("Wikipedia GET Failed");
                console.log(err.data);
            })
    }


    const getArticle = () => {
        let updated = article;
        let split = article.split('/');
        setArticle(split[split.length - 1]);
        updated = split[split.length - 1];
        console.log(`--------------- Getting ${updated} Article`);
        axios
            .get("https://en.wikipedia.org/api/rest_v1/page/summary/" + updated)
            .then(res => {
                console.log(res.data.title);
                console.log(res.data.content_urls.desktop.page);
                console.log(res.data.extract);
                setArticleInfo({
                    title: res.data.title,
                    url: res.data.content_urls.desktop.page,
                    summary: res.data.extract
                });
                setArticle("");
                setError("");
                generateRandom(res.data.extract);
            })
            .catch(err => {
                console.log("Wikipedia GET Failed");
                console.log(err.data);
                setError(`Could not find the Wikipedia article ${article}. Check the last part of the source url for the article name.`)
            })
    }

    const goHome = () => {
        history.push('/');
    }

    const toggleJohnMode = () => {
        johnMode.length > 1 ? setJohnMode("") : setJohnMode("johnMode");
    }


    return (
        <div className={`App text-center min-vh-100 ${johnMode}`}>
            <div className="container ">
                <div className="d-flex justify-content-center">
                    <h1 className="display-2 mb-5" onClick={goHome} style={{ cursor: "pointer", width: 400 }}>adLibs.wiki</h1>
                </div>
                <Route exact path="/">
                    <button onClick={getRandArticle} type="button" className="btn btn-primary btn-lg mb-5">Get Random Article</button>
                    <h5 className="mb-5"> - Or - </h5>
                    <div className="form-group d-flex justify-content-center mb-2">
                        <input className="form-control form-control-lg w-25 me-2" value={article} onChange={e => setArticle(e.target.value)} placeholder="Wikipedia URL" type="text" name="article" />
                        <button onClick={getArticle} type="button" className="btn btn-primary btn-lg">Get Article</button>
                    </div>
                    <p className="text-danger">{error}</p>

                </Route>
                <Route exact path="/in">
                    <Inputs data={data} setData={setData} />
                </Route>
                <Route exact path="/out">
                    <Output data={data} words={words} articleInfo={articleInfo} />
                </Route>
                <Route exact path="/about">
                    <div className="card">
                        <p>
                            A simple app that gets a Wikipedia article, randomly grabs a few selected words from the articles summary,
                        </p>
                        <p>
                            looks up their parts of speech, and generates a poorly made Mad Libs like experience.
                        </p>
                        <p>
                            It's fundamentally flawed as there are multiple definitions per word, often with different parts of speech.
                        </p>
                        <p>
                            It also doesn't recognize names, places, or other languages. However it sometimes works enough to be funny.
                        </p>
                        <p>
                            Built with <a href="https://reactjs.org/">React</a> and <a href="https://getbootstrap.com/">Bootstrap</a>.
                        </p>
                        <p>
                            Uses the <a href="https://dictionaryapi.dev/">Free Dictionary API</a> to grab parts of speech.
                        </p>
                        <p>
                            Uses <a href="https://www.mediawiki.org/wiki/Wikimedia_REST_API">Wikipedia's REST API</a> to get article summaries.
                        </p>
                        <p>
                            Created by Brent Dulude over the course of the last week of March 2022 for Coding Dojo.
                        </p>
                        <p>
                            Find me on <a href="https://github.com/bdulude">GitHub</a> or <a href="https://www.linkedin.com/in/bdulude/">LinkedIn</a>
                        </p>
                        <p>
                            Special thanks to my instructor John Misirlakis who said I needed more color in my wireframe.
                        </p>
                    </div>
                </Route>
                <button onClick={toggleJohnMode} style={{ position: "fixed", bottom: 10, right: 10 }} type="button" className="btn btn-outline-danger btn-sm">Toggle John Mode</button>
                <button onClick={() => history.push('/about')} style={{ position: "fixed", bottom: 10, left: 10 }} type="button" className="btn btn-outline-warning btn-sm">About</button>
            </div>
        </div>
    );
}

export default App;
