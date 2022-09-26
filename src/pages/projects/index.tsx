import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header/Header";

const Projects: NextPage = () => {
    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="mt-8 flex">
                <div className="m-2 p-2 border-gray-600 border-2">
                    <Link href="/projects/calculator">
                        <h3>Calculator</h3>
                    </Link>
                    <p>A simple calculator app</p>
                </div>
                <div className="m-2 p-2 border-gray-600 border-2">
                    <Link href="/projects/quiz">
                        <h3>Quiz</h3>
                    </Link>
                    <p>A basic quiz app</p>
                </div>
                <div className="m-2 p-2 border-gray-600 border-2">
                    <Link href="/projects/rock-paper-scissors">
                        <h3>Rock Paper Scissors</h3>
                    </Link>
                    <p>Rock paper scissors with CSS animations</p>
                </div>
                <div className="m-2 p-2 border-gray-600 border-2">
                    <Link href="/projects/notit">
                        <h3>Notit</h3>
                    </Link>
                    <p>A place to keep your notes</p>
                </div>
            </main>
        </>
    );
};

export default Projects;
