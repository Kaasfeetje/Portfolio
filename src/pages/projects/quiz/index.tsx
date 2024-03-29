import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../../components/common/header/Header";
import { trpc } from "../../../utils/trpc";

const Quiz: NextPage = () => {
    const { data: session } = useSession();
    const { data, isError, isLoading } = trpc.useQuery(["quiz.getAll"]);
    const deleteQuizMutation = trpc.useMutation("quiz.deleteOne",{
        
    });

    if(deleteQuizMutation.isSuccess){
        
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error...</div>;
    }

    return (
        <div className="bg-blue-50 w-screen h-screen">
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="w-full bg-blue-100 border-2 border-blue-500 rounded-lg p-8 text-blue-900 mt-16 md:w-2/3 md:mx-auto lg:w-1/2">
                <div className="flex justify-between align-middle mb-4">
                    <h1 className="text-xl font-bold ">Quizzes</h1>

                    <Link href="/projects/quiz/new">
                        <button className="border-blue-500 rounded-lg border-2 px-2 font-semibold">
                            Create Quiz
                        </button>
                    </Link>
                </div>
                {data?.map((quiz) => (
                    <div
                        key={quiz.id}
                        className="border-b-2 border-blue-500 mb-4 flex justify-between items-bottom"
                    >
                        <h2>
                            <Link href={`/projects/quiz/${quiz.id}`}>
                                {quiz.name}
                            </Link>
                        </h2>
                        {quiz.authorId === session?.user?.id && (
                            <button
                                onClick={() =>
                                    deleteQuizMutation.mutate(quiz.id)
                                }
                                className="text-red-500"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Quiz;
