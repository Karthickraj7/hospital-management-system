from django.apps import AppConfig


class MrdConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'MRD'
    def ready(self):
        import MRD.Signals