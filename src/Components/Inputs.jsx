import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';


const Inputs = (props) => {
    const history = useHistory();
    const [keys, setKeys] = useState([]);
    const [inputs, setInputs] = useState({});

    // Set keys, redirect if there are none
    useEffect(() => {
        const newKeys = Object.keys(props.data);
        if (newKeys.length === 0){
            history.push('/');
        }
        setKeys(newKeys);
    }, [props.data, history]);

    // Dynamically bind any number of inputs
    const handleInput = (key, e) => {
        let inputsCopy = { ...inputs };
        inputsCopy[key] = e.target.value;
        setInputs(inputsCopy);
    };

    // Puts all entries into data prop, changes view to output component
    const handleSubmit = () => {
        let dataCopy = { ...props.data };
        for (const key in inputs) {
            dataCopy[key][3] = inputs[key];
        }
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
