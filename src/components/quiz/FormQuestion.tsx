import {
    faCircleMinus,
    faCircleXmark,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

type PropTypes = {
    question: {
        question: string;
        options: {
            option: string;
            answer: boolean;
        }[];
    };
    deleteQuestion: (_question: string) => void;
    addOption: (_question: string, option: string) => void;
    deleteOption: (_question: string, option: string) => void;
    changeCorrect: (_question: string, option: string) => void;
};

const FormQuestion = ({
    question,
    deleteQuestion,
    addOption,
    deleteOption,
    changeCorrect,
}: PropTypes) => {
    const [isAdding, setIsAdding] = useState(false);
    const [option, setOption] = useState("");
    return (
        <div className="border-b-2 border-blue-500 pb-2 mt-4">
            <div className="flex justify-between align-middle mb-2">
                <h3>{question.question}</h3>
                <button
                    className="w-6 text-red-500"
                    onClick={() => deleteQuestion(question.question)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <ol className="list-decimal">
                {question.options.map((o) => (
                    <li className="ml-8 mr-1" key={o.option}>
                        <div className="flex justify-between align-middle">
                            <span>{o.option}</span>
                            <div className="flex align-middle">
                                <input
                                    className="mr-4"
                                    type="radio"
                                    name={`${question.question}-answer`}
                                    value={o.option}
                                    onChange={() =>
                                        changeCorrect(
                                            question.question,
                                            o.option
                                        )
                                    }
                                />
                                <button
                                    className="w-4"
                                    onClick={() =>
                                        deleteOption(
                                            question.question,
                                            o.option
                                        )
                                    }
                                >
                                    <FontAwesomeIcon icon={faCircleMinus} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ol>
            {isAdding ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addOption(question.question, option);
                        setOption("");
                    }}
                    className="flex align-middle "
                >
                    <input
                        type="text"
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                        onBlur={() => {
                            setIsAdding(false);
                            setOption("");
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setIsAdding(false);
                            setOption("");
                        }}
                        className="w-6"
                    >
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                </form>
            ) : (
                <button onClick={() => setIsAdding(true)}>
                    <span>Add Option</span>
                </button>
            )}
        </div>
    );
};

export default FormQuestion;
