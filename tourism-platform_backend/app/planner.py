import os
import json

from fastapi import APIRouter, HTTPException
from google import genai
from openai import OpenAI

from app.schemas import (
    PlannerRequest,
    HotelRequest,
    TransportRequest,
    LocalTransportRequest,
    ExperienceRequest,
)
router = APIRouter(prefix="/planner", tags=["Travel Planner"])

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@router.post("/generate")
def generate_plan(request: PlannerRequest):

    prompt = f"""
You are WanderAI, a premium AI travel planning assistant.

Create an exciting, realistic travel itinerary for exactly {request.number_of_days} days.

TRIP DETAILS
Destination: {request.destination}
Travel date: {request.travel_date}
Travelers: {request.travelers}

IMPORTANT:
- Make the itinerary specific to the destination.
- Do NOT give generic activities.
- Create a logical route so nearby places are grouped together.
- Make the trip feel exciting and premium.
- Include realistic times.
- Include sightseeing, food, local experiences, adventure and relaxation.
- Consider the number of travelers.
- Avoid repeating activities.
- Give a realistic approximate cost in INR.
- Include useful AI travel tips.
- Keep descriptions concise and useful.

For every day provide:
1. Day number
2. Day title
3. Short description
4. Estimated day cost in INR
5. 4 activities

For every activity provide:
- Time
- Title
- Short description
- Category
- Duration
- Estimated cost in INR

Allowed categories:
"sightseeing"
"food"
"adventure"
"relaxation"
"shopping"
"travel"

At the end provide:
- Total estimated trip cost in INR
- Best travel tip
- Three short AI travel tips

Return ONLY valid JSON.

Use EXACTLY this structure:

{{
    "trip": {{
        "destination": "{request.destination}",
        "travel_date": "{request.travel_date}",
        "travelers": {request.travelers},
        "trip_style": "Adventure + Culture + Relaxation",
        "total_estimated_cost_inr": 0
    }},

CRITICAL TRIP LENGTH RULES:

The user requested EXACTLY {request.number_of_days} days.

The "days" array MUST contain EXACTLY {request.number_of_days} day objects.

If number_of_days = 1, return exactly 1 day.
If number_of_days = 3, return exactly 3 days.
If number_of_days = 6, return exactly 6 days.
If number_of_days = 10, return exactly 10 days.
If number_of_days = 30, return exactly 30 days.

NEVER default to 3 days.
NEVER stop at Day 3.
NEVER return fewer days than requested.
NEVER return more days than requested.

The example below shows ONLY the structure of ONE day.
You MUST repeat this structure until you have exactly {request.number_of_days} days.

Each day MUST contain exactly 4 activities.

The final day should naturally include departure or trip-ending activities when appropriate.

    "days": [
        {{
            "day": 1,
            "title": "Day title",
            "description": "Short description",
            "estimated_cost_inr": 0,
            "activities": [
                {{
                    "time": "09:00 AM",
                    "title": "Activity title",
                    "description": "Short useful description",
                    "category": "sightseeing",
                    "duration": "2 hours",
                    "estimated_cost_inr": 0
                }},
                {{
                    "time": "12:30 PM",
                    "title": "Activity title",
                    "description": "Short useful description",
                    "category": "food",
                    "duration": "1.5 hours",
                    "estimated_cost_inr": 0
                }},
                {{
                    "time": "03:00 PM",
                    "title": "Activity title",
                    "description": "Short useful description",
                    "category": "adventure",
                    "duration": "2 hours",
                    "estimated_cost_inr": 0
                }},
                {{
                    "time": "07:00 PM",
                    "title": "Activity title",
                    "description": "Short useful description",
                    "category": "relaxation",
                    "duration": "2 hours",
                    "estimated_cost_inr": 0
                }}
            ]
        }}
    ],

    "ai_summary": {{
        "headline": "Short exciting trip headline",
        "best_travel_tip": "One useful travel tip",
        "tips": [
            "Travel tip 1",
            "Travel tip 2",
            "Travel tip 3"
        ]
    }}
}}
"""

    try:
        response = None
        last_error = None
        result_text = None

        # Try Gemini models first.
        models_to_try = [
            "gemini-flash-lite-latest",
            "gemini-3.5-flash-lite",
            "gemini-3.5-flash"
        ]

        for model_name in models_to_try:
            try:
                print(f"Trying Gemini model: {model_name}")
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )

                if response and response.text:
                    print(f"SUCCESS: Gemini {model_name}")
                    result_text = response.text.strip()
                    break

                response = None
            except Exception as error:
                last_error = error
                response = None
                print(f"Gemini failed: {error}")

        if response is None:
            print("Trying OpenRouter free model...")

            try:
                openrouter = OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("OPENROUTER_API_KEY")
                )
                ai_response = openrouter.chat.completions.create(
                    model="openrouter/free",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are WanderAI, a travel itinerary generator. "
                                "Return only valid JSON matching the requested schema. "
                                "Do not use Markdown fences."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                )

                result_text = ai_response.choices[0].message.content
                if not result_text:
                    raise ValueError("OpenRouter returned an empty response.")

                result_text = result_text.strip()
                print("SUCCESS: OpenRouter free model")
            except Exception as error:
                last_error = error
                print(f"OpenRouter failed: {error}")
                raise HTTPException(
                    status_code=503,
                    detail=f"Gemini and OpenRouter are unavailable: {last_error}"
                )

        # Remove markdown code fences if the provider adds them.
        if result_text.startswith("```"):
            result_text = result_text.replace("```json", "")
            result_text = result_text.replace("```", "")
            result_text = result_text.strip()

        result = json.loads(result_text)

        return {
            "message": "AI travel plan generated successfully",
            **result
        }

    except HTTPException:
        raise

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="The AI provider returned invalid JSON."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI planner error: {str(e)}"
        )


