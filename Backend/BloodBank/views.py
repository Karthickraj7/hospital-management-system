from django.shortcuts import render
import json
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .serializers import *
from rest_framework import generics
# # # GET - Fetch all question groups
# # @csrf_exempt
# # def question_group_view(request):
# #     if request.method == "GET":
# #         groups = BBQuestionGroup.objects.all().order_by('order')
# #         data = []
# #         for group in groups:
# #             data.append({
# #                 "id": group.id,
# #                 "code": group.code,
# #                 "description": group.description,
# #                 "order": group.order,
# #                 "status":group.status
# #             })
# #         return JsonResponse(data, safe=False)
# #     return HttpResponseNotAllowed(['GET'])

# # # POST - Create a new question group
# # @csrf_exempt
# # def question_group_create(request):
# #     if request.method == "POST":
# #         try:
# #             body = json.loads(request.body)
# #             group = BBQuestionGroup.objects.create(
# #                 code=body["code"],
# #                 description=body["description"],
# #                 order=body["order"],
# #                 status=body["status"]
# #             )
# #             return JsonResponse({"id": group.id}, status=201)
# #         except Exception as e:
# #             return HttpResponseBadRequest(str(e))
# #     return HttpResponseNotAllowed(['POST'])

# # # PUT - Update an existing question group
# # @csrf_exempt
# # def question_group_update(request, group_id):
# #     try:
# #         group = BBQuestionGroup.objects.get(id=group_id)
# #     except BBQuestionGroup.DoesNotExist:
# #         return JsonResponse({"error": "Group not found"}, status=404)

# #     if request.method == "PUT":
# #         try:
# #             data = json.loads(request.body)
# #             group.code = data.get("code", group.code)
# #             group.description = data.get("description", group.description)
# #             group.order = data.get("order", group.order)
# #             group.status = data.get("status",group.status)
# #             group.save()
# #             return JsonResponse({"message": "Updated"})
# #         except Exception as e:
# #             return HttpResponseBadRequest(str(e))
# #     return HttpResponseNotAllowed(['PUT'])

# # DELETE - Delete a question group
# @csrf_exempt
# def question_group_delete(request, group_id):
#     try:
#         group = BBQuestionGroup.objects.get(id=group_id)
#     except BBQuestionGroup.DoesNotExist:
#         return JsonResponse({"error": "Group not found"}, status=404)

#     if request.method == "DELETE":
#         group.delete()
#         return JsonResponse({"message": "Deleted"})
#     return HttpResponseNotAllowed(['DELETE'])

# # serialzers api for bag type master
class BBQuestionCreateView(generics.ListCreateAPIView):
    queryset = BBQuestionGroup.objects.all().order_by('id')
    serializer_class = BbQuestionSerializer    
    
class BBQusetionUpdateView(generics.RetrieveUpdateAPIView):
    queryset  = BBQuestionGroup.objects.all()
    serializer_class = BbQuestionSerializer
    lookup_field = 'pk'
    
class BBQuestionDeleteView(generics.DestroyAPIView):
    queryset = BBQuestionGroup.objects.all()
    serializer_class = BbQuestionSerializer
    lookup_field = 'pk'    

class BagTypeListCreateView(generics.ListCreateAPIView):
    queryset = BagType.objects.all().order_by('id')
    serializer_class = BagTypeSerializer

class BagTypeUpdateView(generics.RetrieveUpdateAPIView):
    queryset = BagType.objects.all()
    serializer_class = BagTypeSerializer
    lookup_field = 'pk'

class BagTypeDeleteView(generics.DestroyAPIView):
    queryset = BagType.objects.all()
    serializer_class = BagTypeSerializer
    lookup_field = 'pk'
    
    
    
# serializer api for TiTre


class TitreListCreateView(generics.ListCreateAPIView):
    queryset = Titre.objects.all().order_by('order')
    serializer_class = TitreSerializer

class TitreUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Titre.objects.all()
    serializer_class = TitreSerializer
    lookup_field = 'pk'

class TitreDeleteView(generics.DestroyAPIView):
    queryset = Titre.objects.all()
    serializer_class = TitreSerializer
    lookup_field = 'pk'
    
    
class BloodBankMasterListCreateView(generics.ListCreateAPIView):
    queryset = BloodBankMaster.objects.all()
    serializer_class = BloodBankMasterSerializer

    def perform_create(self, serializer):
        serializer.save()  # Optionally add additional logic for creation if needed

class BloodBankMasterRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodBankMaster.objects.all()
    serializer_class = BloodBankMasterSerializer
    lookup_field = 'pk'
    
class DonorMasterListCreateView(generics.ListCreateAPIView):
    queryset = DonorMaster.objects.all()
    serializer_class = DonorMasterSerializer

class DonorMasterRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DonorMaster.objects.all()
    serializer_class = DonorMasterSerializer    
    lookup_field = 'pk'
    
class BloodGroupListCreateView(generics.ListCreateAPIView):
    queryset = BloodGroupMaster.objects.all()
    serializer_class = BloodGroupDetailsSerializer    

class BloodGroupRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodGroupMaster.objects.all()
    serializer_class = BloodGroupDetailsSerializer
    lookup_field = 'pk'