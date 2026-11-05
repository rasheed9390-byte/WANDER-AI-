import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
  Star,
  Ticket,
  Users,
  WalletCards,
  CloudSun,
  Compass,
} from "lucide-react";
import "./index.css";

const floatingDestinations = [
  {
    name: "Maldives",
    subtitle: "Paradise on Earth",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=90",
    className: "floating-card card-maldives",
  },
  {
    name: "Switzerland",
    subtitle: "Nature's Masterpiece",
    image:
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=90",
    className: "floating-card card-switzerland",
  },
  {
    name: "Kyoto",
    subtitle: "Tradition Meets Beauty",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=90",
    className: "floating-card card-kyoto",
  },
  {
    name: "Santorini",
    subtitle: "Where Dreams Live",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=90",
    className: "floating-card card-santorini",
  },
];

const popularDestinations = [
  { name: "Japan", subtitle: "Culture & Innovation", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=90" },
  { name: "Bali", subtitle: "Beaches & Bliss", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=90" },
  { name: "Italy", subtitle: "History & Romance", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=90" },
  {
    name: "New Zealand",
    subtitle: "Adventure Awaits",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=900&auto=format&fit=crop&q=85",
  },
  { name: "Dubai", subtitle: "Modern Wonders", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=90" },
  { name: "Paris", subtitle: "City of Love", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=90" },
  { name: "Iceland", subtitle: "Land of Fire & Ice", image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=800&q=90" },
  { name: "Switzerland", subtitle: "Alpine Escape", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=90" },
  { name: "Maldives", subtitle: "Paradise on Earth", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=90" },
  { name: "Thailand", subtitle: "Tropical Adventures", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=90" },
  { name: "Greece", subtitle: "Blue & Beautiful", image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=800&q=90" },
  { name: "Norway", subtitle: "Northern Wonders", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=90" },
];

const features = [
  { icon: Sparkles, title: "AI Travel Planner", text: "Personalized itineraries" },
  { icon: WalletCards, title: "Best Price Booking", text: "Hotels, flights & more" },
  { icon: CloudSun, title: "Real-time Updates", text: "Weather, alerts & tips" },
  { icon: Compass, title: "Explore Destinations", text: "Hidden gems worldwide" },
];

function App() {
    const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);
    const [accountPage, setAccountPage] = useState<"profile" | "trips" | null>(null);
    const [currentUser, setCurrentUser] = useState<{
  id: number;
  full_name: string;
  email: string;
} | null>(null);
const [showUserMenu, setShowUserMenu] = useState(false);

useEffect(() => {
  const savedUser = localStorage.getItem("wanderai_user");

  if (savedUser) {
    setCurrentUser(JSON.parse(savedUser));
  }
}, []);

  const [authLoading, setAuthLoading] = useState(false);

  const [authError, setAuthError] = useState("");

  const [authSuccess, setAuthSuccess] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [plannerData, setPlannerData] = useState({
  origin_city: "",
  destination: "",
  travel_date: "",
  travelers: 1,
  number_of_days: 3,
  budget_inr: 30000,
});
const [plannerResult, setPlannerResult] = useState<any>(null);
const [plannerLoading, setPlannerLoading] = useState(false);
const [hotelResults, setHotelResults] = useState<any[]>([]);
const [hotelLoading, setHotelLoading] = useState(false);
const [hotelError, setHotelError] = useState("");
const [transportResults, setTransportResults] = useState<any[]>([]);
const [transportLoading, setTransportLoading] = useState(false);
const [transportError, setTransportError] = useState("");
const [localTransportResults, setLocalTransportResults] = useState<any>(null);
const [localTransportLoading, setLocalTransportLoading] = useState(false);
const [localTransportError, setLocalTransportError] = useState("");
const [experienceResults, setExperienceResults] = useState<any[]>([]);
const [experienceLoading, setExperienceLoading] = useState(false);
const [experienceError, setExperienceError] = useState("");
const [selectedInterests, setSelectedInterests] = useState<string[]>([
  "Adventure",
  "Beaches",
  "Food",
]);
const [activePlannerTab, setActivePlannerTab] = useState<
  "Trips" | "Hotels" | "Transport" | "Experiences"
>("Trips");

// TRIP MANAGEMENT
const [savedTrips, setSavedTrips] = useState<any[]>([]);

const [tripStats, setTripStats] = useState({
  total_trips: 0,
  upcoming_trips: 0,
  completed_trips: 0,
});

const [tripsLoading, setTripsLoading] = useState(false);
const [savingTrip, setSavingTrip] = useState(false);
const [completingTripId, setCompletingTripId] = useState<number | null>(null);
const [tripMessage, setTripMessage] = useState("");

  const API_URL = "";
  // FETCH TRIPS AND PROFILE STATISTICS
  const fetchTripData = async () => {
    const token = localStorage.getItem("wanderai_token");

    if (!token) return;

    setTripsLoading(true);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [tripsResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/trips/my-trips`, { headers }),
        fetch(`${API_URL}/trips/stats`, { headers }),
      ]);

      if (!tripsResponse.ok || !statsResponse.ok) {
        throw new Error("Unable to load your trip information.");
      }

      const trips = await tripsResponse.json();
      const stats = await statsResponse.json();

      setSavedTrips(trips);
      setTripStats(stats);
    } catch (error) {
      console.error("Trip data error:", error);
    } finally {
      setTripsLoading(false);
    }
  };

  // SAVE GENERATED AI TRIP
  const saveTrip = async () => {
    const token = localStorage.getItem("wanderai_token");

    if (!token) {
      alert("Please sign in to save your trip.");
      setAuthMode("signin");
      return;
    }

    if (!plannerResult) return;

    setSavingTrip(true);
    setTripMessage("");

    try {
      const response = await fetch(`${API_URL}/trips/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destination: plannerResult.trip.destination,
          travel_date: plannerResult.trip.travel_date,
          travelers: plannerResult.trip.travelers,
          number_of_days: plannerResult.days.length,
          itinerary: plannerResult,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to save your trip.");
      }

      setTripMessage("🎉 Your trip has been saved as an upcoming trip!");
      await fetchTripData();
    } catch (error) {
      setTripMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSavingTrip(false);
    }
  };

  // MARK TRIP AS COMPLETED
  const completeTrip = async (tripId: number) => {
    const token = localStorage.getItem("wanderai_token");

    if (!token) return;

    setCompletingTripId(tripId);

    try {
      const response = await fetch(
        `${API_URL}/trips/${tripId}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to complete trip.");
      }

      await fetchTripData();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setCompletingTripId(null);
    }
  };

  // REFRESH TRIPS WHEN PROFILE OR MY TRIPS OPENS
  useEffect(() => {
    if (
      currentUser &&
      (accountPage === "profile" || accountPage === "trips")
    ) {
      fetchTripData();
    }
  }, [accountPage, currentUser]);

  const generateHotels = async () => {
    setHotelLoading(true);
    setHotelError("");
    setHotelResults([]);

    try {
      const response = await fetch(`${API_URL}/planner/hotels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plannerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to find hotels.");
      }

      setHotelResults(data.hotels || []);
    } catch (error) {
      setHotelError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setHotelLoading(false);
    }
  };

  const generateTransport = async () => {
    setTransportLoading(true);
    setTransportError("");
    setTransportResults([]);

    try {
      const response = await fetch(`${API_URL}/planner/transport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plannerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to find transport options.");
      }

      setTransportResults(data.transport || []);
    } catch (error) {
      setTransportError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setTransportLoading(false);
    }
  };

  const generateLocalTransport = async () => {
    if (!plannerResult) {
      setLocalTransportError("Generate your travel itinerary first.");
      return;
    }

    setLocalTransportLoading(true);
    setLocalTransportError("");
    setLocalTransportResults(null);

    try {
      const response = await fetch(`${API_URL}/planner/local-transport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: plannerResult.trip.destination,
          travelers: plannerResult.trip.travelers,
          itinerary: plannerResult,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to generate local routes.");
      }

      setLocalTransportResults(data);
    } catch (error) {
      setLocalTransportError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLocalTransportLoading(false);
    }
  };

  const generateExperiences = async () => {
    setExperienceLoading(true);
    setExperienceError("");
    setExperienceResults([]);

    try {
      const response = await fetch(`${API_URL}/planner/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: plannerData.destination,
          travel_date: plannerData.travel_date,
          number_of_days: plannerData.number_of_days,
          travelers: plannerData.travelers,
          budget_inr: plannerData.budget_inr,
          interests: selectedInterests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to generate experiences.");
      }

      setExperienceResults(data.experiences);
    } catch (error) {
      setExperienceError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setExperienceLoading(false);
    }
  };

    const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const endpoint =
        authMode === "signup"
          ? "/auth/register"
          : "/auth/login";

      const body =
        authMode === "signup"
          ? {
              full_name: formData.full_name,
              email: formData.email,
              password: formData.password,
            }
          : {
              email: formData.email,
              password: formData.password,
            };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      if (authMode === "signin") {
        localStorage.setItem("wanderai_token", data.access_token);
        localStorage.setItem(
          "wanderai_user",
          JSON.stringify(data.user)
        );

        setAuthSuccess(`Welcome back, ${data.user.full_name}!`);

        setTimeout(() => {
          setAuthMode(null);
          setAuthSuccess("");
        }, 1200);
      } else {
        setAuthSuccess(
          "Account created successfully! You can now sign in."
        );

        setTimeout(() => {
          setAuthMode("signin");
          setAuthSuccess("");
          setFormData({
            full_name: "",
            email: "",
            password: "",
          });
        }, 1200);
      }
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setAuthLoading(false);
    }
  };
  if (accountPage === "profile") {
    return (
      <div className="app-shell">
        <div className="account-page">
          <section className="profile-hero">
            <button onClick={() => setAccountPage(null)}>
              ← Back to Home
            </button>
            <h1>My Profile</h1>
            <p>Manage your account, preferences and travel details.</p>
          </section>

          <main className="profile-content">
            <section className="profile-card">
              <div className="user-avatar">
                {currentUser?.full_name.charAt(0).toUpperCase()}
              </div>

              <div className="profile-details">
                <h2>{currentUser?.full_name}</h2>
                <p>📧 {currentUser?.email}</p>
                <p>📅 Member since Nov 2026</p>
              </div>

            </section>

            <section className="profile-info-card">
              <h2>📊 Quick Stats</h2>

              <div className="profile-stats">
                <div>
                  <span className="profile-stat-icon">✈️</span>
                  <strong>{tripStats.total_trips}</strong>
                  <span>Total Trips</span>
                </div>

                <div>
                  <span className="profile-stat-icon">🗓️</span>
                  <strong>{tripStats.upcoming_trips}</strong>
                  <span>Upcoming Trips</span>
                </div>

                <div>
                  <span className="profile-stat-icon">✅</span>
                  <strong>{tripStats.completed_trips}</strong>
                  <span>Completed Trips</span>
                </div>
              </div>
            </section>

            <section className="profile-info-card">
              <h2>ⓘ Account Information</h2>
              <p><strong>🙍 Full Name</strong><span>{currentUser?.full_name}</span></p>
              <p><strong>📧 Email</strong><span>{currentUser?.email}</span></p>
              <p><strong>🌟 Account Type</strong><span>👑 Traveler</span></p>
            </section>

          </main>
        </div>
      </div>
    );
  }

  if (accountPage === "trips") {
    return (
      <div className="app-shell">
        <div className="account-page">
          <section className="profile-hero">
            <button onClick={() => setAccountPage(null)}>
              ← Back to Home
            </button>
            <h1>My Trips</h1>
            <p>Your journeys, all in one place.</p>
          </section>

          <main className="profile-content">
            <section className="profile-info-card">
              <h2>✈️ Your Travel Dashboard</h2>

              <div className="profile-stats">
                <div>
                  <span className="profile-stat-icon">🌍</span>
                  <strong>{tripStats.total_trips}</strong>
                  <span>Total Trips</span>
                </div>

                <div>
                  <span className="profile-stat-icon">🗓️</span>
                  <strong>{tripStats.upcoming_trips}</strong>
                  <span>Upcoming</span>
                </div>

                <div>
                  <span className="profile-stat-icon">✅</span>
                  <strong>{tripStats.completed_trips}</strong>
                  <span>Completed</span>
                </div>
              </div>
            </section>

            <section className="profile-info-card">
              <h2>🧳 My Saved Journeys</h2>

              {tripsLoading ? (
                <p>Loading your trips...</p>
              ) : savedTrips.length === 0 ? (
                <div>
                  <h3>🌄 No trips saved yet</h3>
                  <p>Generate an AI travel plan and save it here.</p>
                  <button onClick={() => setAccountPage(null)}>
                    Explore AI Trip Planner →
                  </button>
                </div>
              ) : (
                <div className="saved-trips-list">
                  {savedTrips.map((trip) => (
                    <article className="profile-info-card" key={trip.id}>
                      <div className="hotel-card-top">
                        <span className="hotel-category">
                          {trip.status === "completed"
                            ? "✅ COMPLETED"
                            : "🗓️ UPCOMING"}
                        </span>
                        <span>Trip #{trip.id}</span>
                      </div>

                      <h2>📍 {trip.destination}</h2>

                      <p>📅 Travel Date: {trip.travel_date}</p>
                      <p>👥 Travelers: {trip.travelers}</p>
                      <p>⏳ Duration: {trip.number_of_days} days</p>

                      {trip.status === "upcoming" && (
                        <button
                          disabled={completingTripId === trip.id}
                          onClick={() => completeTrip(trip.id)}
                        >
                          {completingTripId === trip.id
                            ? "Updating..."
                            : "✓ Mark as Completed"}
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <section className="hero">
        <div className="hero-background" />

        <header className="navbar">
          <a className="brand" href="#">
            <span className="brand-mark">
              <Compass size={22} />
            </span>
            <span>Wander<span>AI</span></span>
          </a>

          <nav className="nav-links">
            <a className="active" href="#home">Home</a>
            <a href="#destinations">Destinations</a>
            <a href="#planner">AI Planner</a>
            <a href="#bookings">Bookings</a>
            <a href="#about">About</a>
          </nav>

          <div className="nav-actions">
            <button className="icon-button" aria-label="Search">
              <Search size={20} />
            </button>
            {currentUser ? (
              <div className="user-menu-container">
                <button
                  className="user-badge"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">
                    {currentUser.full_name.charAt(0).toUpperCase()}
                  </span>
                  <span className="user-name">{currentUser.full_name}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <strong>{currentUser.full_name}</strong>
                      <small>{currentUser.email}</small>
                    </div>

                    <button
                      onClick={() => {
                        setAccountPage("profile");
                        setShowUserMenu(false);
                      }}
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        setAccountPage("trips");
                        setShowUserMenu(false);
                      }}
                    >
                      My Trips
                    </button>
                    <button>Bookings</button>

                    <button
                      className="logout-button"
                      onClick={() => {
                        localStorage.removeItem("wanderai_token");
                        localStorage.removeItem("wanderai_user");
                        setCurrentUser(null);
                        setShowUserMenu(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="signin-button"
                onClick={() => {
                  setAuthMode("signin");
                  setAuthError("");
                  setAuthSuccess("");
                }}
              >
                <Users size={16} /> Sign In
              </button>
            )}
            {!currentUser && (
              <button
                className="primary-button top-cta"
                onClick={() => {
                  setAuthMode("signup");
                  setAuthError("");
                  setAuthSuccess("");
                }}
              >
                Get Started
              </button>
            )}
          </div>
        </header>

        {floatingDestinations.map((destination, index) => (
          <motion.article
            key={destination.name}
            className={destination.className}
            animate={{
              y: [0, index % 2 === 0 ? -14 : 14, 0],
              rotate: index % 2 === 0 ? [-7, -3, -7] : [7, 3, 7],
            }}
            transition={{
              duration: 7 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img src={destination.image} alt={destination.name} />
            <div className="image-overlay">
              <strong>{destination.name}</strong>
              <span>{destination.subtitle}</span>
            </div>
          </motion.article>
        ))}

        <div className="hero-content" id="home">
          <p className="eyebrow">EXPLORE · PLAN · TRAVEL · BEYOND</p>
          <h1>
            Your Next Adventure
            <span>Starts Here</span>
          </h1>
          <p className="hero-description">
            AI-powered travel planning for unforgettable journeys.
            <br />
            Discover destinations, get personalized itineraries, and
            <br className="desktop-break" /> book everything in one place.
          </p>

          <div className="planner-box" id="planner">
            <div className="planner-tabs">
              <button
                className={activePlannerTab === "Trips" ? "selected" : ""}
                onClick={() => setActivePlannerTab("Trips")}
              >
                <Ticket size={16} /> Trips
              </button>

              <button
                className={activePlannerTab === "Hotels" ? "selected" : ""}
                onClick={() => setActivePlannerTab("Hotels")}
              >
                <WalletCards size={16} /> Hotels
              </button>

              <button
                className={activePlannerTab === "Transport" ? "selected" : ""}
                onClick={() => setActivePlannerTab("Transport")}
              >
                <Compass size={16} /> Transport
              </button>

              <button
                className={activePlannerTab === "Experiences" ? "selected" : ""}
                onClick={() => setActivePlannerTab("Experiences")}
              >
                <Sparkles size={16} /> Experiences
              </button>
            </div>

            <div className="planner-fields">
              {activePlannerTab === "Transport" && (
                <div className="planner-field">
                  <MapPin size={21} />
                  <div>
                    <small>Starting City</small>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      className="planner-input"
                      value={plannerData.origin_city}
                      onChange={(event) =>
                        setPlannerData({
                          ...plannerData,
                          origin_city: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <div className="planner-field">
                <Search size={21} />
                <div>
                  <small>Where to?</small>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    className="planner-input"
                    value={plannerData.destination}
                    onChange={(event) =>
                      setPlannerData({
                        ...plannerData,
                        destination: event.target.value,
                        
                      })
                    }
                  />
                </div>
              </div>
              <div className="planner-field">
                <CalendarDays size={21} />
                <div>
                  <small>Travel Dates</small>
                  <input
                    type="date"
                    className="planner-input"
                    value={plannerData.travel_date}
                    onChange={(event) =>
                      setPlannerData({
                        ...plannerData,
                        travel_date: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="planner-field">
                <Users size={21} />
                <div>
                  <small>Travelers</small>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    placeholder="Number of travelers"
                    className="planner-input"
                    value={plannerData.travelers}
                    onChange={(event) =>
                      setPlannerData({
                        ...plannerData,
                        travelers: Number(event.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="planner-field">
                <CalendarDays size={21} />
                <div>
                  <small>Trip Length</small>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={plannerData.number_of_days}
                    onChange={(event) =>
                      setPlannerData({
                        ...plannerData,
                        number_of_days: Math.min(
                          100,
                          Math.max(1, Number(event.target.value))
                        ),
                      })
                    }
                    className="planner-input planner-number-input"
                    aria-label="Number of days"
                  />
                </div>
              </div>
              <div className="planner-field">
                <WalletCards size={21} />
                <div>
                  <small>Total Trip Budget (₹)</small>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="Enter budget"
                    className="planner-input"
                    value={plannerData.budget_inr}
                    onChange={(event) =>
                      setPlannerData({
                        ...plannerData,
                        budget_inr: Number(event.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <button
                className="search-button"
                aria-label="Search trips"
                disabled={
                  plannerLoading ||
                  hotelLoading ||
                  transportLoading ||
                  experienceLoading
                }
                onClick={async () => {
                  if (activePlannerTab === "Experiences") {
                    if (!plannerData.destination || !plannerData.travel_date) {
                      alert("Please enter a destination and travel date.");
                      return;
                    }

                    await generateExperiences();
                    return;
                  }

                  if (activePlannerTab === "Hotels") {
                    if (!plannerData.destination || !plannerData.travel_date) {
                      alert("Please enter a destination and travel date.");
                      return;
                    }

                    await generateHotels();
                    return;
                  }

                  if (activePlannerTab === "Transport") {
                    if (
                      !plannerData.origin_city ||
                      !plannerData.destination ||
                      !plannerData.travel_date
                    ) {
                      alert("Please enter your starting city, destination and travel date.");
                      return;
                    }

                    await generateTransport();
                    return;
                  }

                  if (!plannerData.destination || !plannerData.travel_date) {
                    alert("Please enter a destination and travel date.");
                    return;
                  }

                  try {
                    setPlannerLoading(true);

                    const response = await fetch(
                      "http://127.0.0.1:8000/planner/generate",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(plannerData),
                      }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(data.detail || "Failed to generate travel plan");
                    }

                    setPlannerResult(data);
                    console.log("Planner Result:", data);
                  } catch (error) {
                    console.error("Planner Error:", error);
                    alert("Could not generate the travel plan.");
                  } finally {
                    setPlannerLoading(false);
                  }
                }}
              >
                {plannerLoading || hotelLoading || transportLoading ? (
                  <>
                    <span className="planner-spinner"></span>
                    <span>
                      {hotelLoading
                        ? "Finding your hotels..."
                        : transportLoading
                        ? "Finding transport options..."
                        : "Generating your journey..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles size={21} />
                    <span>
                      {activePlannerTab === "Hotels"
                        ? "Find AI Hotels"
                        : activePlannerTab === "Transport"
                        ? "Find Transport"
                        : "Generate AI Travel Plan"}
                    </span>
                    <ArrowRight size={21} />
                  </>
                )}
              </button>
            </div>
            {activePlannerTab === "Experiences" && (
              <div className="experience-interest-panel">
                <h3>What do you love exploring?</h3>
                <p>Select your interests to personalize your experiences.</p>

                <div className="experience-interest-chips">
                  {[
                    "Adventure",
                    "Beaches",
                    "Food",
                    "Culture",
                    "Nightlife",
                    "Relaxation",
                  ].map((interest) => (
                    <button
                      type="button"
                      key={interest}
                      className={
                        selectedInterests.includes(interest)
                          ? "interest-chip active"
                          : "interest-chip"
                      }
                      onClick={() =>
                        setSelectedInterests((previous) =>
                          previous.includes(interest)
                            ? previous.filter((item) => item !== interest)
                            : [...previous, interest]
                        )
                      }
                    >
                      {selectedInterests.includes(interest) ? "✓ " : "+ "}
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="popular-tags">
            <span>Popular:</span>
            {["Bali", "Dubai", "Paris", "Thailand", "Iceland"].map((tag) => (
              <button key={tag}>{tag}</button>
            ))}
          </div>
        </div>

        <div className="hero-note">
          <span>More<br />Than<br />Just a Trip</span>
          <ArrowRight size={28} />
        </div>
      </section>
      {activePlannerTab === "Hotels" && hotelResults.length > 0 && (
        <section className="hotel-results">
          <div className="hotel-results-header">
            <span>WANDERAI ACCOMMODATION</span>
            <h2>Stay somewhere amazing.</h2>
            <p>AI-curated hotel recommendations for your journey.</p>
            <small>Prices are estimates, not live booking prices or availability.</small>
          </div>

          <div className="hotel-grid">
            {hotelResults.map((hotel, index) => (
              <article className="hotel-card" key={`${hotel.name}-${index}`}>
                <div className="hotel-card-top">
                  <span className="hotel-category">{hotel.category}</span>
                  <span className="hotel-number">0{index + 1}</span>
                </div>

                <h3>{hotel.name}</h3>
                
                <p className="hotel-location">
                  <MapPin size={15} /> {hotel.location}
                </p>

                <div className="hotel-price">
                  <strong>₹{Number(hotel.price_per_night_inr).toLocaleString("en-IN")}</strong>
                  <span>/ night (estimated)</span>
                </div>

                <p className="hotel-description">{hotel.description}</p>

                <div className="hotel-amenities">
                  {hotel.amenities?.map((amenity: string, i: number) => (
                    <span key={i}>{amenity}</span>
                  ))}
                </div>

                <div className="hotel-reason">
                  <strong>Why we recommend it</strong>
                  <p>{hotel.why_recommended}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {hotelError && activePlannerTab === "Hotels" && (
        <p className="hotel-error">{hotelError}</p>
      )}

      {activePlannerTab === "Transport" && transportResults.length > 0 && (
        <section className="hotel-results">
          <div className="hotel-results-header">
            <span>WANDERAI TRANSPORT</span>
            <h2>Find your way there.</h2>
            <p>AI-curated transport options for your journey.</p>
            <small>Fares and durations are estimates, not live schedules or booking prices.</small>
          </div>

          <div className="hotel-grid">
            {transportResults.map((item, index) => (
              <article className="hotel-card" key={`${item.name}-${index}`}>
                <div className="hotel-card-top">
                  <span className="hotel-category">{item.type}</span>
                  <span className="hotel-number">0{index + 1}</span>
                </div>

                <h3>{item.name}</h3>

                <div className="hotel-price">
                  <strong>₹{Number(item.estimated_fare_inr).toLocaleString("en-IN")}</strong>
                  <span> estimated fare</span>
                </div>

                <p className="hotel-description">{item.description}</p>

                <div className="hotel-amenities">
                  <span>Duration: {item.duration}</span>
                  <span>Best for: {item.best_for}</span>
                </div>

                <div className="hotel-reason">
                  <strong>Why we recommend it</strong>
                  <p>{item.why_recommended}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {transportError && activePlannerTab === "Transport" && (
        <p className="hotel-error">{transportError}</p>
      )}

      {activePlannerTab === "Experiences" && experienceLoading && (
        <div className="hotel-error">
          ✨ WanderAI is discovering amazing experiences for you...
        </div>
      )}

      {activePlannerTab === "Experiences" && experienceError && (
        <p className="hotel-error">{experienceError}</p>
      )}

      {activePlannerTab === "Experiences" &&
        experienceResults.length > 0 && (
          <section className="hotel-results">
            <div className="hotel-results-header">
              <span>WANDERAI EXPERIENCES</span>
              <h2>Your adventures await.</h2>
              <p>Experiences selected around your interests.</p>
              <small>
                Prices are AI-generated estimates, not verified booking prices.
              </small>
            </div>

            <div className="hotel-grid">
              {experienceResults.map((item, index) => (
                <article
                  className="hotel-card"
                  key={`${item.name}-${index}`}
                >
                  <div className="hotel-card-top">
                    <span className="hotel-category">
                      {item.category}
                    </span>
                    <span className="hotel-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3>{item.name}</h3>

                  <p className="hotel-location">
                    <MapPin size={15} /> {item.location}
                  </p>

                  <div className="hotel-price">
                    <strong>
                      ₹{Number(item.estimated_cost_inr).toLocaleString("en-IN")}
                    </strong>
                    <span>estimated cost</span>
                  </div>

                  <p className="hotel-description">
                    {item.description}
                  </p>

                  <div className="hotel-amenities">
                    <span>Duration: {item.duration}</span>
                    <span>Best time: {item.best_time}</span>
                  </div>

                  <div className="hotel-reason">
                    <strong>Why we recommend it</strong>
                    <p>{item.why_recommended}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      {plannerResult && (
  <section className="ai-trip-results">
    <div className="save-trip-section">
      <button
        onClick={saveTrip}
        disabled={savingTrip}
      >
        {savingTrip ? "Saving Trip..." : "💾 Save as Upcoming Trip"}
      </button>

      {tripMessage && (
        <p>{tripMessage}</p>
      )}
    </div>

    {/* ================= TRIP HEADER ================= */}
    <div className="ai-trip-header">

      <div className="ai-trip-heading">
        <span className="ai-trip-eyebrow">
          ✦ WANDERAI AI TRIP PLAN
        </span>

        <h2>
          Your journey to{" "}
          <span>{plannerResult.trip.destination}</span>
        </h2>

        <p>
          {plannerResult.trip.travelers} traveler
          {plannerResult.trip.travelers !== 1 ? "s" : ""} ·{" "}
          {plannerResult.trip.travel_date}
        </p>
      </div>

      <div className="ai-trip-style">
        <span>TRIP STYLE</span>
        <strong>{plannerResult.trip.trip_style}</strong>
      </div>

    </div>


    {/* ================= TRIP STATS ================= */}
    <div className="ai-trip-stats">

      <div className="ai-stat-card">
        <span className="ai-stat-icon">📅</span>
        <div>
          <small>DURATION</small>
          <strong>{plannerResult.days.length} Days</strong>
        </div>
      </div>

      <div className="ai-stat-card">
        <span className="ai-stat-icon">👥</span>
        <div>
          <small>TRAVELERS</small>
          <strong>{plannerResult.trip.travelers}</strong>
        </div>
      </div>

      <div className="ai-stat-card">
        <span className="ai-stat-icon">💰</span>
        <div>
          <small>ESTIMATED COST</small>
          <strong>
            ₹{plannerResult.trip.total_estimated_cost_inr.toLocaleString("en-IN")}
          </strong>
        </div>
      </div>

      <div className="ai-stat-card">
        <span className="ai-stat-icon">✨</span>
        <div>
          <small>AI PLANNED</small>
          <strong>Personalized</strong>
        </div>
      </div>

    </div>


    {/* ================= AI HEADLINE ================= */}
    {plannerResult.ai_summary && (
      <div className="ai-trip-summary">

        <div className="ai-summary-glow">
          ✦
        </div>

        <div>
          <span>YOUR AI TRAVEL INSIGHT</span>

          <h3>
            {plannerResult.ai_summary.headline}
          </h3>

          <p>
            {plannerResult.ai_summary.best_travel_tip}
          </p>
        </div>

      </div>
    )}


    {/* ================= DAY TIMELINE ================= */}
    <div className="ai-itinerary">

      <div className="ai-itinerary-heading">
        <div>
          <span>YOUR DAY-BY-DAY JOURNEY</span>
          <h3>Designed around you.</h3>
        </div>

        <span className="ai-itinerary-badge">
          AI GENERATED
        </span>
      </div>


      {plannerResult.days.map(
        (day: {
          day: number;
          title: string;
          description: string;
          estimated_cost_inr: number;
          activities: {
            time: string;
            title: string;
            description: string;
            category: string;
            duration: string;
            estimated_cost_inr: number;
          }[];
        }) => (

          <motion.article
            key={day.day}
            className="ai-day-card"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: day.day * 0.08,
            }}
          >

            {/* DAY NUMBER */}
            <div className="ai-day-number">
              <span>DAY</span>
              <strong>
                {String(day.day).padStart(2, "0")}
              </strong>
            </div>


            {/* DAY CONTENT */}
            <div className="ai-day-content">

              <div className="ai-day-top">

                <div>
                  <h4>{day.title}</h4>

                  <p>
                    {day.description}
                  </p>
                </div>

                <div className="ai-day-cost">
                  <span>DAY ESTIMATE</span>
                  <strong>
                    ₹{day.estimated_cost_inr.toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>


              {/* ACTIVITIES */}
              <div className="ai-activity-list">

                {day.activities.map(
                  (
                    activity: {
                      time: string;
                      title: string;
                      description: string;
                      category: string;
                      duration: string;
                      estimated_cost_inr: number;
                    },
                    index: number
                  ) => (

                    <motion.div
                      className="ai-activity"
                      key={`${day.day}-${index}`}
                      whileHover={{ x: 5 }}
                    >

                      <div className="ai-activity-time">
                        <span>{activity.time}</span>
                        <div className="ai-timeline-dot" />
                      </div>


                      <div className="ai-activity-main">

                        <div className="ai-activity-icon">
                          {activity.category === "food"
                            ? "🍜"
                            : activity.category === "adventure"
                              ? "🏄"
                              : activity.category === "relaxation"
                                ? "🧘"
                                : activity.category === "shopping"
                                  ? "🛍️"
                                  : activity.category === "travel"
                                    ? "🚗"
                                    : "📍"}
                        </div>

                        <div className="ai-activity-info">

                          <div className="ai-activity-title-row">

                            <h5>
                              {activity.title}
                            </h5>

                            <span className="ai-category">
                              {activity.category}
                            </span>

                          </div>

                          <p>
                            {activity.description}
                          </p>

                          <div className="ai-activity-meta">

                            <span>
                              ⏱ {activity.duration}
                            </span>

                            <span>
                              ₹{activity.estimated_cost_inr.toLocaleString("en-IN")}
                            </span>

                          </div>

                        </div>

                      </div>

                    </motion.div>

                  )
                )}

              </div>

            </div>

          </motion.article>

        )
      )}

    </div>


    {/* ================= LOCAL TRAVEL ROUTES ================= */}
    <div className="local-transport-section">
      <div className="local-transport-header">
        <span>✦ WANDERAI LOCAL MOBILITY</span>
        <h2>Explore every corner.</h2>
        <p>Smart travel connections between your daily destinations.</p>
      </div>

      {!localTransportResults && (
        <button
          className="local-transport-regenerate"
          onClick={generateLocalTransport}
          disabled={localTransportLoading}
        >
          {localTransportLoading
            ? "Generating daily routes..."
            : "Generate Daily Travel Routes"}
        </button>
      )}

      {localTransportError && (
        <p className="hotel-error">{localTransportError}</p>
      )}

      {localTransportResults && (
        <>
          {localTransportResults.daily_routes.map(
            (day: any, dayIndex: number) => (
              <div className="local-day-card" key={dayIndex}>
                <h3>Day {day.day} — Local Travel Plan</h3>

                {day.routes.map((route: any, routeIndex: number) => (
                  <div className="local-route-card" key={routeIndex}>
                    <div className="local-route-points">
                      <span>{route.from}</span>
                      <span>↓</span>
                      <span>{route.to}</span>
                    </div>

                    <div className="local-route-details">
                      <span>🚕 {route.transport_mode}</span>
                      <span>◷ {route.estimated_duration}</span>
                      <strong>
                        ₹{Number(route.estimated_fare_inr).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <p>{route.reason}</p>
                  </div>
                ))}

                <div className="local-day-total">
                  Estimated daily local transport:
                  <strong>
                    ₹{Number(day.estimated_daily_transport_cost_inr).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            )
          )}

          <div className="local-transport-total">
            <span>Total estimated local transport cost</span>
            <h2>
              ₹{Number(
                localTransportResults.total_local_transport_cost_inr
              ).toLocaleString("en-IN")}
            </h2>
            <small>{localTransportResults.ai_note}</small>
          </div>

          <button
            className="local-transport-regenerate"
            onClick={generateLocalTransport}
            disabled={localTransportLoading}
          >
            {localTransportLoading ? "Refreshing..." : "Regenerate Routes"}
          </button>
        </>
      )}
    </div>

    {/* ================= AI TIPS ================= */}
    {plannerResult.ai_summary?.tips?.length > 0 && (
      <div className="ai-tips-section">

        <div className="ai-tips-header">
          <span>✦ WANDERAI SMART TIPS</span>
          <h3>Travel smarter.</h3>
        </div>

        <div className="ai-tips-grid">

          {plannerResult.ai_summary.tips.map(
            (tip: string, index: number) => (

              <div
                className="ai-tip-card"
                key={index}
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>{tip}</p>
              </div>

            )
          )}

        </div>

      </div>
    )}

  </section>
)}

      <section className="feature-strip">
        <div className="feature-list">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="feature" key={title}>
              <span className="feature-icon"><Icon size={22} /></span>
              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="stats">
          <div>
            <strong>10K+</strong>
            <span>Happy Travelers</span>
            <div className="avatars">
              <span>👩🏻</span><span>👨🏽</span><span>👩🏼</span><span>👨🏻</span><span>👩🏽</span>
            </div>
          </div>
          <div className="rating">
            <strong>4.8</strong>
            <div><Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /></div>
            <span>Based on 2,500+ reviews</span>
          </div>
        </div>
      </section>

      <section className="destinations-section" id="destinations">
        <div className="section-heading">
          <div>
            <h2>Popular Destinations</h2>
            <p>Handpicked by travelers, powered by AI</p>
          </div>
          <button className="explore-button">Explore All <ArrowRight size={17} /></button>
        </div>

        <div className="destination-carousel">
          <button className="carousel-arrow" aria-label="Previous destinations"><ArrowLeft size={21} /></button>
          <div className="destination-marquee">
            <motion.div
              className="destination-track"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
            >
              {[...popularDestinations, ...popularDestinations].map((destination, index) => (
                <motion.article
                  className={`destination-card destination-${index % 5}`}
                  key={`${destination.name}-${index}`}
                  whileHover={{ y: -12, scale: 1.025, zIndex: 3 }}
                  transition={{ duration: 0.25 }}
                >
                  <img src={destination.image} alt={destination.name} loading="lazy" />
                  <div className="destination-gradient" />
                  <div className="destination-caption">
                    <h3>{destination.name}</h3>
                    <p>{destination.subtitle}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
          <button className="carousel-arrow" aria-label="Next destinations"><ArrowRight size={21} /></button>
        </div>
      </section>

      {authMode && (
        <div
          className="auth-overlay"
          onClick={() => setAuthMode(null)}
        >
          <div
            className="auth-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="auth-close"
              onClick={() => setAuthMode(null)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="auth-icon">
              <Compass size={25} />
            </div>

            <p className="eyebrow">
              WELCOME TO WANDERAI
            </p>

            <h2>
              {authMode === "signin"
                ? "Welcome Back"
                : "Start Your Journey"}
            </h2>

            <p className="auth-subtitle">
              {authMode === "signin"
                ? "Sign in to continue your travel journey."
                : "Create your account and start exploring the world."}
            </p>

            <form onSubmit={handleAuthSubmit}>

              {authMode === "signup" && (
                <label>
                  Full Name

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.full_name}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        full_name: event.target.value,
                      })
                    }
                    required
                  />
                </label>
              )}

              <label>
                Email Address

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      email: event.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Password

                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      password: event.target.value,
                    })
                  }
                  minLength={6}
                  required
                />
              </label>

              {authError && (
                <p className="auth-error">
                  {authError}
                </p>
              )}

              {authSuccess && (
                <p className="auth-success">
                  {authSuccess}
                </p>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={authLoading}
              >
                {authLoading
                  ? "Please wait..."
                  : authMode === "signin"
                    ? "Sign In"
                    : "Create Account"}

                {!authLoading && <ArrowRight size={17} />}
              </button>

            </form>

            <p className="auth-switch">
              {authMode === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => {
                  setAuthMode(
                    authMode === "signin"
                      ? "signup"
                      : "signin"
                  );

                  setAuthError("");
                  setAuthSuccess("");
                }}
              >
                {authMode === "signin"
                  ? "Create one"
                  : "Sign in"}
              </button>
            </p>

            <small className="demo-note">
              Secure authentication powered by WanderAI.
            </small>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
