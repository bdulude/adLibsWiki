import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Output = (props) => {
    const history = useHistory();
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        setKeys(Object.keys(props.data));
    }, [props.data]);

    return (
        <div>
            {/* <h3>{JSON.stringify(props.articleInfo)}</h3> */}
            <h3>{props.articleInfo["title"]}</h3>
            <p>
                {props.words.map((word, key) => {
                    return keys.includes(key.toString()) ? (
                        props.data[key][3] + props.data[key][1] + " "
                    ) : (
                        word + " "
                    );
                })}
            </p>
            <p>{props.articleInfo["summary"]}</p>
        </div>
    );
};

export default Output;
