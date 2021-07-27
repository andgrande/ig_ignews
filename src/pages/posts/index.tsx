import Head from 'next/head';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import styles from './styles.module.scss';
import { getPrismicClient } from '../../services/prismic';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostsProps {
    posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | gNews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map(post => (
                        <a href="#" key={post.slug}>
                        <time>{post.updatedAt}</time>
                        <strong>{post.title}</strong>
                        <p>{post.excerpt}</p>
                    </a>
                    ))}
                    
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.Predicates.at('document.type', 'posts'),
    ],
        {
            fetch: ['posts.title', 'posts.content'],
            pageSize: 10,
            // orderings: '[my.posts.last_publication_date desc]',
        }
    )

    // console.log(JSON.stringify(response, null, 2))

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleString('pt-Br', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            })
        }
    })

    return {
        props: { posts }
    }
}