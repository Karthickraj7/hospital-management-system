from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api/patients', views.DicomPatientViewSet)
router.register(r'api/studies', views.DicomStudyViewSet)
router.register(r'api/series', views.DicomSeriesViewSet)
router.register(r'api/images', views.DicomImageViewSet)

urlpatterns = [
    # Main viewer
    path('viewer/<int:study_id>/', views.dicom_viewer, name='dicom_viewer'),
    path('image/<int:image_id>/', views.get_dicom_image, name='get_dicom_image'),
    path('study/<int:study_id>/metadata/', views.get_study_metadata, name='study_metadata'),
    
    # DICOM receiver endpoint
    path('dicom/receive/', views.dicom_store_scp, name='dicom_receive'),
    
    # Worklist management
    path('worklist/', views.worklist_api, name='worklist_api'),
    path('worklist/<int:item_id>/update/', views.update_worklist_status, name='update_worklist'),
    
    # API endpoints
    path('', include(router.urls)),
]