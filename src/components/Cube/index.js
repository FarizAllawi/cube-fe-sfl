import Image from 'next/image'
import React, { useEffect } from 'react'
import CubeLogo from '/public/images/pictures/cube-logo.png'

export default function Cube() {
  return (
    <div className="box">
        <div className="content">
            <div className="singleboxes">

                <div className="front">
                    <div className="singlebox">
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className="back">
                    <div className="singlebox">
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className="left">
                    <div className="singlebox">
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className="right">
                    <div className="singlebox">
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className="top">
                    <div className="singlebox">
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

                <div className="bottom">
                    <div className="singlebox">
                        <Image src={CubeLogo} width={150} height={150} alt="cube-logo" />
                    </div>
                </div>

            </div>

        </div>
    </div>
  )
}