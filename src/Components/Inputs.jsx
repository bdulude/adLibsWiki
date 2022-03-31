import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';


const Inputs = (props) => {
    const history = useHistory();
    const [keys, setKeys] = useState([]);
    const [inputs, setInputs] = useState({});

    useEffect(() => {
        setKeys(Object.keys(props.data));
    }, [props.data]);

    const handleInput = (key, e) => {
        let inputsCopy = { ...inputs };
        inputsCopy[key] = e.target.value;
        setInputs(inputsCopy);
    };

    const handleSubmit = () => {
        let dataCopy = { ...props.data };
        for (const key in inputs) {
            console.log(key, inputs[key]);
            dataCopy[key][3] = inputs[key];
        }
        // console.log(dataCopy);
        props.setData(dataCopy);
        history.push('/out');
    };

    return (
        <>
            <form
                onSubmitCapture={handleSubmit}
                className="d-flex justify-content-around flex-wrap align-items-center"
            >
                {keys.map((key) => {
                    return (
                        <div key={key} className="form-floating col-5 mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name={key}
                                value={inputs[key]}
                                onChange={(e) => handleInput(key, e)}
                            />
                            <label className="form-label" htmlFor={key}>
                                {props.data[key][2]}:{" "}
                            </label>
                        </div>
                    );
                })}
            </form>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </>
    );
};

export default Inputs;
