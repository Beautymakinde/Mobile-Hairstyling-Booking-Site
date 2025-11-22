'use client'

export default function AboutPage() {
  return (
    <main className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-heading mb-8 text-center">
          About Me
        </h1>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"></div>
          
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-heading font-semibold text-heading mb-4">
              Your Beauty Partner
            </h2>
            <p className="text-lg text-body mb-4 leading-relaxed">
              With over 10 years of experience in the hairstyling industry, I&apos;ve dedicated my career to making people feel beautiful and confident.
            </p>
            <p className="text-lg text-body mb-4 leading-relaxed">
              I specialize in braids, weaves, and extensions, bringing salon-quality results to the comfort of your home.
            </p>
          </div>
        </div>

        <div className="card p-8 mb-12">
          <h2 className="text-3xl font-heading font-semibold text-heading mb-6 text-center">
            Why Choose Mobile Service?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Save Time</h3>
              <p className="text-muted">No travel time - I come to you</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Comfort</h3>
              <p className="text-muted">Relax in your own space</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Personalized</h3>
              <p className="text-muted">One-on-one attention</p>
            </div>
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-3xl font-heading font-semibold text-heading mb-6">
            My Commitment
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <strong className="text-heading">Quality First:</strong>
                <span className="text-body"> I use only premium products and techniques to ensure long-lasting, beautiful results.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <strong className="text-heading">Professional Service:</strong>
                <span className="text-body"> Licensed, insured, and committed to maintaining the highest standards.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <strong className="text-heading">Your Satisfaction:</strong>
                <span className="text-body"> I&apos;m not happy until you&apos;re thrilled with your new look.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <a href="/services" className="btn-primary inline-block">
            Book Your Appointment
          </a>
        </div>
      </div>
    </main>
  )
}
