from django.apps import AppConfig


class InsuranceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Insurance'
    def ready(self):
        import Insurance.Signals
