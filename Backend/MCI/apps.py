import os
from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class MciConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'MCI'

    def ready(self):
        logger.info("MciConfig.ready called")
        # Import signals
        import MCI.Signals
        # Start scheduler only in the main process
        if os.environ.get('RUN_MAIN') == 'true':  # Prevents running in manage.py sub-processes
            from .scheduler import start_scheduler
            try:
                start_scheduler()
                logger.info("Scheduler started successfully")
            except Exception as e:
                logger.error(f"Error starting scheduler: {e}")