from flask import Flask
from flask_restful import Api
from controller.Auth import UserRegistration, UserLogin, ForgotPassword
from controller.vendorcontroller import VendorController, VendorBranch, VendorEquipment
from controller.branchcontroller import BranchController
from controller.bankcontroller import BankController
from controller.usercontroller import UserController, CheckPassword
from controller.sessioncontroller import session_bp
from config import APP_ENV

app = Flask(__name__)
api = Api(app)

api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(ForgotPassword, '/forgot-password')
api.add_resource(VendorController, '/vendor', '/vendor/<string:vendor_id>')
api.add_resource(BranchController, '/branch', '/branch/<string:branch_id>')
api.add_resource(BankController, '/bank', '/bank/<string:bank_id>')
api.add_resource(VendorBranch,"/vendor-branch/<string:vendor_id>")
api.add_resource(VendorEquipment,"/vendor-equipment/<string:vendor_id>")
api.add_resource(UserController,"/user","/user/<string:user_id>")
api.add_resource(CheckPassword,"/check-password/<string:user_id>")
app.register_blueprint(session_bp)


if __name__ == '__main__':
    # Debug aktif hanya jika di environment development
    is_debug = APP_ENV == "development"
    
    # Bind ke 0.0.0.0 agar bisa diakses dari luar container (Docker/Podman)
    app.run(host='0.0.0.0', port=5000, debug=is_debug)