@router.post("/hotels")
def generate_hotels(request: HotelRequest):
    prompt = f"""
You are WanderAI, an expert travel accommodation advisor.

Recommend exactly 5 hotel options for this trip.

DESTINATION: {request.destination}
CHECK-IN DATE: {request.travel_date}
DURATION: {request.number_of_days} nights
TRAVELERS: {request.travelers}
TOTAL TRIP BUDGET: INR {request.budget_inr}

Rules:
- Recommend realistic accommodation options suitable for the destination.
- Include budget, mid-range and premium categories.
- Give approximate prices in INR per night.
- Include amenities and a short description.
- Explain why each option suits the traveler.
- Do not claim live availability or verified prices.
- Do not invent booking links or ratings.
- Return ONLY valid JSON.

Required structure:

{{
  "destination": "{request.destination}",
  "hotels": [
    {{
      "name": "Hotel name or clearly labelled illustrative suggestion",
      "category": "Budget",
      "price_per_night_inr": 2500,
      "description": "Short description",
      "amenities": ["WiFi", "Restaurant", "Air conditioning"],
      "location": "Area or neighborhood",
      "why_recommended": "Reason for recommendation"
    }}
  ],
  "ai_note": "Prices are approximate AI estimates, not live booking prices."
}}

Return exactly 5 hotel objects.
"""

    result_text = None
    last_error = None

    for model_name in [
        "gemini-flash-lite-latest",
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash"
    ]:
        try:
            print(f"Trying Gemini for hotels: {model_name}")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )

            if response and response.text:
                result_text = response.text.strip()
                print(f"Hotel recommendations generated using {model_name}")
                break
        except Exception as error:
            last_error = error
            print(f"Gemini hotel request failed: {error}")

    if not result_text:
        try:
            openrouter = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENROUTER_API_KEY")
            )
            ai_response = openrouter.chat.completions.create(
                model="openrouter/free",
                messages=[
                    {
                        "role": "system",
                        "content": "Return only valid JSON. Do not use Markdown fences."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            result_text = ai_response.choices[0].message.content
            if result_text:
                result_text = result_text.strip()
            else:
                raise ValueError("OpenRouter returned an empty response.")
        except Exception as error:
            last_error = error
            print(f"OpenRouter hotel request failed: {error}")
            raise HTTPException(
                status_code=503,
                detail=f"Hotel AI providers unavailable: {last_error}"
            )

    try:
        if result_text.startswith("```"):
            result_text = result_text.replace("```json", "")
            result_text = result_text.replace("```", "").strip()

        result = json.loads(result_text)
        if (
            not isinstance(result, dict)
            or not isinstance(result.get("hotels"), list)
            or len(result["hotels"]) != 5
        ):
            raise ValueError("Expected exactly five hotel recommendations.")

        return result
    except (json.JSONDecodeError, ValueError):
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid hotel recommendation."
        )


@router.post("/transport")
async def generate_transport(request: TransportRequest):
    prompt = f"""
You are WanderAI, an expert travel planner.

Suggest exactly 5 transport options for this trip.

Starting city: {request.origin_city}
Destination: {request.destination}
Travel date: {request.travel_date}
Duration: {request.number_of_days} days
Travelers: {request.travelers}
Total trip budget: INR {request.budget_inr}

Return ONLY valid JSON in this format:
{{
  "transport": [
    {{
      "type": "Bus",
      "name": "Example transport option",
      "estimated_fare_inr": 500,
      "duration": "2 hours",
      "description": "Description of the option",
      "best_for": "Budget travellers",
      "why_recommended": "Reason for recommendation"
    }}
  ],
  "ai_note": "All fares and durations are estimates, not live schedules or booking prices."
}}

Include a mix of suitable transport types such as buses,
trains, taxis, rental vehicles or local transport.

Do not claim live availability, exact schedules, or verified fares.
Important rules:
- Recommend transport specifically from the starting city to the destination.
- Use Indian transport context only.
- Do not invent train numbers, bus operators, routes or schedules.
- If a route cannot be confidently identified, describe it as a general estimated option.
- Keep all fares in INR.
- Distinguish intercity transport from local transport.
Return exactly 5 options.
"""

    try:
        result_text = None

        for model in [
            "gemini-flash-lite-latest",
            "gemini-3.5-flash-lite",
            "gemini-3.5-flash"
        ]:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                if response and response.text:
                    result_text = response.text.strip()
                    break
            except Exception:
                continue

        if not result_text:
            openrouter = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENROUTER_API_KEY")
            )
            ai_response = openrouter.chat.completions.create(
                model="openrouter/free",
                messages=[
                    {
                        "role": "system",
                        "content": "Return only valid JSON. No markdown."
                    },
                    {"role": "user", "content": prompt}
                ]
            )
            result_text = ai_response.choices[0].message.content

        if not result_text:
            raise ValueError("AI providers returned an empty response.")

        result_text = result_text.strip()
        if result_text.startswith("```"):
            result_text = result_text.split("\n", 1)[1]
            result_text = result_text.rsplit("```", 1)[0].strip()

        result = json.loads(result_text)
        if (
            not isinstance(result, dict)
            or not isinstance(result.get("transport"), list)
            or len(result["transport"]) != 5
        ):
            raise ValueError("Expected exactly five transport options.")

        return result
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Transport recommendations unavailable: {str(error)}"
        ) from error


