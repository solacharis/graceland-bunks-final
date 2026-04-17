import { useMemo, useState } from "react";
import logo from "./assets/logo.jpeg";
import interiorGroup from "./assets/interior_group.jpeg";
import interior1 from "./assets/interior_1.jpeg";
import interior2 from "./assets/interior_2.jpeg";
import interior3 from "./assets/interior_3.jpeg";
import poster from "./assets/poster.jpeg";
import paymentQr from "./assets/payment_qr.jpeg";
import aizawlPeak from "./assets/aizawl_peak.png";
import baraBazaar from "./assets/bara_bazaar.png";
import solomonsTemple from "./assets/solomons_temple.jpg";
import reiekTlang from "./assets/reiek_tlang.jpg";
import beans14 from "./assets/beans14.png";
import sakawrTlang from "./assets/sakawrhmuituai_tlang.jpg";

const bookingSheetEndpoint = "https://script.google.com/macros/s/AKfycbxOLcTajpiC4ZAuOHkJYWmOQEOE61yBqlku2qhFO0jCUrrjdMehEq04TNFLkr1quw/exec";
const totalCapacity = 11;

const business = {
  name: "Graceland Bunks",
  tagline: "Premium comfort with a stylish stay.",
  phone: "+91 7005640194",
  whatsappNumber: "917005640194",
  email: "stay@gracelandbunks.com",
  address: "Near Aizawl Municipal Corporation, Aizawl, Mizoram",
  mapsLink:
    "https://earth.app.goo.gl/?apn=com.google.earth&isi=293622097&ius=googleearth&link=https%3a%2f%2fearth.google.com%2fweb%2fsearch%2fGraceland%2bBunks,%2bnear%2bAizawl%2bMunicipal%2bCorporation,%2bAizawl,%2bMizoram%2f%4023.7441639,92.7381991,991.95731054a,1877.17938218d,35y,0h,0t,0r%2fdata%3dCrMBGoQBEn4KJTB4Mzc0ZGViMDAyYzIxYmI0MzoweDc2NDZmNzYzOWRhMzk2NTUZI119hoG-N0Ah8htwpz4vV0AqQ0dyYWNlbGFuZCBCdW5rcywgbmVhciBBaXphd2wgTXVuaWNpcGFsIENvcnBvcmF0aW9uLCBBaXphd2wsIE1pem9yYW0YAiABIiYKJAnz2JSXnbk3QBHY9qajzLc3QBlUAT7y5i1XQCHulxgIby1XQEICCAFCAggASg0I____________ARAA",
  pricing: "₹600",
  pricingNote: "Per person / per night • Includes ₹100 discount and all taxes",
  capacity: "10 bunk beds + 1 extra bed • Up to 11 guests",
  bookingPolicy:
    "A 50% advance payment of the total booking amount is required to confirm reservation. The remaining balance must be settled upon arrival at check-in.",
  hours: ["Check-in: 12:00 PM onwards", "Check-out: Before 1:00 PM"],
  highlights: [
    "Premium unisex shared accommodation",
    "Free high-speed Wi‑Fi",
    "24 hrs security and CCTV",
    "Near bus stand, taxi stand, and city access points",
  ],
  amenities: [
    "Air Conditioned",
    "Privacy Curtains",
    "Socket Near Every Bed",
    "Free High-Speed Wi‑Fi",
    "24 Hours Security & CCTV",
    "Locker Facility",
    "Hot & Cold Water",
    "Indian & Western Toilets",
    "Hair Dryer & Steam Iron",
    "Drying Area",
    "Restaurant One Floor Up",
  ],
  transit: [
    "1 Minute Walk from Inter State Bus Terminal",
    "1 Minute Walk from City Bus Stand",
    "1 Minute Walk from Taxi Stand",
    "20 Minutes to Mualpui Helipad",
    "Approx. 22 km from Sairang Railway Station • 40–50 Minutes Drive",
    "Approx. 32 km from Lengpui Airport • 50–60 Minutes Drive",
  ],
  attractions: [
    { name: "Aizawl Peak Restaurant", meta: "Approx. 2 km • 5–10 mins drive", image: aizawlPeak },
    { name: "Bara Bazaar", meta: "Approx. 3 km • 10 mins drive", image: baraBazaar },
    { name: "Solomon's Temple", meta: "Approx. 10 km • 20–25 mins drive", image: solomonsTemple },
    { name: "Reiek Tlang", meta: "Approx. 30 km • 45–60 mins drive", image: reiekTlang },
    { name: "14 Beans", meta: "Approx. 3 km • 10 mins drive", image: beans14 },
    { name: "Sakawrhmuituai Tlang", meta: "Approx. 9 km • 20 mins drive", image: sakawrTlang },
  ],
  paymentDetails: { name: "Lalbiaksanga", upi: "9615968379@ptyes" },
};

