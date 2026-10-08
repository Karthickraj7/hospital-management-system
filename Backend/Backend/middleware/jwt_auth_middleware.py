# backend/middleware/jwt_auth_middleware.py

import jwt
from django.http import JsonResponse
from django.conf import settings

SECRET_KEY = 'vesoftometic_123'
class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        excluded_paths = ["/Masters/get_Location_data_for_login","/Masters/login_logic","/Masters/Hospital_Detials_link","/Masters/get_data","/Masters/Department_Detials_link"]
        if request.path in excluded_paths:
            return self.get_response(request)

        auth_header = request.META.get("HTTP_AUTHORIZATION")
        print("auth_header hashwar :", auth_header)
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Unauthorized. Missing token."}, status=401)

        token = auth_header.split(" ")[1]
        print("token :",token)
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            print("payload :",payload)
            request.user_payload = payload
        except jwt.ExpiredSignatureError:
            print("Token expired")
            return JsonResponse({"error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            print("Token Invalid")
            return JsonResponse({"error": "Invalid token"}, status=401)

        return self.get_response(request)
    

