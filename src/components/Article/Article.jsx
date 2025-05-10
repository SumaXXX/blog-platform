import { Await, useLoaderData, useParams } from 'react-router-dom'
import ArticleCard from '../ArticleCard/ArticleCard'
import classes from './Article.module.scss'
import { Suspense } from 'react'
import Markdown from 'markdown-to-jsx'
function Article() {
  const { page } = useParams()

  const { article } = useLoaderData()

  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <Await resolve={article}>
        {resolvedArticle => {
          return (
            <>
              <article className={classes['article-head']}>
                <ArticleCard
                  key={resolvedArticle.article.slug}
                  data={resolvedArticle.article}
                  isInArticle={true}
                  page={page}
                />
              </article>

              <main className={classes['article-body']}>
                <Markdown>{resolvedArticle.article.body}</Markdown>
              </main>
            </>
          )
        }}
      </Await>
    </Suspense>
  )
}

async function getArticle(slug) {
  const storedUser = sessionStorage.getItem('user'); 
  const userObject = JSON.parse(storedUser);
  const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`,
    {headers: userObject ? {
      Authorization: `Token ${userObject.token}`,
    } : {}})
    if (!res.ok) throw new Response('', {status: res.status, statusText: 'Not found'})
  return res.json()
}

const articleLoader = async ({ params }) => {
  const article = getArticle(params.slug)

  return {
    article,
  }
}

export { Article, articleLoader }
