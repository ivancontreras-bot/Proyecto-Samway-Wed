from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
from datetime import datetime  # <--- SE AÑADIÓ ESTO

app = Flask(__name__)

# Configuración de base de datos
app.config["MONGO_URI"] = "mongodb://localhost:27017/samway_db"
mongo = PyMongo(app)

# CORS configurado para permitir todos los métodos necesarios
CORS(app, resources={r"/api/*": {"origins": "*"}},
      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# --- PEDIDOS ---
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

# --- NEWSLETTER ---
@app.route('/api/newsletter', methods=['GET', 'POST'])
def handle_newsletter():
    if request.method == 'POST':
        data = request.json
        correo = data.get("correo") 
        
        if not correo:
            return jsonify({"msg": "Correo requerido"}), 400

        existente = mongo.db.newsletter.find_one({"correo": correo})
        if existente:
            return jsonify({"msg": "Ya estas suscrito"}), 400
        
        # --- CAMBIO AQUÍ: GUARDAR FECHA ---
        data['fecha'] = datetime.now().strftime("%d/%m/%Y %H:%M")
            
        result = mongo.db.newsletter.insert_one(data)
        return jsonify({"id": str(result.inserted_id)}), 201
    
    # Si es GET
    emails = [serialize_doc(e) for e in mongo.db.newsletter.find()]
    return jsonify(emails), 200

# --- PRODUCTOS ---
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
        if '_id' in data: del data['_id']
        mongo.db.productos.update_one({'_id': ObjectId(id)}, {'$set': data})
        return jsonify({"msg": "Actualizado"}), 200
    
    if request.method == 'DELETE':
        mongo.db.productos.delete_one({'_id': ObjectId(id)})
        return jsonify({"msg": "Eliminado"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
