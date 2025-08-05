import AboutUs from "@/components/Landing/aboutus"
import CallToAction from "@/components/Landing/callToAction"
import Features from "@/components/Landing/features"
import Footer from "@/components/Landing/footer"
import Hero from "@/components/Landing/hero"
import Navbar from "@/components/Landing/navbar"
import Testimonial from "@/components/Landing/testimonial"
import React from "react"

const Landing = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <AboutUs/>
            {/* <Testimonial /> */}
            <CallToAction />
            <Footer/>
           
        </>
    )
}

export default Landing
