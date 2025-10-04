import AboutSection from "../../components/homepage/AboutSection";
import ContactSection from "../../components/homepage/ContactSection";
import Footer from "../../components/homepage/Footer";
import HelpCenter from "../../components/homepage/HelpCenter";
import HeroSection from "../../components/homepage/HeroSection";
import ServicesSection from "../../components/homepage/ServicesSection";
// import { useUser } from "../../stores/userStore";


function Homepage() {
  // const user = useUser()

  return (
    <>
      {/* <p className='text-3xl font-bold underline text-red-500'>Homepage</p>
      {user ? (
        <div className="mt-4">
          <p className="text-lg font-semibold">Welcome, {user.firstName} {user.lastName} 👋</p>
          <p className="text-gray-700">Email: {user.email}</p>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">You are not logged in.</p>
      )} */}
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <HeroSection />
        <section id="about">
          <AboutSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <ContactSection />
        <HelpCenter />
      </main>
      <Footer/>
    </>
  )
}

export default Homepage
