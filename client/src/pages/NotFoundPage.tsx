import {Link} from 'react-router-dom'
import {FaExclamationTriangle} from 'react-icons/fa'

const NotFoundPage = () => {
  return(
    <>
   <section className="text-center p-4 text-white flex flex-col justify-center items-center h-full">
    <img src="https://cdn.oaistatic.com/assets/favicon-o20kmmos.svg" className="block mx-auto w-20 mb-4" />
    <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
    <img src="/notfound.png" className="w-80" />
      <p className="text-xl mb-5">This page does not exist</p>
      <Link
        to="/"
        className="text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4"
        >Go Back</Link
      >
    </section>
    </>
    )
}

export default NotFoundPage