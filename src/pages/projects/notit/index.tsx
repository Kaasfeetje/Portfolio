import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../../../components/common/header/Header";

const Notit: NextPage = () => {
    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="">
                <Link href="/projects/notit/new">Create Note Block</Link>
            </main>
        </>
    );
};

export default Notit;