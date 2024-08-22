import { signOut } from 'next-auth/react';
import React from 'react';
import { FaUser, FaGamepad, FaSignOutAlt } from 'react-icons/fa';

const SideNav = () => {
	return (
		<div className="grid grid-rows-3 h-screen w-20 bg-gray-900 text-black">
			{/* Top Section: Prpfile button */}
			<div className="flex items-center justify-center">
				<FaUser className="text-2xl" />
			</div>

			{/* Middle Section: hhh dakchi li ghandirou f site button */}
			<div className="flex items-center justify-center">
				<FaGamepad className="text-2xl" />
			</div>

			{/* Bottom Section:setting and logout */}
			<div className="flex items-center justify-center">
				<button onClick={() => signOut()}>
					<FaSignOutAlt className="text-2xl" />
				</button>
			</div>
		</div>
	);
};

export default SideNav;
