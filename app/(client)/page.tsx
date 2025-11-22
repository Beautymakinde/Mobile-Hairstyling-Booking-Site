'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-secondary min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-dark/30 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 px-4">
            <h1 className="font-playfair font-bold text-white leading-tight">
              Elevate Your Beauty Experience
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-raleway font-light max-w-2xl mx-auto">
              Professional mobile hairstyling services brought to your doorstep. Experience luxury, convenience, and artistry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/services" className="btn-lg bg-secondary hover:bg-secondary-dark text-white shadow-lg hover:shadow-xl transform hover:scale-105">
                Book Appointment
              </Link>
              <Link href="#about" className="btn-lg bg-white text-primary hover:bg-gray-50">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F8F8F8"/>
          </svg>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-playfair mb-4">Our Signature Services</h2>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              From intricate braids to luxurious extensions, discover our range of professional hairstyling services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            <div className="card-interactive group">
              <div className="relative h-48 mb-6 -mt-6 -mx-6 overflow-hidden rounded-t-card bg-gradient-to-br from-primary/10 to-secondary/20">
                <div className="absolute top-4 right-4 z-10"><span className="badge-secondary">Popular</span></div>
              </div>
              <h3 className="font-playfair text-primary mb-2">Braids</h3>
              <p className="text-body-sm text-muted mb-4">Knotless, French Curls, Boho styles</p>
              <div className="text-h4 font-playfair font-semibold text-primary mb-4">From $200</div>
              <Link href="/services" className="btn-primary w-full justify-center btn-sm">View All</Link>
            </div>

            <div className="card-interactive group">
              <div className="relative h-48 mb-6 -mt-6 -mx-6 overflow-hidden rounded-t-card bg-gradient-to-br from-secondary/10 to-primary/20"></div>
              <h3 className="font-playfair text-primary mb-2">Extensions</h3>
              <p className="text-body-sm text-muted mb-4">Quickweave, Sew-in, Ponytails</p>
              <div className="text-h4 font-playfair font-semibold text-primary mb-4">From $100</div>
              <Link href="/services" className="btn-primary w-full justify-center btn-sm">View All</Link>
            </div>

            <div className="card-interactive group">
              <div className="relative h-48 mb-6 -mt-6 -mx-6 overflow-hidden rounded-t-card bg-gradient-to-br from-primary/10 to-secondary/20"></div>
              <h3 className="font-playfair text-primary mb-2">Weaves</h3>
              <p className="text-body-sm text-muted mb-4">Lemonade, Fulani, Stitch Braids</p>
              <div className="text-h4 font-playfair font-semibold text-primary mb-4">From $150</div>
              <Link href="/services" className="btn-primary w-full justify-center btn-sm">View All</Link>
            </div>

            <div className="card-interactive group">
              <div className="relative h-48 mb-6 -mt-6 -mx-6 overflow-hidden rounded-t-card bg-gradient-to-br from-secondary/10 to-primary/20"></div>
              <h3 className="font-playfair text-primary mb-2">Others</h3>
              <p className="text-body-sm text-muted mb-4">Softlocs, Crochet, Twists</p>
              <div className="text-h4 font-playfair font-semibold text-primary mb-4">From $130</div>
              <Link href="/services" className="btn-primary w-full justify-center btn-sm">View All</Link>
            </div>
          </div>

          <div className="text-center">
            <Link href="/services" className="btn-secondary btn-lg">
              View All Services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-primary/10 to-secondary/20 rounded-card"></div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="font-playfair mb-6">Meet Your Stylist</h2>
              <p className="text-body-lg text-body mb-6 leading-relaxed">
                With over 10 years of experience, I specialize in creating stunning styles that enhance your natural beauty. From intricate braids to elegant weaves, I bring professional salon-quality service to your home.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-raleway font-semibold text-heading mb-1">Licensed & Insured</h4>
                    <p className="text-body-sm text-muted">Professional certification with full insurance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-raleway font-semibold text-heading mb-1">10+ Years Experience</h4>
                    <p className="text-body-sm text-muted">Expert in all braiding and extension techniques</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-raleway font-semibold text-heading mb-1">Mobile Convenience</h4>
                    <p className="text-body-sm text-muted">I come to you - comfort of your home</p>
                  </div>
                </div>
              </div>
              
              <Link href="/about" className="btn-secondary">Read Full Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-gradient-to-b from-background to-white">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-playfair mb-4">Why Choose Us</h2>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              Experience the difference of professional mobile hairstyling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-primary mb-3">Flexible Scheduling</h3>
              <p className="text-body text-muted">Book appointments that fit your lifestyle with easy online scheduling</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-primary mb-3">Quality Products</h3>
              <p className="text-body text-muted">Premium products for beautiful, long-lasting results</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-playfair text-primary mb-3">Home Comfort</h3>
              <p className="text-body text-muted">Professional service in your own space</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-br from-primary via-primary-light to-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-playfair text-white">Ready for Your Transformation?</h2>
            <p className="text-xl text-white/90 font-light">
              Book your appointment today and experience luxury hairstyling at home
            </p>
            <div className="pt-4">
              <Link href="/services" className="btn-lg bg-white text-primary hover:bg-gray-50 shadow-xl transform hover:scale-105">
                Browse Services
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
