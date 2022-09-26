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
    });
