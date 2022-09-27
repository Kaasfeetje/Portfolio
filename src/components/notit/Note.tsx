import { Note } from "@prisma/client";
import React, { useState } from "react";
import Modal from "../common/modal/Modal";
import NoteModal from "./NoteModal";

type PropTypes = {
    note: Note;
    updateNote: (note: Note) => void;
    deleteNote: (noteId: string) => void;
    onDragStart: (note: Note) => void;
    onDrop: (note: Note) => void;
};

const Note = ({ note, updateNote, deleteNote,onDragStart, onDrop }: PropTypes) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <li
            className={`${note.finished ? "bg-green-500" : ""}`}
            draggable
            onDragStart={() => onDragStart(note)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(note)}
            onClick={(e) => {
                setIsOpen(!isOpen);
                e.stopPropagation();
            }}
        >
            <p>{note.note}</p>
            {isOpen && (
                <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                    <NoteModal
                        note={note}
                        updateNote={updateNote}
                        deleteNote={deleteNote}
                        onClose={() => setIsOpen(false)}
                    />
                </Modal>
            )}
        </li>
    );
};

export default Note;