function SectionTitle({ eyebrow, title, text, dark = false }) {
  return (
    <div className="section-title">
      <p className={`eyebrow ${dark ? "eyebrow-dark" : ""}`}>{eyebrow}</p>
      <h2 className={`section-heading ${dark ? "heading-dark" : ""}`}>{title}</h2>
      {text ? <p className={`section-text ${dark ? "text-dark" : ""}`}>{text}</p> : null}
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    notes: "",
    paymentConfirmed: false,
  });
  const [submitStatus, setSubmitStatus] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const requestedGuests = Math.max(1, Number(formData.guests || 1));
  const estimatedAdvancePayment = requestedGuests * 300;
  const estimatedBalancePayment = requestedGuests * 300;

  const availabilityMessage = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) {
      return "Select check-in and check-out dates to estimate availability. Final confirmation will be checked in our reservation system.";
    }
    return `Requested stay: ${formData.checkIn} to ${formData.checkOut}. Final confirmation will be checked in our reservation system.`;
  }, [formData.checkIn, formData.checkOut]);

  const canSubmitBooking = requestedGuests <= totalCapacity && formData.paymentConfirmed;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (requestedGuests > totalCapacity) {
      setSubmitStatus("Selected guests exceed maximum capacity. Please reduce guest count or contact us on WhatsApp.");
      return;
    }

    if (!formData.paymentConfirmed) {
      setSubmitStatus("Please confirm that you understand the 50% advance payment requirement before submitting your booking request.");
      return;
    }

    setSubmitStatus("Sending booking request...");
    setBookingSubmitted(false);

    const payload = {
      property: business.name,
      fullName: formData.fullName || "-",
      contact: formData.contact || "-",
      checkIn: formData.checkIn || "-",
      checkOut: formData.checkOut || "-",
      guests: formData.guests || "-",
      notes: formData.notes || "-",
      submittedAt: new Date().toISOString(),
      requestedGuests,
      availabilityTracked: false,
      paymentStatus: "Pending Advance Payment",
      bookingStatus: "Pending Confirmation",
      advanceAmount: estimatedAdvancePayment,
      balanceAmount: estimatedBalancePayment,
    };

    const message = [
      `Hello ${business.name}, I would like to make a booking inquiry.`,
      "",
      `Full name: ${payload.fullName}`,
      `Phone or email: ${payload.contact}`,
      `Check-in: ${payload.checkIn}`,
      `Check-out: ${payload.checkOut}`,
      `Guests: ${payload.guests}`,
      `Notes: ${payload.notes}`,
    ].join("\n");

    try {
      await fetch(bookingSheetEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      setSubmitStatus("Booking request submitted successfully. A 50% advance payment is required to confirm your reservation.");
      setBookingSubmitted(true);
      setFormData({
        fullName: "",
        contact: "",
        checkIn: "",
        checkOut: "",
        guests: "1",
        notes: "",
        paymentConfirmed: false,
      });
    } catch (error) {
      setSubmitStatus("Could not submit booking online. Opening WhatsApp instead.");
      window.open(`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <img src={logo} alt="Graceland Bunks Logo" className="brand-logo" />
            <div>
              <div className="brand-name">{business.name}</div>
              <div className="brand-tagline">{business.tagline}</div>
            </div>
          </div>
          <nav className="nav">
            <a href="#gallery">Gallery</a>
            <a href="#booking">Booking</a>
            <a href="#guide">Guide</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero container">
          <div>
            <div className="hero-badge">
              <img src={logo} alt="Graceland Bunks Logo" className="hero-badge-logo" />
              <span>Official Boutique Bunk Stay in Aizawl</span>
            </div>
            <h1 className="hero-title">Stay simple. Stay stylish. Stay rested.</h1>
            <p className="hero-subtitle">{business.tagline}</p>
            <p className="hero-text">
              Graceland Bunks is a premium unisex shared accommodation designed for travelers who value comfort, aesthetics, and convenience.
            </p>
            <div className="hero-actions">
              <a href="#booking" className="btn btn-primary">Reserve Your Stay</a>
              <a href="#overview" className="btn btn-secondary">Explore Property</a>
            </div>
          </div>

          <div className="hero-side">
            <div className="price-card">
              <div className="small-label">Starting from</div>
              <div className="price">{business.pricing}</div>
              <div className="pill">{business.pricingNote}</div>
              <div className="pill">{business.capacity}</div>
            </div>

            <div className="card">
              <div className="small-label accent">Guest highlights</div>
              <div className="stack">
                {business.highlights.map((item) => <div key={item} className="soft-pill">{item}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="container section">
          <SectionTitle
            eyebrow="Property Overview"
            title="Everything you need for a comfortable stay"
            text="A clean and convenient stay experience with practical facilities, central access, and guest-friendly policies."
          />
          <div className="grid-three">
            <div className="card">
              <h3>Accommodation</h3>
              <div className="stack">
                <div className="soft-pill">Premium unisex shared accommodation</div>
                <div className="soft-pill">10 bunk beds + 1 extra bed</div>
                <div className="soft-pill">Designed for up to 11 guests</div>
              </div>
            </div>
            <div className="card">
              <h3>Pricing</h3>
              <div className="stack">
                <div className="soft-pill">{business.pricing} per person / per night</div>
                <div className="soft-pill">Includes ₹100 discount and all taxes</div>
                <div className="soft-pill">Great value for solo and group travelers</div>
              </div>
            </div>
            <div className="card">
              <h3>Check-in Details</h3>
              <div className="stack">
                {business.hours.map((item) => <div key={item} className="soft-pill">{item}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" className="container section">
          <SectionTitle
            eyebrow="Gallery"
            title="See the stay before you book"
            text="A preview of the actual property, bunks, interiors, and guest environment at Graceland Bunks."
          />
          <div className="gallery-grid">
            <img src={interiorGroup} alt="Guests at Graceland Bunks" className="gallery-large" />
            <img src={interior1} alt="Bunk interior view 1" />
            <img src={interior2} alt="Bunk interior view 2" />
            <img src={interior3} alt="Bunk interior view 3" />
          </div>
          <div className="two-col mt-24">
            <div className="card">
              <h3>Amenities & Facilities</h3>
              <div className="stack">
                {business.amenities.map((item) => <div key={item} className="soft-pill">{item}</div>)}
              </div>
            </div>
            <div className="card">
              <h3>Transit Convenience</h3>
              <div className="stack">
                {business.transit.map((item) => <div key={item} className="soft-pill">{item}</div>)}
              </div>
            </div>
          </div>
          <div className="two-col mt-24">
            <img src={poster} alt="Amenities poster" className="info-image" />
            <img src={paymentQr} alt="Payment QR code" className="info-image" />
          </div>
        </section>

        <section id="guide" className="container section">
          <SectionTitle
            eyebrow="Mini Tourist Guide"
            title="Explore Mizoram during your stay"
            text="Nearby places that travelers can enjoy easily from Graceland Bunks."
          />
          <div className="tour-grid">
            {business.attractions.map((place, index) => (
              <div key={place.name} className="tour-card">
                <img src={place.image} alt={place.name} className="tour-image" />
                <div className="tour-body">
                  <div className="tour-index">{index + 1}</div>
                  <div className="tour-name">{place.name}</div>
                  <div className="tour-meta">{place.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container section">
          <div className="location-card">
            <div>
              <SectionTitle eyebrow="Location" title="Find Graceland Bunks" text={business.address} />
            </div>
            <a href={business.mapsLink} target="_blank" rel="noreferrer" className="btn btn-primary">
              Open location in Google Maps
            </a>
          </div>
        </section>

        <section id="booking" className="container section">
          <div className="booking-grid">
            <div className="booking-info">
              <SectionTitle
                eyebrow="Booking & Payment"
                title="Reserve your bunk stay"
                text="Send your stay details and we will confirm availability as soon as possible."
                dark
              />
              <div className="panel">{business.bookingPolicy}</div>
              <div className="panel">Bookings are automatically recorded into our reservation management system upon submission with payment and booking status tracking.</div>
              <div className="panel"><strong>Availability Status:</strong><br />{availabilityMessage}</div>
              <div className="panel">
                <strong>Payment Tracking:</strong><br />
                Initial status: Pending Advance Payment<br />
                Booking remains unconfirmed until payment is verified.<br /><br />
                <strong>Payment Details:</strong><br />
                Name: {business.paymentDetails.name}<br />
                UPI: {business.paymentDetails.upi}
              </div>
              <div className="panel">Advance payment is required to confirm reservation</div>
              <div className="panel">The remaining balance must be settled at check-in</div>
            </div>

            <div className="card booking-form-wrap">
              <form className="booking-form" onSubmit={handleBookingSubmit}>
                <label>
                  <span>Full name</span>
                  <input type="text" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Your name" />
                </label>
                <label>
                  <span>Phone or email</span>
                  <input type="text" value={formData.contact} onChange={(e) => handleChange("contact", e.target.value)} placeholder="Your contact details" />
                </label>
                <div className="two-inputs">
                  <label>
                    <span>Check-in</span>
                    <input type="date" value={formData.checkIn} onChange={(e) => handleChange("checkIn", e.target.value)} />
                  </label>
                  <label>
                    <span>Check-out</span>
                    <input type="date" value={formData.checkOut} onChange={(e) => handleChange("checkOut", e.target.value)} />
                  </label>
                </div>
                <label>
                  <span>Guests</span>
                  <input type="number" min="1" max={totalCapacity} value={formData.guests} onChange={(e) => handleChange("guests", e.target.value)} />
                </label>

                <div className="soft-pill">{`Requested: ${requestedGuests} guest(s) • Maximum capacity: ${totalCapacity} beds`}</div>
                <div className="soft-pill">{`Estimated advance payment to confirm booking: ₹${estimatedAdvancePayment}`}</div>
                <div className="soft-pill">{`Estimated balance payable at check-in: ₹${estimatedBalancePayment}`}</div>

                <label>
                  <span>Notes</span>
                  <textarea rows="4" value={formData.notes} onChange={(e) => handleChange("notes", e.target.value)} placeholder="Tell us anything important about your stay" />
                </label>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={formData.paymentConfirmed}
                    onChange={(e) => handleChange("paymentConfirmed", e.target.checked)}
                  />
                  <span>
                    I understand that a 50% advance payment is required to confirm my booking, and the remaining balance must be paid upon arrival at check-in.
                  </span>
                </label>

                {submitStatus ? (
                  <div className="status-box">
                    <div>{submitStatus}</div>
                    {bookingSubmitted ? (
                      <div className="status-next">
                        <div className="next-box">Next step: Please complete 50% advance payment to confirm your reservation.</div>
                        <div className="next-box">After payment, send your payment screenshot on WhatsApp at {business.phone}.</div>
                        <div className="next-box">Your booking will remain under <strong>Pending Confirmation</strong> until payment is verified.</div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <button type="submit" disabled={!canSubmitBooking} className={`btn btn-primary full ${!canSubmitBooking ? "disabled" : ""}`}>
                  {requestedGuests > totalCapacity ? "Not Enough Beds Available" : formData.paymentConfirmed ? "Send Booking Request" : "Confirm Payment Policy to Continue"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section id="contact" className="container section">
          <div className="two-col">
            <div className="contact-card">
              <SectionTitle eyebrow="Contact" title="Contact & stay details" dark />
              <div className="contact-lines">
                <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noreferrer" className="btn btn-light">Chat on WhatsApp</a>
                <p>{business.phone}</p>
                <p>{business.email}</p>
                <p>{business.address}</p>
              </div>
            </div>
            <div className="card">
              <SectionTitle eyebrow="Guest Essentials" title="Quick information before you book" />
              <div className="stack">
                <div className="soft-pill">Premium unisex shared accommodation</div>
                <div className="soft-pill">10 bunk beds + 1 extra bed</div>
                <div className="soft-pill">Advance payment required to confirm reservation</div>
                <div className="soft-pill">Easy access to city transport and tourist destinations</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="brand">
            <img src={logo} alt="Graceland Bunks Logo" className="footer-logo" />
            <span>© 2026 {business.name}. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