@router.post("/local-transport")
async def generate_local_transport(request: LocalTransportRequest):
    prompt = f"""
You are WanderAI, an expert local travel planner in India.

Analyze this actual travel itinerary and recommend how
travelers should move between consecutive activities.

Destination: {request.destination}
Travelers: {request.travelers}

ITINERARY:
{json.dumps(request.itinerary, indent=2)}

Return ONLY valid JSON in this structure:

{{
  "daily_routes": [
    {{
      "day": 1,
      "routes": [
        {{
          "from": "Starting activity",
          "to": "Next activity",
          "transport_mode": "Taxi",
          "estimated_duration": "20 minutes",
          "estimated_fare_inr": 250,
          "reason": "Convenient for this route"
        }}
      ],
      "estimated_daily_transport_cost_inr": 500
    }}
  ],
  "total_local_transport_cost_inr": 1500,
  "ai_note": "Travel times and fares are estimates."
}}

RULES:
- Use only destinations present in the supplied itinerary.
- Connect consecutive activities in their existing order.
- Recommend suitable Indian local transport: taxi, auto,
  bus, metro, rental scooter, or walking.
- Keep fares in INR.
- Estimate fares for the entire group of travelers.
- Never invent verified routes, schedules or live prices.
- Do not include intercity transport.
- Return valid JSON only.
"""

    try:
        result_text = None

        for model in [
            "gemini-flash-lite-latest",
            "gemini-3.5-flash-lite",
            "gemini-3.5-flash"
        ]:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                if response and response.text:
                    result_text = response.text.strip()
                    break
            except Exception:
                continue

        if not result_text:
            openrouter = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENROUTER_API_KEY")
            )
            ai_response = openrouter.chat.completions.create(
                model="openrouter/free",
                messages=[
                    {
                        "role": "system",
                        "content": "Return only valid JSON. No markdown."
                    },
                    {"role": "user", "content": prompt}
                ]
            )
            result_text = ai_response.choices[0].message.content

        if not result_text:
            raise ValueError("AI providers returned an empty response.")

        result_text = result_text.strip()
        if result_text.startswith("```"):
            result_text = result_text.split("\n", 1)[1]
            result_text = result_text.rsplit("```", 1)[0].strip()

        result = json.loads(result_text)
        if (
            not isinstance(result, dict)
            or not isinstance(result.get("daily_routes"), list)
        ):
            raise ValueError("Invalid local transport response.")

        return result
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Local transport recommendations unavailable: {str(error)}"
        ) from error


