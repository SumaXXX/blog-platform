import classes from './EditArticle.module.scss'
import { Button } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState, useEffect, Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import { useSelector } from 'react-redux'

const schema = yup.object().shape({
  title: yup.string().min(1).max(200).required(),
  shortDescription: yup.string().min(1).max(200).required(),
  text: yup.string().min(1).max(1300).required(),
  tags: yup.array().of(yup.string().min(0).max(16).nullable()).nullable(),
})

function EditArticle() {
  const { article } = useLoaderData()
  const { user } = useSelector(state => state.BlogPlatformApp)
  const [slug, setSlug] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const MAX_TAGS = 8
  const [tags, setTags] = useState([''])
  const [isFormReady, setIsFormReady] = useState(false); 
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      shortDescription: '',
      text: '',
      tags: [''],
    },
      mode: 'onChange',
  })

  const updateArticle = async (article, slug) => { 
    const url = `https://blog-platform.kata.academy/api/articles/${slug}`; 
    console.log(tags)
    const data = {
      article: {
        title: article.title,
        description: article.shortDescription,
        body: article.text,
        tagList: tags, 
      },
    };

    const response = await fetch(url, {
      method: 'PUT', 
      headers: {
        Authorization: `Token ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 422) {
      throw new Error(`Try again! status: ${response.status}`);
    }
  };


  const addTag = () => {
    if (tags.length < MAX_TAGS) {
      setTags([...tags, ''])
      setErrorMessage('')
    } else {
      setErrorMessage('max tags count is 8')
    }
  }

  const removeTag = indexToRemove => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  useEffect(() => {
    const setInitialValues = async () => {
      const {article: articleToEdit} = await article; 
      setSlug(articleToEdit.slug)
      const initialTags = articleToEdit.tagList || [];
      setTags(initialTags);
      console.log(initialTags)
      reset({
        title: articleToEdit.title,
        shortDescription: articleToEdit.description,
        text: articleToEdit.body,
        tags: initialTags,
      });

      setIsFormReady(true); 
    };

    setInitialValues();
  }, [article, reset, setValue]);

  const submitForm = async data => {
    const filteredTags = data.tags ? data.tags.filter(tag => tag && tag.trim() !== '') : []

    const articleData = {
      ...data,
      tags: filteredTags,
    }
    console.log(filteredTags)
    updateArticle(articleData, slug)
  }

  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <Await resolve={article}>
        {() => {
          return (
            <main className={classes['article-body']}>
              <h3>Edit Article</h3>
              {isFormReady ? (
              <form onSubmit={handleSubmit(submitForm)} className={classes['login-page-form']}>
                <p className={classes['label']}>Title</p>
                <input
                  className={errors.title?.message ? classes['input--error'] : classes['input']}
                  type="text"
                  name="title"
                  placeholder={`Title`}
                  {...register('title')}
                />
                <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.title?.message}</span>

                <p className={classes['label']}>Short description</p>
                <input
                  className={
                    errors.shortDescription?.message ? classes['input--error'] : classes['input']
                  }
                  type="text"
                  name="shortDescription"
                  placeholder={`Short description`}
                  {...register('shortDescription')}
                />
                <span style={{ color: 'rgba(245, 34, 45, 1)' }}>
                  {errors.shortDescription?.message}
                </span>

                <p className={classes['label']}>Text</p>
                <textarea
                  rows="4"
                  cols="50"
                  className={
                    errors.text?.message ? classes['text-input--error'] : classes['text-input']
                  }
                  type="text"
                  name="text"
                  placeholder={`Text`}
                  {...register('text')}
                />
                <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.text?.message}</span>

                <p className={classes['label']}>Tags</p>
                {errorMessage && (
                  <span style={{ color: 'rgba(25, 34, 45, 1)', marginBottom: 12 }}>
                    {errorMessage}
                  </span>
                )}
                {tags.map((tag, index) => (
                  <div key={index}>
                    <input
                      className={
                        errors.tags?.message ? classes['tags-input--error'] : classes['tags-input']
                      }
                      type="text"
                      name={`tags[${index}]`}
                      placeholder={`tag`}
                      value={tag}
                      onChange={e => {
                        console.log(tags)
                        const newTags = [...tags]
                        console.log(newTags)

                        newTags[index] = e.target.value
                        setTags(newTags)
                      }}
                    />
                    <Button
                      style={{ marginLeft: 16 }}
                      onClick={() => removeTag(index)}
                      type="primary"
                      danger
                      ghost
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.tags?.message}</span>

                <Button onClick={addTag} style={{ width: 136 }} color="primary" variant="outlined">
                  Add tag
                </Button>

                <button type="submit" className={classes['submit']}>
                  <span style={{ fontSize: 16, color: '#fff' }}>Send</span>
                </button>
              </form>
               ) : (
                <h2>Loading form...</h2>
              )}
            </main>
          )
        }}
      </Await>
    </Suspense>
  )
}

async function getArticle(slug) {
  const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`)
  return res.json()
}

const editArticleLoader = async ({ params }) => {
  const article = getArticle(params.slug)
  return {
    article,
  }
}

export { EditArticle, editArticleLoader }