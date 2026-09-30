from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import incidents
from app.api import investigation
from app.api import remediation
from app.api import postmortem


app = FastAPI(
    title="DevOps Incident Agent API",
    description="AI-powered DevOps Incident Investigation and Response Platform",
    version="1.0.0",
)


# --------------------------------------------------
# CORS - Frontend Connectivity
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API Routers
# --------------------------------------------------

app.include_router(incidents.router)
app.include_router(investigation.router)
app.include_router(remediation.router)
app.include_router(postmortem.router)


# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "DevOps Incident Agent API is running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "devops-incident-agent",
    }