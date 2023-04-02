import React from 'react'

import greenChat from '../../assets/green-chat.png'
import pinkChat from '../../assets/pink-chat.png'
import itemBall from '../../assets/item-ball.png'
import itemStar from '../../assets/item-star.png'
import itemStar2 from '../../assets/item-star2.png'

export default function Device(
	props: React.HtmlHTMLAttributes<HTMLDivElement>
) {
	return (
		<div className="relative lg:rotate-6" {...props}>
			<img
				src={greenChat}
				className="absolute right-0 z-10 translate-x-1/2 top-0 -translate-y-1/2 w-[195px]"
			/>
			<img className="w-72" src={require('../../assets/device.png')} />
			<img
				src={pinkChat}
				className="absolute bottom-0 z-10 left-0 -translate-x-1/2 w-[195px]"
			/>
			<img
				src={itemBall}
				className="absolute w-6 -top-2 -left-[10%] lg:-left-[20%]"
			/>
			<img
				src={itemStar}
				className="absolute  w-6 top-10   left-[110%] lg:left-[120%]"
			/>
			<img
				src={itemStar2}
				className="absolute  w-6 top-50 right-[110%] lg:right-[130%]"
			/>
		</div>
	)
}
