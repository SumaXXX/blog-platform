import classes from './NewArticle.module.scss'
import { Button } from 'antd'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const schema = yup.object().shape({
  title: yup.string().min(1).max(200).required(),
  shortDescription: yup.string().min(1).max(200).required(),
  text: yup.string().min(1).max(1300).required(),
  tags: yup.array().of(yup.string().min(0).max(16).nullable()).nullable(),
})

function NewArticle() {
  const { user } = useSelector(state => state.BlogPlatformApp)

  const [errorMessage, setErrorMessage] = useState('')
  const MAX_TAGS = 8
  const [tags, setTags] = useState([''])
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tags: [''],
    },
  })

  const addArticle = async article => {
    const url = 'https://blog-platform.kata.academy/api/articles'

    const data = {
      article: {
        title: article.title,
        description: article.shortDescription,
        body: article.text,
        tagList: article.tags
        ,
      },
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.status === 422) {
      throw new Error(`Try again! status: ${response.status}`)
    }
    console.log(await response.json()) 
  }

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
    setValue('tags', tags)
  }, [tags, setValue])

  const submitForm = async data => {
    const filteredTags = data.tags ? data.tags.filter(tag => tag && tag.trim() !== '') : []

    const articleData = {
      ...data,
      tags: filteredTags,
    }
    addArticle(articleData)
  }

  return (
    <main className={classes['article-body']}>
      <h3>Create New Article</h3>
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
          className={errors.shortDescription?.message ? classes['input--error'] : classes['input']}
          type="text"
          name="shortDescription"
          placeholder={`Short description`}
          {...register('shortDescription')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.shortDescription?.message}</span>

        <p className={classes['label']}>Text</p>
        <textarea
          rows="4"
          cols="50"
          className={errors.text?.message ? classes['text-input--error'] : classes['text-input']}
          type="text"
          name="text"
          placeholder={`Text`}
          {...register('text')}
        />
        <span style={{ color: 'rgba(245, 34, 45, 1)' }}>{errors.text?.message}</span>

        <p className={classes['label']}>Tags</p>
        {errorMessage && <span style={{ color: 'rgba(25, 34, 45, 1)', marginBottom: 12 }}>{errorMessage}</span>}
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
                const newTags = [...tags]
                newTags[index] = e.target.value
                setTags(newTags)
              }}
            />
            <Button style={{marginLeft: 16}} onClick={() => removeTag(index)} type="primary" danger ghost>
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
    </main>
  )
}

export default NewArticle
