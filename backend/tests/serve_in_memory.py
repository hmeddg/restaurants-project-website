"""Runs the real API on an in-memory MongoDB, for e2e tests and for trying the
site before MongoDB Atlas is set up.

    .venv/bin/python -m tests.serve_in_memory --port 8000

API_KEY comes from the environment or backend/.env. Data disappears when the
process stops. Never use this in production.
"""

import argparse
import os

import uvicorn


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8100)
    args = parser.parse_args()

    os.environ.update(MONGODB_URI="mongodb://in-memory", MONGODB_DB="elever_memory")

    from app.main import create_app
    from tests.fake_mongo import FakeClient

    print("Using an in-memory database: nothing is saved to MongoDB.", flush=True)
    uvicorn.run(create_app(client_factory=FakeClient), host="127.0.0.1", port=args.port)


if __name__ == "__main__":
    main()
