import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';
import Link from "next/link";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const [session] = useSession();
    const router  = useRouter();

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>{post.title} | gNews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{__html: post.content}} 
                    />

                    <div className={styles.continueReading} >
                        Wanna continue reading?
                        <Link href="/">
                            <a>Subscribe now 🤗</a>
                        </Link>
                    </div>

                </article>
            </main>
        </>
    )

}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        // paths predefines static pages to be generated during build
        // what is not here and the fallback is false, will produce an error
        paths: [
            // { params: {slug: 'best-practices-for-using-webhooks'}}
        ],
        // fallbacks manages what browser must do if the static page is not already generated
        // true - allow accessing the content, wainting for the browser to handle missing steps
        // false - err 404 if page not available
        // blocking - will load the content on Next SSR and then send it to browser
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient();
    const response = await prismic.getByUID('posts', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.slice(0,3)),
        updatedAt: new Date(response.last_publication_date).toLocaleString('pt-Br', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    return {
        props: { post },
        redirect: 60 * 30 // 30 minutes
    }
}