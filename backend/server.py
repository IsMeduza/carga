from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from auth import get_current_user, get_optional_user

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'carga_platform')]

# Create the main app
app = FastAPI(title="Carga Platform API", version="2.0.0")

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth")


# ── Models ──
class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    supabase_id: str
    email: str
    full_name: str = ""
    company: str = ""
    user_type: str = "shipper"  # carrier, shipper, both
    phone: str = ""
    nif: str = ""
    avatar_url: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserProfileCreate(BaseModel):
    full_name: str = ""
    company: str = ""
    user_type: str = "shipper"
    phone: str = ""
    nif: str = ""

class Carga(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    origen: str
    destino: str
    peso: float
    distancia: float
    precio: float
    tipo: str  # completa, parcial, urgente, frigorifico
    origen_coords: List[float] = []
    destino_coords: List[float] = []
    descripcion: str = ""
    created_by: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Envio(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    origen: str
    destino: str
    peso: float
    precio: float
    estado: str = "recogida_pendiente"  # recogida_pendiente, en_transito, entregado
    progreso: int = 0
    transportista: str = ""
    user_id: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Transportista(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nombre: str
    email: str
    vehiculo: str = ""
    capacidad: float = 0
    rating: float = 0
    envios_completados: int = 0
    estado: str = "disponible"  # disponible, en_ruta, no_disponible


# ── Demo Data ──
DEMO_CARGAS = [
    {"id": "c1", "origen": "Madrid", "destino": "Barcelona", "peso": 18, "distancia": 621, "precio": 1250, "tipo": "completa", "origen_coords": [-3.7038, 40.4168], "destino_coords": [2.1734, 41.3851], "descripcion": "Carga paletizada - 33 palets europeos"},
    {"id": "c2", "origen": "Valencia", "destino": "Sevilla", "peso": 12, "distancia": 654, "precio": 980, "tipo": "parcial", "origen_coords": [-0.3763, 39.4699], "destino_coords": [-5.9845, 37.3891], "descripcion": "Mercancía textil en cajas"},
    {"id": "c3", "origen": "Bilbao", "destino": "Madrid", "peso": 24, "distancia": 395, "precio": 890, "tipo": "urgente", "origen_coords": [-2.9253, 43.2630], "destino_coords": [-3.7038, 40.4168], "descripcion": "Piezas industriales - Entrega antes de 24h"},
    {"id": "c4", "origen": "Zaragoza", "destino": "Valencia", "peso": 8, "distancia": 302, "precio": 620, "tipo": "frigorifico", "origen_coords": [-0.8773, 41.6488], "destino_coords": [-0.3763, 39.4699], "descripcion": "Productos refrigerados a 4°C"},
    {"id": "c5", "origen": "Barcelona", "destino": "Málaga", "peso": 20, "distancia": 997, "precio": 1850, "tipo": "completa", "origen_coords": [2.1734, 41.3851], "destino_coords": [-4.4214, 36.7213], "descripcion": "Mobiliario de oficina"},
    {"id": "c6", "origen": "Sevilla", "destino": "Bilbao", "peso": 15, "distancia": 933, "precio": 1600, "tipo": "urgente", "origen_coords": [-5.9845, 37.3891], "destino_coords": [-2.9253, 43.2630], "descripcion": "Material sanitario urgente"},
    {"id": "c7", "origen": "Madrid", "destino": "Valencia", "peso": 6, "distancia": 352, "precio": 480, "tipo": "parcial", "origen_coords": [-3.7038, 40.4168], "destino_coords": [-0.3763, 39.4699], "descripcion": "Electrónica de consumo"},
    {"id": "c8", "origen": "A Coruña", "destino": "Madrid", "peso": 22, "distancia": 603, "precio": 1100, "tipo": "completa", "origen_coords": [-8.3959, 43.3623], "destino_coords": [-3.7038, 40.4168], "descripcion": "Conservas y alimentación seca"},
    {"id": "c9", "origen": "Murcia", "destino": "Barcelona", "peso": 10, "distancia": 580, "precio": 750, "tipo": "frigorifico", "origen_coords": [-1.1307, 37.9922], "destino_coords": [2.1734, 41.3851], "descripcion": "Frutas y verduras frescas"},
    {"id": "c10", "origen": "Valladolid", "destino": "Sevilla", "peso": 16, "distancia": 534, "precio": 920, "tipo": "completa", "origen_coords": [-4.7245, 41.6523], "destino_coords": [-5.9845, 37.3891], "descripcion": "Materiales de construcción"}
]

DEMO_ENVIOS = [
    {"id": "e1", "origen": "Madrid", "destino": "Barcelona", "peso": 18, "precio": 1250, "estado": "en_transito", "progreso": 65, "transportista": "Miguel Fernández"},
    {"id": "e2", "origen": "Valencia", "destino": "Bilbao", "peso": 14, "precio": 1100, "estado": "en_transito", "progreso": 30, "transportista": "Ana García"},
    {"id": "e3", "origen": "Sevilla", "destino": "Madrid", "peso": 20, "precio": 980, "estado": "recogida_pendiente", "progreso": 10, "transportista": "Pedro Ruiz"},
    {"id": "e4", "origen": "Barcelona", "destino": "Valencia", "peso": 8, "precio": 520, "estado": "en_transito", "progreso": 85, "transportista": "Laura Martín"},
    {"id": "e5", "origen": "Zaragoza", "destino": "Madrid", "peso": 12, "precio": 680, "estado": "entregado", "progreso": 100, "transportista": "Carlos Torres"},
    {"id": "e6", "origen": "Málaga", "destino": "Barcelona", "peso": 25, "precio": 1800, "estado": "entregado", "progreso": 100, "transportista": "Roberto Sánchez"},
    {"id": "e7", "origen": "Bilbao", "destino": "Sevilla", "peso": 16, "precio": 1450, "estado": "en_transito", "progreso": 45, "transportista": "María López"}
]

DEMO_TRANSPORTISTAS = [
    {"id": "t1", "nombre": "Miguel Fernández", "email": "miguel@transporte.es", "vehiculo": "Tráiler 40t", "capacidad": 24, "rating": 4.8, "envios_completados": 234, "estado": "en_ruta"},
    {"id": "t2", "nombre": "Ana García", "email": "ana@logistica.com", "vehiculo": "Camión rígido 12t", "capacidad": 12, "rating": 4.9, "envios_completados": 187, "estado": "en_ruta"},
    {"id": "t3", "nombre": "Pedro Ruiz", "email": "pedro@envios.es", "vehiculo": "Frigorífico 18t", "capacidad": 18, "rating": 4.7, "envios_completados": 312, "estado": "disponible"},
    {"id": "t4", "nombre": "Laura Martín", "email": "laura@carga.com", "vehiculo": "Furgoneta 3.5t", "capacidad": 3, "rating": 4.6, "envios_completados": 98, "estado": "disponible"},
    {"id": "t5", "nombre": "Carlos Torres", "email": "carlos@rutas.es", "vehiculo": "Tráiler 40t", "capacidad": 24, "rating": 4.5, "envios_completados": 456, "estado": "no_disponible"},
    {"id": "t6", "nombre": "Roberto Sánchez", "email": "roberto@trans.com", "vehiculo": "Camión lona 18t", "capacidad": 18, "rating": 4.8, "envios_completados": 278, "estado": "disponible"},
    {"id": "t7", "nombre": "María López", "email": "maria@express.es", "vehiculo": "Tráiler 40t", "capacidad": 24, "rating": 4.9, "envios_completados": 521, "estado": "en_ruta"},
    {"id": "t8", "nombre": "Javier Díaz", "email": "javier@diaz.com", "vehiculo": "Camión rígido 12t", "capacidad": 12, "rating": 4.4, "envios_completados": 143, "estado": "disponible"}
]


# ── Seed data on startup ──
@app.on_event("startup")
async def seed_data():
    """Seed demo data if collections are empty."""
    if await db.cargas.count_documents({}) == 0:
        await db.cargas.insert_many(DEMO_CARGAS)
        logger.info("Seeded cargas collection")
    if await db.envios.count_documents({}) == 0:
        await db.envios.insert_many(DEMO_ENVIOS)
        logger.info("Seeded envios collection")
    if await db.transportistas.count_documents({}) == 0:
        await db.transportistas.insert_many(DEMO_TRANSPORTISTAS)
        logger.info("Seeded transportistas collection")


# ── Public endpoints ──
@api_router.get("/")
async def root():
    return {"message": "Carga Platform API v2.0", "status": "ok"}


@api_router.get("/stats")
async def get_stats():
    cargas_count = await db.cargas.count_documents({})
    envios_activos = await db.envios.count_documents({"estado": {"$ne": "entregado"}})
    completados = await db.envios.count_documents({"estado": "entregado"})
    transportistas_count = await db.transportistas.count_documents({"estado": {"$ne": "no_disponible"}})
    return {
        "cargas_disponibles": cargas_count,
        "envios_en_curso": envios_activos,
        "completados_mes": completados,
        "transportistas_activos": transportistas_count
    }


@api_router.get("/cargas")
async def get_cargas(
    tipo: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100)
):
    query = {}
    if tipo and tipo != "todas":
        query["tipo"] = tipo
    skip = (page - 1) * page_size
    cargas = await db.cargas.find(query, {"_id": 0}).skip(skip).limit(page_size).to_list(page_size)
    total = await db.cargas.count_documents(query)
    return {"cargas": cargas, "total": total, "page": page, "page_size": page_size}


@api_router.get("/envios")
async def get_envios(estado: Optional[str] = None):
    query = {}
    if estado and estado != "todos":
        query["estado"] = estado
    envios = await db.envios.find(query, {"_id": 0}).to_list(100)
    return {"envios": envios}


@api_router.get("/transportistas")
async def get_transportistas():
    transportistas = await db.transportistas.find({}, {"_id": 0}).to_list(100)
    return {"transportistas": transportistas}


# ── Auth endpoints ──
@auth_router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    """Get current user profile."""
    profile = await db.profiles.find_one({"supabase_id": user["id"]}, {"_id": 0})
    if profile:
        return {"user": user, "profile": profile}
    return {"user": user, "profile": None}


@auth_router.post("/profile")
async def create_or_update_profile(profile_data: UserProfileCreate, user: dict = Depends(get_current_user)):
    """Create or update user profile."""
    existing = await db.profiles.find_one({"supabase_id": user["id"]})
    
    if existing:
        await db.profiles.update_one(
            {"supabase_id": user["id"]},
            {"$set": profile_data.model_dump()}
        )
        updated = await db.profiles.find_one({"supabase_id": user["id"]}, {"_id": 0})
        return {"message": "Perfil actualizado", "profile": updated}
    else:
        new_profile = UserProfile(
            supabase_id=user["id"],
            email=user["email"],
            **profile_data.model_dump()
        )
        doc = new_profile.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.profiles.insert_one(doc)
        doc.pop('_id', None)
        return {"message": "Perfil creado", "profile": doc}


# ── Protected endpoints ──
@api_router.post("/cargas/accept/{carga_id}")
async def accept_carga(carga_id: str, user: dict = Depends(get_current_user)):
    """Accept a carga and create an envio."""
    carga = await db.cargas.find_one({"id": carga_id}, {"_id": 0})
    if not carga:
        raise HTTPException(status_code=404, detail="Carga no encontrada")
    
    envio = {
        "id": str(uuid.uuid4()),
        "origen": carga["origen"],
        "destino": carga["destino"],
        "peso": carga["peso"],
        "precio": carga["precio"],
        "estado": "recogida_pendiente",
        "progreso": 5,
        "transportista": user.get("user_metadata", {}).get("full_name", user["email"]),
        "user_id": user["id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.envios.insert_one(envio)
    await db.cargas.delete_one({"id": carga_id})
    
    envio.pop('_id', None)
    return {"message": "Carga aceptada", "envio": envio}


@api_router.post("/chat")
async def chat(body: dict, user: Optional[dict] = Depends(get_optional_user)):
    """Chat endpoint with basic responses."""
    message = body.get("message", "")
    session_id = body.get("session_id", str(uuid.uuid4()))
    
    lower_msg = message.lower()
    response = "Puedo ayudarte a encontrar cargas. Prueba preguntando por una ciudad o tipo de carga."
    cargas_encontradas = []
    
    # Search cargas based on message
    all_cargas = await db.cargas.find({}, {"_id": 0}).to_list(100)
    
    if "madrid" in lower_msg or "barcelona" in lower_msg:
        cargas_encontradas = [c for c in all_cargas if 
            "madrid" in c["origen"].lower() or "barcelona" in c["destino"].lower() or
            "barcelona" in c["origen"].lower() or "madrid" in c["destino"].lower()]
        response = f"He encontrado {len(cargas_encontradas)} cargas relacionadas con Madrid/Barcelona:"
    elif "valencia" in lower_msg:
        cargas_encontradas = [c for c in all_cargas if 
            "valencia" in c["origen"].lower() or "valencia" in c["destino"].lower()]
        response = f"He encontrado {len(cargas_encontradas)} cargas relacionadas con Valencia:"
    elif "urgente" in lower_msg:
        cargas_encontradas = [c for c in all_cargas if c["tipo"] == "urgente"]
        response = f"Hay {len(cargas_encontradas)} cargas urgentes disponibles:"
    elif "hola" in lower_msg or "ayuda" in lower_msg:
        response = "¡Hola! Puedes preguntarme sobre cargas por ciudad (Madrid, Barcelona, Valencia) o tipo (urgente, frigorífico, etc.)."
    
    return {
        "response": response,
        "cargas_encontradas": cargas_encontradas,
        "session_id": session_id,
        "suggested_actions": ["Ver mapa", "Filtrar cargas"]
    }


# Include routers
app.include_router(api_router)
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
