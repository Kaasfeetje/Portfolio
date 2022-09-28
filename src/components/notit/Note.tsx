import { Note } from "@prisma/client";
import React, { useState } from "react";
import Modal from "../common/modal/Modal";
import NoteModal from "./NoteModal";

type PropTypes = {
    note: Note;
    updateNote: (
        note: Note,
        swapWith: string | undefined,
        moveTo: string | undefined
    ) => void;
    deleteNote: (noteId: string) => void;
    setDraggedNote: (note: Note | undefined) => void;
    draggedNote: Note | undefined;
    onDrop: (drop: { type: "note" | "notepage"; id: string }) => void;
    swapNoteOptions: { id: string; note: string }[];
    swapNotePageOptions: { id: string; name: string }[];
};

const Note = ({
    note,
    updateNote,
    deleteNote,
    setDraggedNote,
    draggedNote,
    onDrop,
    swapNoteOptions,
    swapNotePageOptions,
}: PropTypes) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    return (
        <li
            className={`p-2 rounded-lg my-2 border-b-4 select-none cursor-pointer ${
                note.finished
                    ? "border-green-500 hover:border-green-600"
                    : "border-gray-300 hover:border-gray-400"
            } ${isHovering ? "border-4" : ""} ${
                draggedNote?.id === note.id ? "border-4 border-dashed" : ""
            }`}
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
                        swapNoteOptions={swapNoteOptions}
                        swapNotePageOptions={swapNotePageOptions}
                    />
                </Modal>
            )}
        </li>
    );
};

export default Note;
