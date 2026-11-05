from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    class Config:
        from_attributes = True
        
class PlannerRequest(BaseModel):
    destination: str
    travel_date: str
    travelers: int
    number_of_days: int

class HotelRequest(BaseModel):
    destination: str
    travel_date: str
    number_of_days: int
    travelers: int
    budget_inr: int


class TransportRequest(BaseModel):
    origin_city: str
    destination: str
    travel_date: str
    number_of_days: int
    travelers: int
    budget_inr: int

class LocalTransportRequest(BaseModel):
    destination: str
    travelers: int
    itinerary: dict

class ExperienceRequest(BaseModel):
    destination: str
    travel_date: str
    number_of_days: int
    travelers: int
    budget_inr: int
    interests: list[str] = []


# ==============================
# TRIP MANAGEMENT SCHEMAS
# ==============================
class TripSaveRequest(BaseModel):
    destination: str
    travel_date: str
    travelers: int
    number_of_days: int
    itinerary: dict


class TripResponse(BaseModel):
    id: int
    destination: str
    travel_date: str
    travelers: int
    number_of_days: int
    itinerary: dict
    status: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class TripStatsResponse(BaseModel):
    total_trips: int
    upcoming_trips: int
    completed_trips: int