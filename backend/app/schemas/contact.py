from datetime import datetime
from typing import Literal

from pydantic import EmailStr, Field

from app.schemas.common import ApiModel, Name, Phone

ContactSubject = Literal["General enquiry", "Reservations", "Private dining", "Feedback"]


class ContactMessageIn(ApiModel):
    name: Name
    email: EmailStr = Field(max_length=254)
    phone: Phone | None = None
    subject: ContactSubject
    message: str = Field(min_length=10, max_length=2000)
    newsletter: bool = False


class ContactMessageOut(ApiModel):
    id: str
    created_at: datetime
