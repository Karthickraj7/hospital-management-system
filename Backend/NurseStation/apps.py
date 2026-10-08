from django.apps import AppConfig
from .task import *


class NursestationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'NurseStation'

    def ready(self):
        import os
        if os.environ.get('RUN_MAIN') == 'true':  # Only start in main process
            from .task import start_test_scheduler
            start_test_scheduler()
