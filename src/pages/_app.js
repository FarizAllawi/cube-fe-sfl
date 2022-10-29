import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../tailwindcss/style.css'
import NProgress from 'nextjs-progressbar'

function MyApp({ Component, ...props }) {
	return (
    <>
      <NProgress
        color="#87c141"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Component {...props.pageProps} />
      <ToastContainer position='top-center'/>
    </>
	)
}

export default MyApp
