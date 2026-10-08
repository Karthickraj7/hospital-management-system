from django.apps import AppConfig


class QualityindicatorsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'QualityIndicators'
    def ready(self):
        import QualityIndicators.Signal
        print("QualityIndicators signals module imported successfully.")