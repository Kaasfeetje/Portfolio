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
    setDraggedNote: (note: NoteType) => void;
    onDrop: (note: NoteType) => void;
    onDropPage: (pageId: string, index: number) => void;
};

const NotePage = ({
    notepage,
    addNewNote,
    updateNote,
    deleteNote,
    updateNotePage,
    deleteNotePage,
    setDraggedNote,
    onDropPage,
    onDrop,
}: PropTypes) => {
    const [newNote, setNewNote] = useState("");
    const [notes, setNotes] = useState<NoteType[]>([]);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (notepage) {
            setNotes(notepage.notes.sort((a, b) => a.index - b.index));
        }
    }, [notepage, notes]);

    return (
        <div
            className="mx-2 border-2 border-gray-300 rounded-lg p-4 "
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDropPage(notepage.id, notepage.notes.length)}
            onClick={() => setIsOpen(true)}
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
                        onDragStart={setDraggedNote}
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
