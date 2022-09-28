import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NoteBlock, Visibility } from "@prisma/client";
import React, { FormEvent, useEffect, useState } from "react";

type PropTypes = {
    noteblock: NoteBlock;
    updateNoteBlock: (noteblock: NoteBlock) => void;
    deleteNoteBlock: (noteblockId: string) => void;
    onClose: () => void;
};

const NoteBlockModal = ({
    noteblock,
    updateNoteBlock,
    deleteNoteBlock,
    onClose,
}: PropTypes) => {
    const [_name, _setName] = useState("");
    const [_description, _setDescription] = useState("");
    const [_visibility, _setVisibility] = useState<Visibility>(
        Visibility.PRIVATE
    );

    useEffect(() => {
        if (noteblock) {
            _setName(noteblock.name);
            _setDescription(noteblock.description || "");
            _setVisibility(noteblock.visibility);
        }
    }, [noteblock]);

    const onSave = (e: FormEvent) => {
        e.preventDefault();
        updateNoteBlock({
            ...noteblock,
            name: _name,
            description: _description,
            visibility: _visibility,
        });
        onClose();
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-full mx-4 p-4 rounded-lg bg-white z-10 md:w-1/2 lg:w-1/4"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                    Updating Noteblock: {noteblock.name}
                </h2>
                <button
                    onClick={() => deleteNoteBlock(noteblock.id)}
                    className="w-6 text-red-500"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <form onSubmit={onSave}>
                <div className="mb-4">
                    <label htmlFor="name">Name: </label>
                    <input
                        className="bg-gray-200 p-2 rounded-lg flex-1 ml-4"
                        id="name"
                        type="text"
                        value={_name}
                        onChange={(e) => _setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description">Description: </label>
                    <input
                        className="bg-gray-200 p-2 rounded-lg flex-1 ml-4"
                        id="description"
                        type="text"
                        value={_description}
                        onChange={(e) => _setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="visibility">Visibility: </label>
                    <select
                        id="visibility"
                        value={_visibility}
                        onChange={(e) =>
                            _setVisibility(e.target.value as Visibility)
                        }
                    >
                        <option value={Visibility.PUBLIC}>Public</option>
                        <option value={Visibility.PRIVATE}>Private</option>
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

export default NoteBlockModal;
