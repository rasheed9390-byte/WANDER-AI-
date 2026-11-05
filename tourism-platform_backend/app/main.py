import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine 
from app import models
from app.auth import router as auth_router
from app.planner import router as planner_router
from app.trips import router as trips_router


app = FastAPI(
    title="WanderAI API",
    description="Backend API for the WanderAI tourism platform",
    version="1.0.0"
)

models.Base.metadata.create_all(bind=engine)

frontend_url = os.getenv("FRONTEND_URL", "")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        frontend_url,
    ] if frontend_url else [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(planner_router)
app.include_router(trips_router)


@app.get("/")
def root():
    return {
        "message": "WanderAI Backend is Running! 🚀"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/database-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        value = result.scalar()

    return {
        "database": "connected",
        "test": value
    }