import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Trip, User
from app.auth import get_current_user
from app.schemas import TripSaveRequest


router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)


# SAVE A NEW AI-GENERATED TRIP
@router.post("/save")
def save_trip(
    trip_data: TripSaveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_trip = Trip(
        user_id=current_user.id,
        destination=trip_data.destination,
        travel_date=trip_data.travel_date,
        travelers=trip_data.travelers,
        number_of_days=trip_data.number_of_days,
        itinerary=json.dumps(trip_data.itinerary),
        status="upcoming"
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return {
        "message": "Trip saved successfully",
        "trip_id": new_trip.id,
        "status": new_trip.status
    }


# GET ALL TRIPS FOR THE LOGGED-IN USER
@router.get("/my-trips")
def get_my_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trips = (
        db.query(Trip)
        .filter(Trip.user_id == current_user.id)
        .order_by(Trip.created_at.desc())
        .all()
    )

    return [
        {
            "id": trip.id,
            "destination": trip.destination,
            "travel_date": trip.travel_date,
            "travelers": trip.travelers,
            "number_of_days": trip.number_of_days,
            "itinerary": json.loads(trip.itinerary),
            "status": trip.status,
            "created_at": trip.created_at
        }
        for trip in trips
    ]


# MARK A TRIP AS COMPLETED
@router.patch("/{trip_id}/complete")
def complete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == current_user.id
        )
        .first()
    )

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    trip.status = "completed"

    db.commit()
    db.refresh(trip)

    return {
        "message": "Trip marked as completed",
        "trip_id": trip.id,
        "status": trip.status
    }


# GET PROFILE QUICK STATS
@router.get("/stats")
def get_trip_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_trips = (
        db.query(Trip)
        .filter(Trip.user_id == current_user.id)
    )

    total = user_trips.count()

    upcoming = user_trips.filter(
        Trip.status == "upcoming"
    ).count()

    completed = user_trips.filter(
        Trip.status == "completed"
    ).count()

    return {
        "total_trips": total,
        "upcoming_trips": upcoming,
        "completed_trips": completed
    }
