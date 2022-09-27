import React, { ReactNode } from "react";

type PropTypes = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: ReactNode;
};

const Modal = ({ isOpen, setIsOpen, children }: PropTypes) => {
    return (
        <div
            onClick={(e) => {
                setIsOpen(false);
                e.stopPropagation();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center"
        >
            <div className="bg-black opacity-10 w-full h-full absolute top-0 left-0 -z-10"></div>
            {isOpen && children}
        </div>
    );
};

export default Modal;
