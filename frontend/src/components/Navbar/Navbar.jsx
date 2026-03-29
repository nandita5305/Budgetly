import React from 'react'
import Home from "../../assets/Home.png"

const NavLinks = [
    {
        id: 1,
        title: "About",
        link: "#",
    },
    {
        id: 2,
        title: "Services",
        link: "#",
    },
    {
        id: 3,
        title: "Project",
        link: "#",
    },
    {
        id: 4,
        title: "Contact",
        link: "#",
    },
]

const Navbar = () => {
  return (
    <>
        <div className="container py-4 flex justify-between">
            {/* Logo section */}
            <img src={Home} alt="Logo" className='w-32'/>
            {/* Link section */}
            <div>
                {
                    NavLinks.map((link) => {
                        return (
                            <a href={link.link} className='mx-4'>
                                {link.title}
                            </a>
                        );
                    })
                }
            </div>
            {/* Button section */}
            <div>
                <button className=''>Try for Free</button>
            </div>
        </div>
    </>
  )
}

export default Navbar