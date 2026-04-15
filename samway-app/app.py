from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
from datetime import datetime
import os

app = Flask(__name__)

# --- CONFIGURACIÓN DE BASE DE DATOS ---
# Usamos tu contraseña y cadena de conexión de MongoDB Atlas
atlas_uri = "mongodb+srv://Shiza:NSJ2mrKkEbhOc2n9@samway.dpiqvdr.mongodb.net/samway_db?retryWrites=true&w=majority&appName=Samway"
app.config["MONGO_URI"] = os.environ.get("MONGO_URI", atlas_uri)
mongo = PyMongo(app)

# --- CONFIGURACIÓN DE CORS ---
# Permite que tu app de Angular (Netlify) se comunique con este servidor
CORS(app, resources={r"/api/*": {"origins": "*"}},
      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

def serialize_doc(doc):
    """Convierte el _id de MongoDB en un string para que Angular lo entienda."""
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# --- RUTAS DE PEDIDOS ---
@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    pedidos = [serialize_doc(p) for p in mongo.db.pedidos.find()]
    return jsonify(pedidos), 200

@app.route('/api/pedidos', methods=['POST'])
def create_pedido():
    data = request.json
    data['estado'] = data.get('estado', 'Pendiente')
    result = mongo.db.pedidos.insert_one(data)
    return jsonify({"id": str(result.inserted_id)}), 201

@app.route('/api/pedidos/<id>', methods=['PUT'])
def update_status(id):
    nuevo_estado = request.json.get('estado')
    mongo.db.pedidos.update_one({'_id': ObjectId(id)}, {'$set': {'estado': nuevo_estado}})
    return jsonify({"msg": "Estado actualizado"}), 200

@app.route('/api/pedidos/<id>', methods=['DELETE'])
def delete_pedido(id):
    mongo.db.pedidos.delete_one({'_id': ObjectId(id)})
    return jsonify({"msg": "Eliminado"}), 200

# --- RUTAS DE NEWSLETTER ---
@app.route('/api/newsletter', methods=['GET', 'POST'])
def handle_newsletter():
    if request.method == 'POST':
        data = request.json
        correo = data.get("correo") 
        if not correo:
            return jsonify({"msg": "Correo requerido"}), 400
        
        existente = mongo.db.newsletter.find_one({"correo": correo})
        if existente:
            return jsonify({"msg": "Ya estás suscrito"}), 400
        
        data['fecha'] = datetime.now().strftime("%d/%m/%Y %H:%M")
        result = mongo.db.newsletter.insert_one(data)
        return jsonify({"id": str(result.inserted_id)}), 201
    
    # Si es GET
    emails = [serialize_doc(e) for e in mongo.db.newsletter.find()]
    return jsonify(emails), 200

# --- RUTAS DE PRODUCTOS (INVENTARIO) ---
@app.route('/api/productos', methods=['GET', 'POST'])
def handle_productos():
    if request.method == 'POST':
        data = request.json
        result = mongo.db.productos.insert_one(data)
        return jsonify({"id": str(result.inserted_id)}), 201
    
    # Si es GET
    productos = [serialize_doc(p) for p in mongo.db.productos.find()]
    return jsonify(productos), 200

@app.route('/api/productos/<id>', methods=['PUT', 'DELETE'])
def handle_producto_id(id):
    if request.method == 'PUT':
        data = request.json
        if '_id' in data: 
            del data['_id']
        mongo.db.productos.update_one({'_id': ObjectId(id)}, {'$set': data})
        return jsonify({"msg": "Actualizado"}), 200
    
    if request.method == 'DELETE':
        mongo.db.productos.delete_one({'_id': ObjectId(id)})
        return jsonify({"msg": "Eliminado"}), 200

# --- CONFIGURACIÓN DE ARRANQUE ---
if __name__ == '__main__':
    # Usamos el puerto asignado por el servidor (Render) o el 5000 por defecto
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)