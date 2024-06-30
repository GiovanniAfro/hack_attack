from typing import Optional

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "HackAttack"}


@app.get("/restaurants")
def get_restaurants():
    return {"name": "restaurant"}


@app.get("/restaurants/{id}")
def get_restaurant(id: int, name: Optional[str] = None):
    return {"item_id": id, "name": name}
