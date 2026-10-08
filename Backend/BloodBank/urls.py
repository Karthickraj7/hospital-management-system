from django.urls import path
from .views import *

urlpatterns = [
    path('question-group/',BBQuestionCreateView.as_view(), name='question_group_list'),  # GET all question groups
    path('question-group/create/',BBQuestionCreateView.as_view(), name='question_group_create'),  # POST create question group
    path('question-group/update/<int:pk>/',BBQusetionUpdateView.as_view(), name='question_group_update'),  # PUT update question group
    path('question-group/delete/<int:pk>/',BBQuestionDeleteView.as_view(), name='question_group_delete'),  # DELETE question group
    
    
    # bag type master
    
    path('bag-type/', BagTypeListCreateView.as_view(), name='bagtype-list-create'),
    path('bag-type/create/', BagTypeListCreateView.as_view(), name='bagtype-create'),
    path('bag-type/update/<int:pk>/', BagTypeUpdateView.as_view(), name='bagtype-update'),
    path('bag-type/delete/<int:pk>/', BagTypeDeleteView.as_view(), name='bagtype-delete'),
    
    
    # titre master
    
    path('titre/', TitreListCreateView.as_view(), name='titre-list-create'),
    path('titre/create/', TitreListCreateView.as_view(), name='titre-create'),
    path('titre/update/<int:pk>/', TitreUpdateView.as_view(), name='titre-update'),
    path('titre/delete/<int:pk>/', TitreDeleteView.as_view(), name='titre-delete'),\
        
        
        # blood bank master
        
     path('BloodBankMaster/', BloodBankMasterListCreateView.as_view(), name='bloodbank-list-create'),
    path('BloodBankMaster/update/<int:pk>/', BloodBankMasterRetrieveUpdateDestroyView.as_view(), name='bloodbank-update'),
    path('BloodBankMaster/delete/<int:pk>/', BloodBankMasterRetrieveUpdateDestroyView.as_view(), name='bloodbank-delete'),
    
    
    # donor master
    
    path('Donor/master/', DonorMasterListCreateView.as_view(), name='donor-list-create'),
    path('Donor/master/by/id/<str:pk>/',DonorMasterListCreateView.as_view(),name='donor-list-by-id'),
    path('Donor/master/update/<str:pk>/', DonorMasterRetrieveUpdateDestroyView.as_view(), name='donor-update'),
    path('Donor/master/delete/<str:pk>/', DonorMasterRetrieveUpdateDestroyView.as_view(), name='donor-delete'),
    
    
    # blood group list
    
     path('BloodGroup/list/', BloodGroupListCreateView.as_view(), name='bloodgroup-list'),
     path('BloodGroup/by/id/<int:pk>/', BloodGroupRetrieveUpdateDestroyView.as_view(), name='bloodgroup-list'),
     path('BloodGroup/delete/<int:pk>/', BloodGroupRetrieveUpdateDestroyView.as_view(), name='bloodgroup-list'),
]