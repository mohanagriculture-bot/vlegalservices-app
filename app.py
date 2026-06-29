from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__, template_folder='.', static_folder='.')

DB_FILE = 'database.json'

# Default structural template layout if the file doesn't exist yet
DEFAULT_DB = {
    "clients": {
        "individual": [
            {
                "id": 1,
                "name": "Arun Kumar S.",
                "father": "Mr. Sundaram",
                "mobile": "+91 98423 11022",
                "email": "arun@example.com",
                "address": "12, West Cross Street",
                "state": "Tamil Nadu",
                "district": "Coimbatore",
                "pincode": "641002",
                "aadhaar": "[Aadhaar Redacted]",
                "pan": "ABCPA1234F"
            },
            {
                "id": 2,
                "name": "Meenakshi Sundaram",
                "father": "Mr. Perumal",
                "mobile": "+91 94430 55411",
                "email": "meenakshi@example.com",
                "address": "45, North Car Street",
                "state": "Tamil Nadu",
                "district": "Theni",
                "pincode": "625531",
                "aadhaar": "[Aadhaar Redacted]",
                "pan": "BVKPM9876K"
            }
        ],
        "corporate": [
            {
                "id": 1,
                "name": "Kosh Finpro Private Ltd",
                "type": "Private Limited Company",
                "pan": "AAACK1234F",
                "gst": "33AAACK1234F1Z1",
                "contact_name": "S. Hariprasath",
                "designation": "Associate",
                "mobile": "+91 95000 12345",
                "email": "corporate@koshfinpro.in",
                "address": "Commercial Hub Plaza, Suite 4B",
                "state": "Tamil Nadu",
                "district": "Coimbatore"
            }
        ]
    },
    "services": [
        {
            "code": "SRV-2026-1001",
            "client": "Kosh Finpro Private Ltd",
            "type": "Legal opinion",
            "nature": "Very Urgent",
            "assignee": "Mohankumar R.",
            "status": "Pending",
            "date_start": "2026-06-15",
            "date_end": "",
            "referred": "Internal Firm",
            "remarks": "Priority review track checking"
        },
        {
            "code": "SRV-2026-1002",
            "client": "Arun Kumar S.",
            "type": "Registration",
            "nature": "Ordinary",
            "assignee": "S. Hariprasath",
            "status": "Disposed",
            "date_start": "2026-06-10",
            "date_end": "2026-06-12",
            "referred": "Direct",
            "remarks": "Property filing completed"
        }
    ],
    "invoices": [
        {
            "id": "INV-2026-101",
            "srv_code": "SRV-2026-1001",
            "client": "Kosh Finpro Private Ltd",
            "amount": 15000,
            "due_date": "2026-07-15",
            "status": "Pending",
            "desc": "Professional legal opinion execution fees"
        }
    ],
    "counters": {
        "client_ind": 2,
        "client_corp": 1,
        "service": 1002,
        "invoice": 101
    }
}

