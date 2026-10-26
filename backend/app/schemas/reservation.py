import datetime as dt
from typing import Literal, get_args

from pydantic import EmailStr, Field

from app.schemas.common import ApiModel, Name, Phone

# Parties of 8 or more book by phone.
MAX_GUESTS = 7

# Keep in sync with lib/reservation/constants.ts.
SlotTime = Literal[
    "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
]
SLOT_TIMES: tuple[SlotTime, ...] = get_args(SlotTime)

Occasion = Literal[
    "Birthday", "Anniversary", "Date night", "Business dinner", "Celebration", "Other"
]


class ReservationIn(ApiModel):
    date: dt.date
    time: SlotTime
    guests: int = Field(ge=1, le=MAX_GUESTS)
    name: Name
    phone: Phone
    email: EmailStr = Field(max_length=254)
    occasion: Occasion | None = None


class ReservationOut(ApiModel):
    id: str
    code: str
    status: Literal["confirmed"]
    date: dt.date
    time: str
    guests: int
    name: str
    occasion: Occasion | None
    created_at: dt.datetime


class SlotOut(ApiModel):
    time: str
    available: bool


class AvailabilityOut(ApiModel):
    date: dt.date
    guests: int
    slots: list[SlotOut]
