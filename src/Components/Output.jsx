import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Output = (props) => {
    const history = useHistory();
    const [keys, setKeys] = useState([]);

    // Set keys, redirect if there are none
    useEffect(() => {
        const newKeys = Object.keys(props.data);
        if (newKeys.length === 0) {
            history.push("/");
        }
        setKeys(newKeys);
    }, [props.data, history]);

    return (
        <div className="card">
            <div className="card-body">
                {/* <h3>{JSON.stringify(props.articleInfo)}</h3> */}
                <h3>{props.articleInfo["title"]}</h3>
                <p>
                    {props.words.map((word, key) => {
                        return keys.includes(key.toString()) ? (
                            <span key={key}>
                                <span style={{ textDecoration: "underline" }}>
                                    {props.data[key][3] + props.data[key][1]}
                                </span>{" "}
                            </span>
                        ) : (
                            <span key={key}>{word + " "}</span>
                        );
                    })}
                </p>
                {/* <p>{props.articleInfo["summary"]}</p> */}
                <a href={props.articleInfo.url}>{props.articleInfo.url}</a>
            </div>
        </div>
    );
};

export default Output;
