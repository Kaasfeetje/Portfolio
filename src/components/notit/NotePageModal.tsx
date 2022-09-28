import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NotePage } from "@prisma/client";
import React, { FormEvent, useEffect, useState } from "react";

type PropTypes = {
    notepage: NotePage;
    updateNotePage: (notepage: NotePage, swapWith: string | undefined) => void;
    deleteNotePage: (notepageId: string) => void;
    onClose: () => void;
    swapNotepageOptions: { id: string; name: string }[];
};

const NotePageModal = ({
    notepage,
    updateNotePage,
    deleteNotePage,
    onClose,
    swapNotepageOptions,
}: PropTypes) => {
    const [_name, _setName] = useState("");
    const [_description, _setDescription] = useState("");
    const [_targetDate, _setTargetDate] = useState<string | undefined>(
        undefined
    );
    const [_finishDate, _setFinishDate] = useState<string | undefined>(
        undefined
    );
    const [_finished, _setFinished] = useState(false);
    const [swapWith, setSwapWith] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (notepage) {
            _setName(notepage.name);
            _setDescription(notepage.description || "");
            _setTargetDate(notepage.targetDate?.toString() || undefined);
            _setFinishDate(notepage.finishDate?.toString() || undefined);
            _setFinished(notepage.finished);
        }
    }, [notepage]);

    const onSave = (e: FormEvent) => {
        e.preventDefault();
        updateNotePage(
            {
                id: notepage.id,
                createdAt: notepage.createdAt,
                description: _description,
                finishDate: _finishDate ? new Date(_finishDate) : null,
                targetDate: _targetDate ? new Date(_targetDate) : null,
                finished: _finished,
                index: notepage.index,
                name: _name,
                noteblockId: notepage.noteblockId,
            },
            swapWith
        );
        onClose();
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-full mx-4 p-4 rounded-lg bg-white z-10 md:w-1/2 lg:w-1/4"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                    Update Note Page:{" "}
                    <span className="font-normal">{notepage.name}</span>
                </h2>
                <button
                    onClick={() => deleteNotePage(notepage.id)}
                    className="w-6 text-red-500"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
            <form onSubmit={onSave}>
                <div className="flex items-center mb-4">
                    <label htmlFor="name">Name: </label>
                    <input
                        className="bg-gray-200 p-2 rounded-lg flex-1 ml-4"
                        id="name"
                        type="text"
                        value={_name}
                        onChange={(e) => _setName(e.target.value)}
                    />
                </div>
                <div className="flex items-center mb-4">
                    <label htmlFor="description">Description: </label>
                    <input
                        className="bg-gray-200 p-2 rounded-lg flex-1 ml-4"
                        id="description"
                        type="text"
                        value={_description}
                        onChange={(e) => _setDescription(e.target.value)}
                    />
                </div>
                <div className="flex items-center mb-4">
                    <label htmlFor="finished">Finished: </label>
                    <input
                        className="ml-2"
                        id="finished"
                        type="checkbox"
                        checked={_finished}
                        onChange={(e) => {
                            _setFinished(e.target.checked);
                            if (e.target.checked === true) {
                                _setFinishDate(new Date().toString());
                            } else {
                                _setFinishDate(undefined);
                            }
                        }}
                    />
                </div>
                <div className="flex items-center mb-4">
                    <label htmlFor="targetdate">Target Date: </label>
                    <input
                        className="ml-2"
                        id="targetdate"
                        type="date"
                        value={_targetDate?.toString()}
                        onChange={(e) => _setTargetDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center mb-4">
                    <label htmlFor="swapwith">Swap with: </label>
                    <select
                        className="ml-2 w-24"
                        id="swapwith"
                        value={swapWith}
                        onChange={(e) => setSwapWith(e.target.value)}
                    >
                        <option value={undefined}>None</option>
                        {swapNotepageOptions.map((o) => (
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

export default NotePageModal;
