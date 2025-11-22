'use client'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-purple-800 to-primary min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base%3C/svg>')] opacity-10"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10 max-w-container">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight">
              Elevate Your Beauty
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Professional mobile hairstyling services brought to your doorstep
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="/client/services" className="btn-primary bg-secondary text-white px-8 py-4 text-lg hover:scale-105 transform transition-all">
                Book Appointment
              </a>
              <a href="#services" className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-lg">
                View Services
              </a>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F8F8F8"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-heading mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Experience premium hairstyling with the convenience of mobile service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:scale-105 transform transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Convenient Booking</h3>
              <p className="text-muted">Easy online scheduling that fits your busy lifestyle</p>
            </div>

            <div className="card p-8 text-center hover:scale-105 transform transition-all">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Professional Stylists</h3>
              <p className="text-muted">Licensed experts with years of experience</p>
            </div>

            <div className="card p-8 text-center hover:scale-105 transform transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Mobile Service</h3>
              <p className="text-muted">We come to you - comfort of your own home</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-700">
        <div className="container mx-auto px-4 max-w-container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
              Ready for Your Transformation?
            </h2>
            <p className="text-xl text-white/90">
              Book your appointment today and experience luxury hairstyling at home
            </p>
            <a href="/client/services" className="inline-block bg-secondary text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-xl hover:scale-105 transform">
              Browse Services
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-heading py-8">
        <div className="container mx-auto px-4 max-w-container">
          <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-white font-heading text-2xl font-bold mb-2">Elite Hair Studio</h3>
              <p className="text-white/70">Professional mobile hairstyling services</p>
            </div>
            <div className="text-white/70 md:text-right">
              <a href="/admin/login" className="hover:text-white transition">Admin Login</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
