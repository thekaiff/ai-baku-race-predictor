

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, field_validator

# Repo root — two levels up from this file (core/config.py -> core -> root)
_REPO_ROOT = Path(__file__).resolve().parents[1]


class Settings(BaseModel):
    model_artifact_path: Path
    min_history_count: int

    @field_validator("model_artifact_path")
    @classmethod
    def _must_exist(cls, v: Path) -> Path:
        if not v.is_file():
            raise ValueError(f"model artifact not found at {v}")
        return v


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Cached — env vars are read once per process (module-scope cache,
    ADR-0003), not re-parsed on every call."""
    raw_path = os.environ.get(
        "MODEL_ARTIFACT_PATH", "data/Baku_XGBoost_Dashboard_Data.json"
    )
    path = Path(raw_path)
    if not path.is_absolute():
        path = _REPO_ROOT / path

    return Settings(
        model_artifact_path=path,
        min_history_count=int(os.environ.get("MIN_HISTORY_COUNT", "1")),
    )
