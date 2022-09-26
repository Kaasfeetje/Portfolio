import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const quizRouter = createRouter()
    .query("getAll", {
        async resolve({ ctx }) {
            const quizes = await ctx.prisma.quiz.findMany();
            return quizes;
        },
    })
    .query("getOne", {
        input: z.string(),
        async resolve({ ctx, input }) {
            const quiz = await ctx.prisma.quiz.findUnique({
                where: {
                    id: input,
                },
                select: {
                    name: true,
                    author: true,
                    questions: {
                        select: {
                            id: true,
                            question: true,
                            options: true,
                        },
                    },
                },
            });
            return quiz;
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
            questions: z.array(
                z.object({
                    question: z.string(),
                    options: z.array(
                        z.object({
                            option: z.string(),
                            answer: z.boolean(),
                        })
                    ),
                })
            ),
        }),

        async resolve({ ctx, input }) {
            const quiz = await ctx.prisma.quiz.create({
                data: {
                    name: input.name,
                    authorId: ctx.session.user.id,
                },
            });

            await Promise.all(
                input.questions.map(async (q) => {
                    return await ctx.prisma.quizQuestion.create({
                        data: {
                            quizId: quiz.id,
                            question: q.question,
                            options: {
                                createMany: {
                                    data: q.options.map((option) => ({
                                        option: option.option,
                                        answer: option.answer,
                                    })),
                                },
                            },
                        },
                    });
                })
            );

            return quiz;
        },
    })
    .mutation("deleteOne", {
        input: z.string(),
        async resolve({ ctx, input }) {
            const quiz = await ctx.prisma.quiz.findUnique({
                where: {
                    id: input,
                },
            });

            if (!quiz) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            if (quiz.authorId === ctx.session.user.id) {
                await ctx.prisma.quiz.delete({
                    where: {
                        id: input,
                    },
                });
            }
            return input;
        },
    });
