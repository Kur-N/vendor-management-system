from flask import Flask, redirect, url_for
import config
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.vendor_routes import vendor_bp
from routes.bank_routes import bank_bp
from routes.user_routes import user_bp

# 1. Inisialisasi Logging & Config
config.setup_logging()

app = Flask(__name__)

# 2. Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(vendor_bp)
app.register_blueprint(bank_bp)
app.register_blueprint(user_bp)

@app.route("/")
def index():
    return redirect(url_for('dashboard.dashboard'))

if __name__ == '__main__':
    # WAJIB host='0.0.0.0' agar bisa diakses dari luar container Podman
    app.run(host='0.0.0.0', port=5000, debug=True)