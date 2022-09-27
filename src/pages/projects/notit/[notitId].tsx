import { Note, NoteBlock, NotePage as NotePageType } from "@prisma/client";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Header from "../../../components/common/header/Header";
import Modal from "../../../components/common/modal/Modal";
import NoteBlockModal from "../../../components/notit/NoteBlockModal";
import NotePage from "../../../components/notit/NotePage";
import { trpc } from "../../../utils/trpc";

const Notit: NextPage = () => {
    const router = useRouter();
    const notitId = router.query["notitId"] as string;
    const { data, isError, isLoading } = trpc.useQuery([
        "notit.getOne",
        notitId,
    ]);

    const updateNoteBlockMutation = trpc.useMutation("notit.update");
    const deleteNoteBlockMutation = trpc.useMutation("notit.delete");
    const swapNotesMutation = trpc.useMutation("notit.swapNotes");
    const swapNoteToPageMutation = trpc.useMutation("notit.swapNoteToPage");
    const swapNotePageMutation = trpc.useMutation("notit.swapNotePage");
    const createNotePageMutation = trpc.useMutation("notit.notepage.create");
    const updateNotePageMutation = trpc.useMutation("notit.notepage.update");
    const deleteNotePageMutation = trpc.useMutation("notit.notepage.delete");
    const createNoteMutation = trpc.useMutation("notit.notepage.note.create");
    const updateNoteMutation = trpc.useMutation("notit.notepage.note.update");
    const deleteNoteMutation = trpc.useMutation("notit.notepage.note.delete");

    const [isOpen, setIsOpen] = useState(false);

    const [noteblock, setNoteBlock] = useState<NoteBlock>();

    const [newNotepage, setNewNotepage] = useState("");
    const [notepages, setNotepages] = useState<
        (NotePageType & {
            notes: Note[];
        })[]
    >([]);

    const [draggedNote, setDraggedNote] = useState<Note | undefined>();
    const [draggedNotePage, setDraggedNotePage] = useState<
        NotePageType | undefined
    >();

    const addNewNote = async (
        notepageId: string,
        note: string,
        index: number
    ) => {
        const createdNote = await createNoteMutation.mutateAsync({
            index,
            note,
            notepageId,
        });

        setNotepages(
            notepages.map((n) => {
                if (n.id !== notepageId) {
                    return n;
                }

                return {
                    ...n,
                    notes: [...n.notes, createdNote],
                };
            })
        );
    };

    const updateNote = async (note: Note) => {
        const updatedNote = await updateNoteMutation.mutateAsync({ ...note });

        setNotepages(
            notepages.map((notepage) => {
                if (notepage.id === updatedNote.notePageId) {
                    return {
                        ...notepage,
                        notes: notepage.notes.map((n) => {
                            if (n.id === updatedNote.id) {
                                return updatedNote;
                            }
                            return n;
                        }),
                    };
                }
                return notepage;
            })
        );
    };

    const deleteNote = async (noteId: string) => {
        const { notepageId, deletedId } = await deleteNoteMutation.mutateAsync(
            noteId
        );

        setNotepages(
            notepages.map((notepage) => {
                if (notepage.id === notepageId) {
                    return {
                        ...notepage,
                        notes: notepage.notes.filter(
                            (note) => note.id !== deletedId
                        ),
                    };
                }
                return notepage;
            })
        );
    };

    const addNotepage = async (e: FormEvent) => {
        e.preventDefault();
        if (!data) {
            return;
        }
        const createdNotePage = await createNotePageMutation.mutateAsync({
            name: newNotepage,
            noteblockId: notitId,
            index: notepages.length,
        });

        setNotepages([...notepages, createdNotePage]);
        setNewNotepage("");
    };

    const updateNotePage = async (notepage: NotePageType) => {
        const updatedNotePage = await updateNotePageMutation.mutateAsync({
            ...notepage,
        });

        setNotepages(
            notepages.map((notepage) => {
                if (notepage.id === updatedNotePage.id) {
                    return updatedNotePage;
                }
                return notepage;
            })
        );
    };

    const deleteNotePage = async (notepageId: string) => {
        const deletedId = await deleteNotePageMutation.mutateAsync(notepageId);

        setNotepages(notepages.filter((notepage) => notepage.id !== deletedId));
    };

    const updateNoteBlock = async (_noteblock: NoteBlock) => {
        const updatedNoteblock = await updateNoteBlockMutation.mutateAsync({
            ..._noteblock,
        });

        setNoteBlock({ ...updatedNoteblock });
    };

    const swapNotes = async (noteA: string, noteB: string | undefined) => {
        //TODO: only pass ids
        if (!noteB) return;

        if (noteA === noteB) return;

        const { a, b } = await swapNotesMutation.mutateAsync({
            noteA,
            noteB,
        });

        setNotepages(
            notepages.map((notepage) => {
                if (
                    a.notePageId === notepage.id &&
                    b.notePageId === notepage.id
                ) {
                    return {
                        ...notepage,
                        notes: notepage.notes.map((n) => {
                            if (n.id === a.id) {
                                return a;
                            }
                            if (n.id === b.id) {
                                return b;
                            }
                            return n;
                        }),
                    };
                }

                if (a.notePageId === notepage.id) {
                    let updatedNotes = [...notepage.notes];
                    updatedNotes = updatedNotes.filter((n) => n.id !== b.id);
                    return {
                        ...notepage,
                        notes: [...updatedNotes, a],
                    };
                }
                if (b.notePageId === notepage.id) {
                    let updatedNotes = [...notepage.notes];
                    updatedNotes = updatedNotes.filter((n) => n.id !== a.id);
                    return {
                        ...notepage,
                        notes: [...updatedNotes, b],
                    };
                }
                return notepage;
            })
        );

        setDraggedNote(undefined);
    };

    const swapNoteToPage = async (note: Note | undefined, pageId: string) => {
        if (!note) return;
        if (note.notePageId === pageId) return;
        const { note: updatedNote, oldNotePageId } =
            await swapNoteToPageMutation.mutateAsync({
                noteId: note.id,
                notepageId: pageId,
            });

        setNotepages(
            notepages.map((notepage) => {
                if (notepage.id === oldNotePageId) {
                    return {
                        ...notepage,
                        notes: notepage.notes.filter(
                            (n) => n.id !== updatedNote.id
                        ),
                    };
                }
                if (notepage.id === updatedNote.notePageId) {
                    return {
                        ...notepage,
                        notes: [...notepage.notes, updatedNote],
                    };
                }

                return notepage;
            })
        );

        setDraggedNote(undefined);
    };

    const swapNotePage = async (
        notepageA: string,
        notepageB: string | undefined
    ) => {
        if (!notepageB) return;
        if (notepageA === notepageB) return;

        const { a, b } = await swapNotePageMutation.mutateAsync({
            notepageA,
            notepageB,
        });

        setNotepages(
            notepages
                .map((n) => {
                    if (a.id === n.id) {
                        return a;
                    }
                    if (b.id === n.id) {
                        return b;
                    }
                    return n;
                })
                .sort((_a, _b) => _a.index - _b.index)
        );
    };

    useEffect(() => {
        //set notepages when data comes in
        if (data) {
            setNotepages(data.notepages);
            setNoteBlock({ ...data });
        }
    }, [data]);

    useEffect(() => {
        //when deleting this noteblock redirect to home
        if (deleteNoteBlockMutation.isSuccess) {
            router.push("/projects/notit");
        }
    }, [deleteNoteBlockMutation.isSuccess, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !noteblock) {
        return <div>Error...</div>;
    }

    return (
        <div
            className="min-h-screen"
            onMouseUp={() => {
                setDraggedNote(undefined);
                setDraggedNotePage(undefined);
            }}
        >
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="overflow-x-auto">
                <h1 onClick={() => setIsOpen(true)}>{noteblock.name}</h1>
                {isOpen && (
                    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                        <NoteBlockModal
                            noteblock={noteblock}
                            updateNoteBlock={updateNoteBlock}
                            deleteNoteBlock={(noteblockId) =>
                                deleteNoteBlockMutation.mutate(noteblockId)
                            }
                            onClose={() => setIsOpen(false)}
                        />
                    </Modal>
                )}
                <hr />
                <div className="flex">
                    {notepages.map((notepage) => (
                        <NotePage
                            key={notepage.id}
                            notepage={notepage}
                            addNewNote={addNewNote}
                            updateNote={updateNote}
                            deleteNote={deleteNote}
                            updateNotePage={updateNotePage}
                            deleteNotePage={deleteNotePage}
                            setDraggedNote={setDraggedNote}
                            draggedNote={draggedNote}
                            onDrop={(drop) => {
                                if (drop.type === "note") {
                                    swapNotes(drop.id, draggedNote?.id);
                                    setDraggedNote(undefined);
                                } else if (drop.type === "notepage") {
                                    swapNoteToPage(draggedNote, drop.id);
                                    setDraggedNote(undefined);
                                }
                            }}
                            setDraggedNotePage={(
                                notepage: NotePageType | undefined
                            ) => {
                                setDraggedNotePage(notepage);
                                console.log("updated", notepage?.name);
                            }}
                            draggedNotePage={draggedNotePage}
                            onDropNotePage={(notepageId) => {
                                swapNotePage(notepageId, draggedNotePage?.id);
                                setDraggedNotePage(undefined);
                            }}
                        />
                    ))}
                    <form onSubmit={addNotepage}>
                        <input
                            placeholder="Notepage..."
                            className="bg-gray-200"
                            type="text"
                            value={newNotepage}
                            onChange={(e) => setNewNotepage(e.target.value)}
                        />
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Notit;
