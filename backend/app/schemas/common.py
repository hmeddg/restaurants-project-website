from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints
from pydantic.alias_generators import to_camel


class ApiModel(BaseModel):
    """JSON uses camelCase to match the TypeScript client; Python stays snake_case."""

    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, str_strip_whitespace=True
    )


Name = Annotated[str, StringConstraints(min_length=2, max_length=100)]
Phone = Annotated[
    str, StringConstraints(min_length=7, max_length=30, pattern=r"^[+\d\s().-]+$")
]
