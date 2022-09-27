import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../../../components/common/header/Header";
import { trpc } from "../../../utils/trpc";

const Notit: NextPage = () => {
    const { data, isError, isLoading } = trpc.useQuery(["notit.getAll"]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data) {
        return <div>Error...</div>;
    }

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
                <div>
                    {data.map((noteblock) => (
                        <div key={noteblock.id}>
                            <Link href={`/projects/notit/${noteblock.id}`}>
                                {noteblock.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Notit;
