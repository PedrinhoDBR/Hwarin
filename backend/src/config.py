import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()


def _csv_env(name: str, default: str = "") -> list[str]:
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    environment: str = os.getenv("ENVIRONMENT", "PRODUCTION").upper()
    allowed_origins: list[str] = field(
        default_factory=lambda: _csv_env("ALLOWED_ORIGINS", "*")
    )
    database_url: str | None = os.getenv("DATABASE_URL")
    db_name: str = os.getenv("DB_NAME", "database.sqlite")
    admin_username: str | None = os.getenv("ADMIN_USERNAME")
    admin_email: str | None = os.getenv("ADMIN_EMAIL")
    admin_password: str | None = os.getenv("ADMIN_PASSWORD")
    admin_role: str = os.getenv("ADMIN_ROLE", "admin")

    @property
    def is_development(self) -> bool:
        return self.environment == "DEVELOPMENT"

    @property
    def should_seed_admin(self) -> bool:
        return bool(self.admin_username and self.admin_email and self.admin_password)


settings = Settings()
