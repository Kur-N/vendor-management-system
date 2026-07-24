from flask import Blueprint, request, jsonify
# Sesuaikan import Redis/config Anda di backend
import commonRedis # atau modul redis backend Anda

session_bp = Blueprint('session_bp', __name__)

@session_bp.route("/session", methods=['GET'])
def get_session():
    # Mengambil cookie KAPITA yang dikirim dari frontend
    cookie_data = request.cookies.get('KAPITA')
    
    if not cookie_data:
        return jsonify({'data': None, 'message': "Cookie KAPITA tidak ditemukan"}), 400
        
    # Ambil data dari Redis di backend
    session_data, status = commonRedis.getCookieData(cookieData=cookie_data)
    
    if status:
        return jsonify({'data': session_data, 'message': "Berhasil get session data"}), 200
        
    return jsonify({'data': None, 'message': "Gagal get session data atau sesi kedaluwarsa"}), 400