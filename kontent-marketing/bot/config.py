import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

ALLOWED_USER_IDS = [
    int(x.strip())
    for x in os.getenv("ALLOWED_USER_IDS", "").split(",")
    if x.strip().isdigit()
]

# Модели по ролям (можно менять в .env)
MODEL_SONNET = os.getenv("MODEL_SONNET", "anthropic/claude-sonnet-4-5")
MODEL_OPUS   = os.getenv("MODEL_OPUS",   "anthropic/claude-opus-4-5")
MODEL_HAIKU  = os.getenv("MODEL_HAIKU",  "anthropic/claude-haiku-4-5-20251001")

# Директории
DATA_DIR     = Path(__file__).parent.parent
EXAMPLES_DIR = Path(__file__).parent / "examples"
EXAMPLES_DIR.mkdir(exist_ok=True)
