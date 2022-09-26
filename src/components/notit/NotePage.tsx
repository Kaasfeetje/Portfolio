import { Note, NotePage } from "@prisma/client";
import React, { useState } from "react";

type PropTypes = {
    notepage: NotePage & {
        notes: Note[];
    };
    addNewNote: (notepageId: string, note: string, index: number) => void;
};

const NotePage = ({ notepage, addNewNote }: PropTypes) => {
    const [newNote, setNewNote] = useState("");

    return (
        <div>
            <h2>{notepage.name}</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addNewNote(notepage.id, newNote, notepage.notes.length);
                    setNewNote("");
                }}
            >
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                />
            </form>
            <ul>
                {notepage.notes.map((n) => (
                    <li key={n.id}>{n.note}</li>
                ))}
            </ul>
        </div>
    );
};

export default NotePage;
