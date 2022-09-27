import { Note } from "@prisma/client";
import React, { useState } from "react";
import Modal from "../common/modal/Modal";
import NoteModal from "./NoteModal";

type PropTypes = {
    note: Note;
    updateNote: (note: Note) => void;
    deleteNote: (noteId: string) => void;
    setDraggedNote: (note: Note | undefined) => void;
    draggedNote: Note | undefined;
    onDrop: (drop: { type: "note" | "notepage"; id: string }) => void;
};

const Note = ({
    note,
    updateNote,
    deleteNote,
    setDraggedNote,
    draggedNote,
    onDrop,
}: PropTypes) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    return (
        <li
            className={`p-2 rounded-lg my-2 border-b-4 select-none cursor-pointer ${
                note.finished ? "border-green-500" : ""
            } ${isHovering ? "border-4" : ""}`}
            onMouseDown={(e) => {
                setDraggedNote(note);
                e.stopPropagation();
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                onDrop({ type: "note", id: note.id });
                setDraggedNote(undefined);
            }}
            onMouseEnter={(e) => {
                e.stopPropagation();
                if (draggedNote) setIsHovering(true);
            }}
            onMouseLeave={() => {
                setIsHovering(false);
            }}
            onClick={(e) => {
                if (!draggedNote) setIsOpen(!isOpen);
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
