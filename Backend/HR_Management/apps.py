from django.apps import AppConfig


class HrManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'HR_Management'

    def ready(self):
        from .scheduler import start_scheduler
        start_scheduler()  