import { z } from "zod";
import { Visibility } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";

export const notitRouter = createRouter()
    .query("getAll", {
        async resolve({ ctx }) {
            const noteblocks = await ctx.prisma.noteBlock.findMany({
                where: {
                    OR: [
                        {
                            authorId: ctx.session?.user?.id,
                        },
                        { visibility: Visibility.PUBLIC },
                    ],
                },
            });

            return noteblocks;
        },
    })
    .query("getOne", {
        input: z.string(),
        async resolve({ ctx, input }) {
            const noteblock = await ctx.prisma.noteBlock.findUnique({
                where: {
                    id: input,
                },
                include: {
                    notepages: {
                        include: {
                            notes: true,
                        },
                    },
                },
            });
            return noteblock;
        },
    })
    .middleware(({ ctx, next }) => {
        if (!ctx.session || !ctx.session.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next({
            ctx: {
                ...ctx,
                session: { ...ctx.session, user: ctx.session.user },
            },
        });
    })
    .mutation("create", {
        input: z.object({
            name: z.string(),
            description: z.string().nullish(),
            visibility: z.nativeEnum(Visibility),
        }),
        async resolve({ ctx, input }) {
            const noteblock = await ctx.prisma.noteBlock.create({
                data: {
                    name: input.name,
                    visibility: input.visibility,
                    authorId: ctx.session.user.id,
                    description: input.description,
                    createdAt: new Date(),
                },
            });

            return noteblock;
        },
    })
    .mutation("delete", {
        input: z.string(),
        async resolve({ ctx, input }) {
            const noteblock = await ctx.prisma.noteBlock.findUnique({
                where: {
                    id: input,
                },
            });
            if (!noteblock) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }
            if (noteblock.authorId !== ctx.session.user.id) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            await ctx.prisma.noteBlock.delete({
                where: {
                    id: input,
                },
            });
            return input;
        },
    })
    .mutation("swapNotes", {
        input: z.object({
            noteA: z.string(),
            noteB: z.string(),
        }),
        async resolve({ ctx, input }) {
            const noteA = await ctx.prisma.note.findUnique({
                where: {
                    id: input.noteA,
                },
                include: {
                    notePage: {
                        include: {
                            noteblock: true,
                        },
                    },
                },
            });

            if (
                !noteA ||
                ctx.session.user.id !== noteA.notePage.noteblock.authorId
            ) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const noteB = await ctx.prisma.note.findUnique({
                where: {
                    id: input.noteB,
                },
            });

            if (!noteB) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            const updatedA = await ctx.prisma.note.update({
                where: {
                    id: noteA.id,
                },
                data: {
                    notePageId: noteB.notePageId,
                    index: noteB.index,
                },
            });

            const updatedB = await ctx.prisma.note.update({
                where: {
                    id: noteB.id,
                },
                data: {
                    notePageId: noteA.notePageId,
                    index: noteA.index,
                },
            });

            return { a: updatedA, b: updatedB };
        },
    })
    .mutation("swapNoteToPage", {
        input: z.object({
            noteId: z.string(),
            notepageId: z.string(),
            index: z.number(),
        }),
        async resolve({ ctx, input }) {
            const note = await ctx.prisma.note.findUnique({
                where: {
                    id: input.noteId,
                },
                include: {
                    notePage: {
                        include: {
                            noteblock: true,
                        },
                    },
                },
            });

            if (
                !note ||
                ctx.session.user.id !== note.notePage.noteblock.authorId
            ) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const updatedNote = await ctx.prisma.note.update({
                where: {
                    id: input.noteId,
                },
                data: {
                    notePageId: input.notepageId,
                    index: input.index,
                },
            });

            return {
                oldNotePageId: note.notePageId,
                note: updatedNote,
            };
        },
    })
    .mutation("notepage.create", {
        input: z.object({
            noteblockId: z.string(),
            name: z.string(),
            index: z.number(),
        }),
        async resolve({ ctx, input }) {
            const noteblock = await ctx.prisma.noteBlock.findUnique({
                where: {
                    id: input.noteblockId,
                },
            });

            if (!noteblock || ctx.session.user.id !== noteblock.authorId) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const notepage = await ctx.prisma.notePage.create({
                data: {
                    createdAt: new Date(),
                    finished: false,
                    name: input.name,
                    index: input.index,
                    noteblockId: input.noteblockId,
                },
                include: {
                    notes: true,
                },
            });

            return notepage;
        },
    })
    .mutation("notepage.update", {
        input: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullish(),
            finishDate: z.date().nullish(),
            targetDate: z.date().nullish(),
            finished: z.boolean(),
        }),
        async resolve({ ctx, input }) {
            const notepage = await ctx.prisma.notePage.findUnique({
                where: {
                    id: input.id,
                },
                select: {
                    noteblock: {
                        select: {
                            authorId: true,
                        },
                    },
                },
            });

            if (
                !notepage ||
                ctx.session.user.id !== notepage.noteblock.authorId
            ) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const updatedNotepage = await ctx.prisma.notePage.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...input,
                },
                include: {
                    notes: true,
                },
            });

            return updatedNotepage;
        },
    })
    .mutation("notepage.delete", {
        input: z.string(),
        async resolve({ ctx, input }) {
            const notepage = await ctx.prisma.notePage.findUnique({
                where: {
                    id: input,
                },
                select: {
                    noteblock: {
                        select: {
                            authorId: true,
                        },
                    },
                },
            });

            if (
                !notepage ||
                ctx.session.user.id !== notepage.noteblock.authorId
            ) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            await ctx.prisma.notePage.delete({
                where: {
                    id: input,
                },
            });

            return input;
        },
    })
    .mutation("notepage.note.create", {
        input: z.object({
            note: z.string(),
            index: z.number(),
            notepageId: z.string(),
        }),
        async resolve({ ctx, input }) {
            const notepage = await ctx.prisma.notePage.findUnique({
                where: {
                    id: input.notepageId,
                },
                include: {
                    noteblock: true,
                },
            });

            if (
                !notepage ||
                ctx.session.user.id !== notepage.noteblock.authorId
            ) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const note = await ctx.prisma.note.create({
                data: {
                    note: input.note,
                    finished: false,
                    important: false,
                    index: input.index,
                    notePageId: input.notepageId,
                },
            });

            return note;
        },
    })
    .mutation("notepage.note.update", {
        input: z.object({
            id: z.string(),
            note: z.string(),
            finished: z.boolean(),
            important: z.boolean(),
            index: z.number(),
        }),
        async resolve({ ctx, input }) {
            const note = await ctx.prisma.note.findUnique({
                where: {
                    id: input.id,
                },
                select: {
                    notePage: {
                        select: {
                            noteblock: {
                                select: {
                                    authorId: true,
                                },
                            },
                        },
                    },
                },
            });

            if (
                !note ||
                ctx.session.user.id !== note.notePage.noteblock.authorId
            ) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const updatedNote = await ctx.prisma.note.update({
                where: {
                    id: input.id,
                },
                data: { ...input },
            });

            return updatedNote;
        },
    })
    .mutation("notepage.note.delete", {
        input: z.string(),
        async resolve({ ctx, input }) {
            const note = await ctx.prisma.note.findUnique({
                where: {
                    id: input,
                },
                select: {
                    notePage: {
                        select: {
                            id: true,
                            noteblock: {
                                select: {
                                    authorId: true,
                                },
                            },
                        },
                    },
                },
            });

            if (
                !note ||
                ctx.session.user.id !== note.notePage.noteblock.authorId
            ) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            await ctx.prisma.note.delete({
                where: {
                    id: input,
                },
            });

            return {
                notepageId: note.notePage.id,
                deletedId: input,
            };
        },
    });
