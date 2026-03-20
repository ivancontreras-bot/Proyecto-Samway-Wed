from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId

app = Flask(__name__)

# Configuración de base de datos
app.config["MONGO_URI"] = "mongodb://localhost:27017/samway_db"
mongo = PyMongo(app)

# CORS corregido para permitir PUT y DELETE desde Angular
CORS(app, resources={r"/api/*": {"origins": "*"}},
      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

def serialize_pedido(p):
    p['_id'] = str(p['_id'])
    return p

@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    pedidos = [serialize_pedido(p) for p in mongo.db.pedidos.find()]
    return jsonify(pedidos), 200

@app.route('/api/pedidos', methods=['POST'])
def create_pedido():
    data = request.json
    data['estado'] = data.get('estado', 'Pendiente')
    result = mongo.db.pedidos.insert_one(data)
    return jsonify({"id": str(result.inserted_id)}), 201

# RUTA PARA ACTUALIZAR ESTADO (PUT)
@app.route('/api/pedidos/<id>', methods=['PUT'])
def update_status(id):
    nuevo_estado = request.json.get('estado')
    mongo.db.pedidos.update_one({'_id': ObjectId(id)}, {'$set': {'estado': nuevo_estado}})
    return jsonify({"msg": "Estado actualizado"}), 200

@app.route('/api/pedidos/<id>', methods=['DELETE'])
def delete_pedido(id):
    mongo.db.pedidos.delete_one({'_id': ObjectId(id)})
    return jsonify({"msg": "Eliminado"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
