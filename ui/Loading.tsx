import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Loading = () => {//loading skeleton anstyliwh 3la hsab sidenavbar wlomepage dima, but tansaliwhom ...
	return (
		<>
			<SkeletonTheme highlightColor="#444">
				<Skeleton
					count={5}
					height={50}
					duration={200}//hadi makathmch hit ayban ghir binma session tloada
				/>
			</SkeletonTheme>
		</>
	)
}

export default Loading