@router.post("/experiences")
async def generate_experiences(request: ExperienceRequest):
    prompt = f"""
You are WanderAI, an expert travel experience curator.

Recommend exactly 6 experiences for this trip.

Destination: {request.destination}
Travel date: {request.travel_date}
Duration: {request.number_of_days} days
Travelers: {request.travelers}
Total trip budget: INR {request.budget_inr}
Interests: {", ".join(request.interests) if request.interests else "All types"}

Return ONLY valid JSON in this format:

{{
  "experiences": [
    {{
      "name": "Experience name",
      "category": "Adventure",
      "description": "Experience description",
      "estimated_cost_inr": 1000,
      "duration": "2 hours",
      "best_time": "Morning",
      "location": "Destination area",
      "why_recommended": "Reason for recommendation"
    }}
  ],
  "ai_note": "Prices and details are estimates, not verified booking offers."
}}

RULES:
- Return exactly 6 experiences.
- Match the user's interests.
- Include a variety of suitable activities.
- Keep all costs in INR.
- Consider the total trip budget.
- Do not invent booking links, ratings or live availability.
- Clearly distinguish estimated suggestions from verified offerings.
- Return valid JSON only.
"""

    try:
        result_text = None

        for model in [
            "gemini-flash-lite-latest",
            "gemini-3.5-flash-lite",
            "gemini-3.5-flash"
        ]:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                if response and response.text:
                    result_text = response.text.strip()
                    break
            except Exception:
                continue

        if not result_text:
            openrouter = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENROUTER_API_KEY")
            )
            ai_response = openrouter.chat.completions.create(
                model="openrouter/free",
                messages=[
                    {
                        "role": "system",
                        "content": "Return only valid JSON. No markdown."
                    },
                    {"role": "user", "content": prompt}
                ]
            )
            result_text = ai_response.choices[0].message.content

        if not result_text:
            raise ValueError("AI providers returned an empty response.")

        result_text = result_text.strip()
        if result_text.startswith("```"):
            result_text = result_text.split("\n", 1)[1]
            result_text = result_text.rsplit("```", 1)[0].strip()

        result = json.loads(result_text)
        if (
            not isinstance(result, dict)
            or not isinstance(result.get("experiences"), list)
            or len(result["experiences"]) != 6
        ):
            raise ValueError("Expected exactly six experience recommendations.")

        return result
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Experience recommendations unavailable: {str(error)}"
        ) from error