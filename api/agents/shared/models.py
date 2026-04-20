import os
from dotenv import load_dotenv

load_dotenv()

# ── Model name constants (sourced exclusively from env vars) ──────────────────

MODEL_GOAL_ANALYST: str = os.getenv("MODEL_GOAL_ANALYST", "")
MODEL_PERSONAL_AGENT: str = os.getenv("MODEL_PERSONAL_AGENT", "")
MODEL_NUDGE_WRITER: str = os.getenv("MODEL_NUDGE_WRITER", "")
MODEL_ORCHESTRATOR: str = os.getenv("MODEL_ORCHESTRATOR", "")


def _is_gemini(model_name: str) -> bool:
    return model_name.startswith("gemini/") or model_name.startswith("gemini-")


def get_model(model_name: str):
    """
    Return the correct model object for the ADK.

    - Gemini models: returned as a plain string — the ADK resolves them natively.
    - Everything else: wrapped in LiteLlm() so the ADK can call them via LiteLLM.
    """
    if not model_name:
        raise ValueError("model_name must not be empty — check your .env file")

    if _is_gemini(model_name):
        return model_name

    # Import here to avoid pulling in litellm at module load when not needed
    from google.adk.models.lite_llm import LiteLlm  # type: ignore

    return LiteLlm(model=model_name)
