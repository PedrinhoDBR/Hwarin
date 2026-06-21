from sqlalchemy import inspect, text

from src.config import settings
from src.db.database import Base, SessionLocal, engine
from src.models.user import User
from src.utils.crypt_password import hash_password


def ensure_admin_user() -> None:
    if not settings.should_seed_admin:
        return

    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.admin_email).first()
        if admin_user:
            return

        db.add(
            User(
                username=settings.admin_username,
                email=settings.admin_email,
                password_hash=hash_password(settings.admin_password or ""),
                role=settings.admin_role,
            )
        )
        db.commit()
    finally:
        db.close()


def ensure_story_schema() -> None:
    inspector = inspect(engine)

    if "story" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("story")}

    if "synopsis" in columns:
        return

    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE story ADD COLUMN synopsis TEXT"))

        if "text" in columns:
            connection.execute(
                text('UPDATE story SET synopsis = "text" WHERE synopsis IS NULL')
            )


def ensure_user_profile_schema() -> None:
    inspector = inspect(engine)

    if "users" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("users")}
    statements = []

    if "avatar_url" not in columns:
        statements.append("ALTER TABLE users ADD COLUMN avatar_url VARCHAR")

    if "bio" not in columns:
        statements.append("ALTER TABLE users ADD COLUMN bio TEXT")

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


def init_database() -> None:
    if settings.is_development:
        Base.metadata.drop_all(bind=engine)

    Base.metadata.create_all(bind=engine)
    ensure_story_schema()
    ensure_user_profile_schema()
    ensure_admin_user()
