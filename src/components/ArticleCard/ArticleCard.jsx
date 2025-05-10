import { Avatar, Button, Popconfirm } from 'antd'
import classes from './ArticleCard.module.scss'
import { HeartOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useSelector } from 'react-redux'
import { useState } from 'react'

function ArticleCard({ data, page, isInArticle }) {
  const [favorited, setFavorited] = useState(data.favorited)
  const [likes, setLikes] = useState(data.favoritesCount)

  const { user } = useSelector(state => state.BlogPlatformApp)
  const navigate = useNavigate()
  const deleteArticle = async (token, slug) => {
    const url = `https://blog-platform.kata.academy/api/articles/${slug}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (response.status === 422) {
      throw new Error(`${response.status}`)
    }
    // const res = await response.json()
  }

  const handleLikeArticle = async (token, slug) => {
    const url = `https://blog-platform.kata.academy/api/articles/${slug}/favorite`
    favorited && likes === 0 ? setLikes(0) : favorited && likes > 0 ? setLikes(prev => prev - 1) : setLikes(prev => prev + 1)
    setFavorited(prev => !prev)
    const response = await fetch(url, {
      method: favorited ? 'DELETE' : 'POST',

      headers: {
        Authorization: `Token ${token}`,
      },
    })
    if (response.status === 422) {
      throw new Error(`${response.status}`)
    }
    // const res = await response.json()
  }

  return (
    <article
      className={
        isInArticle ? classes['article-card-body--in-article'] : classes['article-card-body']
      }
    >
      <main className={classes['text-fix']} style={{ width: 750 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
          {isInArticle ? (
            <h5 style={{ marginRight: 6 }}>{data.title}</h5>
          ) : (
            <Link
              className={classes['article-card-title']}
              to={`/articles/${!page ? 1 : page}/${data.slug}`}
            >
              {data.title}
            </Link>
          )}
          <HeartOutlined
            onClick={
              user
                ? () => {
                    handleLikeArticle(user.token, data.slug)
                  }
                : () => {}
            }
            className={
              !user
                ? classes['article-card-like--disabled']
                : favorited
                  ? classes['article-card-liked']
                    : classes['article-card-like']
            }
          />
          <span style={{ marginLeft: 5, fontWeight: 350, fontSize: 12 }}>{likes}</span>
        </div>
        <section className={classes['article-card-tags']}>
          {data.tagList.map(tag => {
            if (tag.length)
              return (
                <Button
                  key={Math.random()}
                  className={classes['article-card-tag']}
                  color="default"
                  size="small"
                  variant="outlined"
                >
                  {tag}
                </Button>
              )
          })}
        </section>
        <section className={classes['article-card-description']}>{data.description}</section>
      </main>
      <div style={{ marginRight: 16 }}>
        <section className={classes['article-card-avatar-block']}>
          <div>
            <h5 style={{ padding: 0, margin: 0 }}>{data.author.username}</h5>
            <p style={{ fontSize: 12, padding: 0, margin: 0, width: 88 }}>
              {format(data.createdAt, 'MMMM d, yyyy')}
            </p>
          </div>
          <Avatar src={data.author.image} />
        </section>
        {user && isInArticle && (
          <div style={{ marginTop: 10 }}>
            <Popconfirm
              title="Delete the article"
              description="Are you sure to delete this article?"
              onConfirm={() => {
                deleteArticle(user.token, data.slug)
                navigate(`/articles/${page}`)
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
              placement={'right'}
            >
              <Button type="primary" size="middle" danger ghost>
                Delete
              </Button>
            </Popconfirm>

            <Link to={`/articles/${page}/${data.slug}/edit`}>
              <Button style={{ marginLeft: 10 }} size="middle" color="cyan" variant="outlined">
                Edit
              </Button>
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}

export default ArticleCard
