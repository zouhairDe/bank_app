import { signOut } from 'next-auth/react';
import React, {useState} from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { IoIosCreate } from "react-icons/io";


const SideNav = () => {
	const [showBackDrop, setShowBackDrop] = useState(false);
	const handleSignOut = () => {
		setShowBackDrop(true);
		signOut({ callbackUrl: "/" });
	}
	return (
		<div className="grid grid-rows-3 h-screen w-20 bg-gray-900 ">
			{/* Top Section: Prpfile button */}
			<div className="flex items-center justify-center">
				<FaUser className="text-2xl" />
			</div>

			{/* Middle Section: hhh dakchi li ghandirou f site button */}
			<div className="flex items-center justify-center">
				<IoIosCreate className="text-2xl" />
			</div>

			{/* Bottom Section:setting and logout */}
			<div className="flex items-center justify-center">
				<button onClick={handleSignOut}>
					<FaSignOutAlt className="text-2xl" />
				</button>
			</div>
			{showBackDrop && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                }}>
                    <div style={{
                        width: "50px",
                        height: "50px",
                        border: "5px solid rgba(255, 255, 255, 0.3)",
                        borderTop: "5px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }} />
                </div>
            )}

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
		</div>
	);
};

export default SideNav;
