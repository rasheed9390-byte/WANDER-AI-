from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    
class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    destination = Column(String(150), nullable=False)
    travel_date = Column(String(20), nullable=False)
    travelers = Column(Integer, nullable=False)
    number_of_days = Column(Integer, nullable=False)
    itinerary = Column(String, nullable=False)
    status = Column(String(20), nullable=False, default="upcoming", server_default="upcoming")
    created_at = Column(DateTime, server_default=func.now())
