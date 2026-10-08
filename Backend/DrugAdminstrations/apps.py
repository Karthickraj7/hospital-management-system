from django.apps import AppConfig


class DrugadminstrationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'DrugAdminstrations'
    # Flag to ensure scheduler is only started once
    scheduler_started = False

    def ready(self):
        import Ip_Workbench.Signals  # Ensure your signals module is correctly imported
        
        # if not self.scheduler_started:
        #     from .scheduler import start_scheduler
        #     try:
        #         start_scheduler()
        #         self.scheduler_started = True
        #     except Exception as e:
        #         print(f'Error starting scheduler: {e}')
