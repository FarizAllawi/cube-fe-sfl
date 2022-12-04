import Image from 'next/image'
import React, { useEffect } from 'react'
import styles from '/styles/components/Cube.module.css'
import CubeLogo from '/public/images/pictures/cube-logo.png'

export default function Cube() {
  return (
    <div className={styles.box}>
        <div className={styles.content}>
            <div className={styles.singleboxes}>

                <div className={styles.front}>
                    <div className={styles.singlebox}>
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className={styles.back}>
                    <div className={styles.singlebox}>
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className={styles.left}>
                    <div className={styles.singlebox}>
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className={styles.right}>
                    <div className={styles.singlebox}>
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className={styles.top}>
                    <div className={styles.singlebox}>
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.singlebox}>
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

            </div>

        </div>
    </div>
  )
}