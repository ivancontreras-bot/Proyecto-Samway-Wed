from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId

app = Flask(__name__)

# Configuración de base de datos
app.config["MONGO_URI"] = "mongodb://localhost:27017/samway_db"
mongo = PyMongo(app)

# CORS corregido para permitir todos los métodos necesarios
CORS(app, resources={r"/api/*": {"origins": "*"}},
      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Función para convertir el ObjectId de MongoDB a String para JSON
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

#pedidos

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

#correos

@app.route('/api/newsletter', methods=['POST'])
def add_newsletter():
    data = request.json
    # Opcional: Evitar correos duplicados
    existente = mongo.db.newsletter.find_one({"email": data.get("email")})
    if existente:
        return jsonify({"msg": "Ya estas suscrito"}), 200
    
    result = mongo.db.newsletter.insert_one(data)
    return jsonify({"id": str(result.inserted_id)}), 201

@app.route('/api/newsletter', methods=['GET'])
def get_newsletter():
    emails = [serialize_doc(e) for e in mongo.db.newsletter.find()]
    return jsonify(emails), 200

#nuevo producto -

@app.route('/api/productos', methods=['POST'])
def add_producto():
    data = request.json
    # Insertar el nuevo producto en la colección 'productos'
    result = mongo.db.productos.insert_one(data)
    return jsonify({"id": str(result.inserted_id), "msg": "Producto creado"}), 201

@app.route('/api/productos', methods=['GET'])
def get_productos_db():
    # Esta ruta te servirá si luego quieres que el menú de Angular 
    # se cargue desde la base de datos y no desde el array fijo
    productos = [serialize_doc(p) for p in mongo.db.productos.find()]
    return jsonify(productos), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
