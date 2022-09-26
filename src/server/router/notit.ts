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
                select: {
                    author: true,
                    description: true,
                    id: true,
                    name: true,
                    visibility: true,
                    notepages: {
                        select: {
                            createdAt: true,
                            description: true,
                            finishDate: true,
                            finished: true,
                            id: true,
                            name: true,
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
    });