# Helper functions to handle reading and writing to disk file storage automatically
def load_data():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as f:
            json.dump(DEFAULT_DB, f, indent=4)
        return DEFAULT_DB
    with open(DB_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return DEFAULT_DB

def save_data(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# ---------------------------------------------------------
# ROUTING CORE WORKSPACES
# ---------------------------------------------------------
@app.route('/')
def index_portal_home():
    return render_template('index.html')

# ---------------------------------------------------------
# 1. CLIENTS SYSTEM API ENDPOINTS
# ---------------------------------------------------------
@app.route('/api/clients/add', methods=['POST'])
def api_add_client():
    database = load_data()
    data = request.json or {}
    classification = data.get('classification', 'individual')
    
    if classification == 'individual':
        database["counters"]["client_ind"] += 1
        new_client = {
            "id": database["counters"]["client_ind"],
            "name": data.get('name', 'Unnamed Individual'),
            "father": data.get('father', ''),
            "mobile": data.get('mobile', ''),
            "email": data.get('email', ''),
            "address": data.get('address', ''),
            "state": data.get('state', ''),
            "district": data.get('district', ''),
            "pincode": data.get('pincode', ''),
            "aadhaar": "[Aadhaar Redacted]", # Secure system placeholder compliance tracking rule
            "pan": data.get('pan', '')
        }
        database["clients"]["individual"].append(new_client)
    else:
        database["counters"]["client_corp"] += 1
        new_client = {
            "id": database["counters"]["client_corp"],
            "name": data.get('name', 'Unnamed Corporate'),
            "type": data.get('type', 'Private Limited Company'),
            "pan": data.get('pan', ''),
            "gst": data.get('gst', ''),
            "contact_name": data.get('contact_name', ''),
            "designation": data.get('designation', ''),
            "mobile": data.get('mobile', ''),
            "email": data.get('email', ''),
            "address": data.get('address', ''),
            "state": data.get('state', ''),
            "district": data.get('district', '')
        }
        database["clients"]["corporate"].append(new_client)
        
    save_data(database)
    return jsonify({"success": True, "message": "Client added to permanent disk files successfully!", "client": new_client})

@app.route('/api/clients/get', methods=['GET'])
def api_get_clients():
    database = load_data()
    return jsonify(database["clients"])

# ---------------------------------------------------------
# 2. SERVICES SYSTEM API ENDPOINTS
# ---------------------------------------------------------
@app.route('/api/services/create', methods=['POST'])
def api_create_service():
    database = load_data()
    data = request.json or {}
    database["counters"]["service"] += 1
    generated_code = f"SRV-2026-{database['counters']['service']}"
    
    new_service = {
        "code": generated_code,
        "client": data.get('client'),
        "type": data.get('type'),
        "nature": data.get('nature'),
        "assignee": data.get('assignee'),
        "status": data.get('status', 'Pending'),
        "date_start": data.get('date_start'),
        "date_end": data.get('date_end', ''),
        "referred": data.get('referred', ''),
        "remarks": data.get('remarks', '')
    }
    database["services"].append(new_service)
    save_data(database)
    return jsonify({"success": True, "code": generated_code, "service": new_service})

@app.route('/api/services/get', methods=['GET'])
def api_get_services():
    database = load_data()
    return jsonify(database["services"])

# ---------------------------------------------------------
# 3. ACCOUNTS SYSTEM API ENDPOINTS
# ---------------------------------------------------------
@app.route('/api/accounts/invoice/generate', methods=['POST'])
def api_generate_invoice():
    database = load_data()
    data = request.json or {}
    database["counters"]["invoice"] += 1
    generated_inv_id = f"INV-2026-{database['counters']['invoice']}"
    
    new_invoice = {
        "id": generated_inv_id,
        "srv_code": data.get('srv_code'),
        "client": data.get('client'),
        "amount": int(data.get('amount') or 0),
        "due_date": data.get('due_date', '--'),
        "status": "Pending",
        "desc": data.get('desc', 'Professional consultation fee charges')
    }
    database["invoices"].append(new_invoice)
    save_data(database)
    return jsonify({"success": True, "invoice_id": generated_inv_id, "invoice": new_invoice})

@app.route('/api/accounts/invoice/pay', methods=['POST'])
def api_pay_invoice():
    database = load_data()
    data = request.json or {}
    inv_id = data.get('invoice_id')
    
    for inv in database["invoices"]:
        if inv["id"] == inv_id:
            inv["status"] = "Paid"
            save_data(database)
            return jsonify({"success": True, "message": f"Invoice {inv_id} recorded as settled permanently."})
            
    return jsonify({"success": False, "message": "Invoice record identifier not found."}), 404

@app.route('/api/accounts/invoice/get', methods=['GET'])
def api_get_invoices():
    database = load_data()
    return jsonify(database["invoices"])


if __name__ == '__main__':
    print("-------------------------------------------------------")
    print(" vLegalServices Persistent Engine Running Live on Port 5000")
    print("-------------------------------------------------------")
    app.run(debug=True, port=5000)