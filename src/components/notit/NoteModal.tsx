import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Note } from "@prisma/client";
import React, { FormEvent, useEffect, useState } from "react";

type PropTypes = {
    note: Note;
    updateNote: (
        note: Note,
        swapWith: string | undefined,
        moveTo: string | undefined
    ) => void;
    deleteNote: (noteId: string) => void;
    onClose: () => void;
    swapNoteOptions: { id: string; note: string }[];
    swapNotePageOptions: { id: string; name: string }[];
};

const NoteModal = ({
    note,
    updateNote,
    deleteNote,
    onClose,
    swapNoteOptions,
    swapNotePageOptions,
}: PropTypes) => {
    const [_note, _setNote] = useState("");
    const [_finished, _setFinished] = useState(false);
    const [_important, _setImportant] = useState(false);
    const [swapWith, setSwapWith] = useState<string | undefined>(undefined);
    const [moveTo, setMoveTo] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (note) {
            _setNote(note.note);
            _setFinished(note.finished);
            _setImportant(note.important);
        }
    }, [note]);

    const onSave = (e: FormEvent) => {
        e.preventDefault();
        if (
            note.finished !== _finished ||
            note.important !== _important ||
            note.note !== _note ||
            swapWith ||
            moveTo
        ) {
            updateNote(
                {
                    id: note.id,
                    finished: _finished,
                    important: _important,
                    index: note.index,
                    note: _note,
                    notePageId: note.notePageId,
                },
                swapWith,
                moveTo
            );
        }

        onClose();
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-full mx-4 p-4 rounded-lg bg-white z-10 cursor-default md:w-1/2 lg:w-1/4"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                    Updating Note: {note.note}
                </h2>
                <button
                    onClick={() => deleteNote(note.id)}
                    className="w-6 text-red-500"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <form onSubmit={onSave}>
                <div className="flex items-center mb-4">
                    <label htmlFor="note">Note: </label>
                    <input
                        className="bg-gray-200 p-2 rounded-lg flex-1 ml-4"
                        id="note"
                        type="text"
                        value={_note}
                        onChange={(e) => _setNote(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="finished">Finished: </label>
                    <input
                        className="ml-2"
                        id="finished"
                        type="checkbox"
                        checked={_finished}
                        onChange={(e) => _setFinished(e.target.checked)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="important">Important: </label>
                    <input
                        className="ml-2"
                        id="important"
                        type="checkbox"
                        checked={_important}
                        onChange={(e) => _setImportant(e.target.checked)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="swapwith">Swap with: </label>
                    <select
                        id="swapwith"
                        className="ml-2 w-24"
                        value={swapWith}
                        onChange={(e) => setSwapWith(e.target.value)}
                    >
                        <option value={undefined}>None</option>
                        {swapNoteOptions.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.note}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="moveto">Move to note page: </label>
                    <select
                        id="moveto"
                        className="ml-2 w-24"
                        value={moveTo}
                        onChange={(e) => setMoveTo(e.target.value)}
                    >
                        <option value={undefined}>None</option>
                        {swapNotePageOptions.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-evenly items-center mt-4">
                    <button
                        className="border-2 border-gray-200 rounded-lg px-4 py-1 bg-gray-200 font-bold text-gray-600"
                        type="button"
                        onClick={() => onClose()}
                    >
                        Cancel
                    </button>
                    <button
                        className="border-2 border-blue-500 rounded-lg px-4 py-1 bg-blue-500 font-bold text-gray-100"
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoteModal;
