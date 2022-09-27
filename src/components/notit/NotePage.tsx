import { Note as NoteType, NotePage } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Modal from "../common/modal/Modal";
import Note from "./Note";
import NotePageModal from "./NotePageModal";

type PropTypes = {
    notepage: NotePage & {
        notes: NoteType[];
    };
    addNewNote: (notepageId: string, note: string, index: number) => void;
    updateNote: (note: NoteType) => void;
    deleteNote: (noteId: string) => void;
    updateNotePage: (notepage: NotePage) => void;
    deleteNotePage: (notepageId: string) => void;
    setDraggedNote: (note: NoteType | undefined) => void;
    draggedNote: NoteType | undefined;
    onDrop: (drop: { type: "note" | "notepage"; id: string }) => void;
    setDraggedNotePage: (notepage: NotePage | undefined) => void;
    draggedNotePage: NotePage | undefined;
    onDropNotePage: (notepageId: string) => void;
};

const NotePage = ({
    notepage,
    addNewNote,
    updateNote,
    deleteNote,
    updateNotePage,
    deleteNotePage,
    setDraggedNote,
    draggedNote,
    onDrop,
    setDraggedNotePage,
    draggedNotePage,
    onDropNotePage,
}: PropTypes) => {
    const [newNote, setNewNote] = useState("");
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [isHovering, setIsHovering] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (notepage) {
            setNotes(notepage.notes.sort((a, b) => a.index - b.index));
        }
    }, [notepage, notes]);

    return (
        <div
            className={`mx-2 border-2  rounded-lg p-4 select-none cursor-pointer ${
                isHovering ? "bg-blue-50" : ""
            } ${notepage.finished ? "border-green-500" : "border-gray-300"}`}
            onMouseDown={(e) => {
                e.stopPropagation();
                setDraggedNotePage(notepage);
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                if (draggedNote) onDrop({ type: "notepage", id: notepage.id });
                if (draggedNotePage) onDropNotePage(notepage.id);
                setIsHovering(false);
            }}
            onMouseEnter={() => {
                if (draggedNote || draggedNotePage) setIsHovering(true);
            }}
            onMouseLeave={() => {
                setIsHovering(false);
            }}
            onClick={(e) => {
                setIsOpen(true);
                e.stopPropagation();
            }}
        >
            <h2>{notepage.name}</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addNewNote(notepage.id, newNote, notepage.notes.length);
                    setNewNote("");
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <input
                    className="bg-gray-200"
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />
            </form>
            <ul>
                {notes.map((n) => (
                    <Note
                        key={n.id}
                        note={n}
                        updateNote={updateNote}
                        deleteNote={deleteNote}
                        setDraggedNote={setDraggedNote}
                        draggedNote={draggedNote}
                        onDrop={onDrop}
                    />
                ))}
            </ul>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    setIsOpen={(isOpen) => setIsOpen(isOpen)}
                >
                    <NotePageModal
                        notepage={notepage}
                        updateNotePage={updateNotePage}
                        onClose={() => setIsOpen(false)}
                        deleteNotePage={deleteNotePage}
                    />
                </Modal>
            )}
        </div>
    );
};

export default NotePage;
