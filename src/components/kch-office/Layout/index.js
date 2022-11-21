import propTypes from 'prop-types'
import Head from "next/head"

import Navbar from "components/kch-office/Navbar"

export default function Layout(props) {

    const { title } = props

    return (
        <>
            <Head>
                <title>{title !== '' && title !== undefined ? title : 'KCH OFFICE'}</title>
            </Head>
            <Navbar />
            <div className="w-screen h-screen max-h-screen flex flex-col select-none px-6 lg:px-12 pt-20 pb-2 2xl:pt-20">
                {props.children}
            </div>
        </>
    )
}

Layout.propTypes = {
    title: propTypes.string,
    children: propTypes.node.isRequired
}