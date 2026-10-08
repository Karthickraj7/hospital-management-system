
# Create your views here.
import posixpath
from pathlib import Path
from .serializers import *
from django.utils._os import safe_join
from django.views.static import serve as static_serve
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http.response import JsonResponse

def serve_react(request, path, document_root=None):
    path = posixpath.normpath(path).lstrip("/")
    fullpath = Path(safe_join(document_root, path))
    if fullpath.is_file():
        return static_serve(request, path, document_root)
    else:
        return static_serve(request, "index.html",document_root)


class TherapyListDetialsCreateView(generics.ListCreateAPIView):
    queryset = TherapyType_Detials.objects.all()
    serializer_class = TherapyTypeDetailsSerializer
   
class TherapyDetialsRetriveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TherapyType_Detials.objects.all()
    serializer_class = TherapyTypeDetailsSerializer            

import json

@csrf_exempt
@require_http_methods(["GET"])
def extendsession(request):
    try:
        username = request.GET.get("username")
        session_id = request.GET.get("session_id")
        use = UserRegister_Master_Details.objects.filter(User_Id=username).first()
        print("Heartbeat:", username, session_id)

        if not username or not session_id:
            return JsonResponse(
                {"active": False, "message": "Missing parameters"},
                status=400
            )

  
      

        # 🔹 Validate session
        ses = UserLoginSession.objects.filter(
            id=session_id,
            user=use,
            Status=True
        ).first()

        if not ses:
            return JsonResponse(
                {"active": False, "message": "Session expired"},
                status=401
            )

        # 🔁 Extend session (example)
        
        return JsonResponse({"active": True})

    except Exception as e:
        print("Extend session error:", e)
        return JsonResponse(
            {"active": False, "error": str(e)},
            status=500
        )