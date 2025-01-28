// 'use client';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

import styles from '@/styles/index.module.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';



const Index = () => {

    const dispatch = useDispatch()
    const jsonInput = useSelector((state) => state.json)
    const parsedJson = useSelector((state) => state.parsedJson)
    const error = useSelector((state) => state.error)

    const handleInputChange = (e) => {
        dispatch({ type: 'JSON', payload: e.target.value })
    }

    const validate = (input) => {
        if (!input) {
            return "Input can't be empty!";
        }

        if (typeof input === 'string' && input.startsWith("'") && input.endsWith("'")) {
            input = input.slice(1, -1);
        }
        try {
            const parsed = JSON.parse(input);

            if (typeof parsed !== 'object' || Array.isArray(parsed)) {
                return "Input must be a JSON object."
            }
            return null;
        } catch (err) {
            return `Invalid JSON : ${err.message}`
        }
    }


    const handleParseJson = () => {

        let inputToParse;

        const isError = validate(jsonInput);

        if (isError) {
            dispatch({ type: 'ERROR', payload: isError });
            return;
        }
        try {
            
            inputToParse = jsonInput;
            if (typeof jsonInput === 'string' && jsonInput.startsWith("'") && jsonInput.endsWith("'")) {
                inputToParse = jsonInput.slice(1, -1);
            }
            
            console.log(inputToParse);
            const parsed = JSON.parse(inputToParse);
            console.log(parsed);
            dispatch({ type: 'PARSE_JSON', payload: parsed })
        } catch (err) {
            dispatch({ type: 'ERROR', payload: err.message })
        }
    }

      

    const renderParsedJson = (data) => {
        if (typeof data === 'object' && data !== null) {
            return (
                <div className={styles.jsonOutput}>
                    <span className={styles.span}>{'{'}</span>
                    {Object.entries(data).map(([key, value], index) => (
                        <div key={index} className={styles.innerDiv}>
                            <strong>{key}</strong>: {Array.isArray(value) ? (
                                <>
                                    <span>[{value.length}]</span>
                                    <div className={styles.innerDiv}>
                                        <span className={styles.span}>{'['}</span>
                                        {value.map((item, idx) => (
                                            <div key={idx} className={styles.innerDiv}>
                                                {typeof item === 'object' ? (
                                                    renderParsedJson(item)
                                                ) : (
                                                    <span>{item}</span>
                                                )}
                                            </div>
                                        ))}
                                        <span className={styles.span}>{']'}</span>
                                    </div>
                                </>
                            ) : typeof value === 'object' ? (
                                <>
                                    {renderParsedJson(value)}
                                </>
                            ) : (
                                <span>{value}</span>
                            )}
                        </div>
                    ))}
                    <span className={styles.span}>{'}'}</span>
                </div>
            );
        }
        return <span className={styles.value}>{data}</span>;
    };
    

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'ERROR', payload: null });
        }
    }, [error]);

    return (

        <div className={styles.container}>
            <ToastContainer />
            <h1 className={styles.header}>JSON PARSER</h1>
            <textarea
                className={styles.input}
                value={jsonInput}
                onChange={handleInputChange}
                placeholder='Enter JSON here...'
            />
            <button onClick={handleParseJson} className={styles.parseButton}>Parse JSON</button>

            {parsedJson && (
                <>
                    <h3 className={styles.resultHeader}>Parsed JSON</h3>

                    <div className={styles.resultContainer}>
                        {/* <div className={styles.result}> */}
                        {/* {error && <div className={styles.error}>{error}</div>} */}
                        {/* {error && toast.error(error)} */}
                        {/* <pre className={styles.resultJson}>{parsedJson ? JSON.stringify(parsedJson, null, 2) : ""}</pre> */}
                        {!error && parsedJson && renderParsedJson(parsedJson)}
                        {/* </div> */}
                    </div>
                </>
            )}
        </div>

    )


}

export default Index;  