import React from "react";

type PropTypes = {
    title: string;
    onClick: () => void;
    className?: string;
};

const CalculatorButton = ({ title, onClick, className }: PropTypes) => {
    return (
        <button
            className={`bg-blue-500 py-4 font-bold text-white ${className}`}
            onClick={onClick}
            type="button"
        >
            {title}
        </button>
    );
};

export default CalculatorButton;
