import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div style={{fontSize: 30, marginTop: 20}}>
        This page doesn't exist. Go <Link to="/">home</Link>
    </div>
  )
}

export default NotFound
