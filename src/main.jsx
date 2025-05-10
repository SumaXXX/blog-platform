import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/index.js'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import { articleListLoader, ArticleList } from './components/ArticleList/ArticleList.jsx'
import { Article, articleLoader } from './components/Article/Article.jsx'
import { Provider } from 'react-redux'
import RegisterPage from './components/RegisterPage/RegisterPage.jsx'
import LoginPage from './components/LoginPage/LoginPage.jsx'
import Profile from './components/Profile/Profile.jsx'
import NewArticle from './components/NewArticle/NewArticle.jsx'
import { EditArticle, editArticleLoader } from './components/EditArticle/EditArticle.jsx'
import NotFound from './components/NotFound/NotFound.jsx'
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFound />}>
      <Route index element={<ArticleList />} loader={articleListLoader} />
      <Route path="articles/" element={<ArticleList />} loader={articleListLoader} />
      <Route path="articles/:page" element={<ArticleList />} loader={articleListLoader} />
      <Route path="articles/:page/:slug" element={<Article />} loader={articleLoader} />
      <Route
        path="articles/:page/:slug/edit"
        element={<EditArticle />}
        loader={editArticleLoader}
      />
      <Route path="sign-up" element={<RegisterPage />} />
      <Route path="sign-in" element={<LoginPage />} />
      <Route path="profile" element={<Profile />} />
      <Route
        path="new-article"
        element={
          <PrivateRoute>
            <NewArticle />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
