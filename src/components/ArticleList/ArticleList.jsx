import { Await, useLoaderData, useNavigate, useParams } from 'react-router-dom'
import ArticleCard from '../ArticleCard/ArticleCard'
import classes from './ArticleList.module.scss'
import { ConfigProvider, Pagination } from 'antd'
import { Suspense } from 'react'
function ArticleList() {

  const { page } = useParams()
  const navigate = useNavigate()
  const paginationOnChange = page => {
    navigate(`/articles/${page}`)
  }
  const { articles } = useLoaderData()
  return (
    <div>
      <Suspense fallback={<h2 style={{justifySelf: 'center', marginTop: '20vh' ,height: '90vh'}}>Loading...</h2>}>
        <Await resolve={articles}>
          {resolvedArticles => {
            return (
              <>
                <main className={classes['app-articles']}>
                  {resolvedArticles.articles.map(article => (
                    <ArticleCard key={article.slug} data={article} page={page} />
                  ))}
                </main>
              </>
            )
          }}
        </Await>
      </Suspense>

      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: 'rgba(24, 144, 255, 0)',
              itemBg: '#EBEEF3',
            },
          },
        }}
      >
        <Pagination
          className={classes['app-pagination']}
          current={page}
          total={50}
          onChange={paginationOnChange}
        />
      </ConfigProvider>
    </div>
  )
}

async function getArticles(page) {
  const storedUser = sessionStorage.getItem('user'); 
  const userObject = JSON.parse(storedUser);
  const res = await fetch(
    `https://blog-platform.kata.academy/api/articles?limit=${5}&offset=${(page - 1) * 5}`,
    {headers: userObject ? {
      Authorization: `Token ${userObject.token}`,
    } : {}}
  )
  return res.json()
}

const articleListLoader = async ({ params }) => {
  const articles = getArticles(params.page)
  return {
    articles,
  }
}

export { ArticleList, articleListLoader }
