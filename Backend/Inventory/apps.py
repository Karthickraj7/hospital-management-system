from django.apps import AppConfig


class InventoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Inventory'
    scheduler_started = False
    def ready(self):
        import Inventory.Signals
        if not self.scheduler_started:
            from .task import check_and_update_expiry_status_stsrt_fun, start_inventory_check_scheduler,start_inventory_scheduler
        #     try:
        #         check_and_update_expiry_status_stsrt_fun()
        #         self.scheduler_started = True
        #     except Exception as e:
        #         print(f'Error starting scheduler: {e}')
            
        #     try:
        #         start_inventory_check_scheduler()
        #         self.scheduler_started = True
            

        #     except Exception as e:
        #         print(f'Error starting scheduler: {e}')
            # try:
            #     # start_inventory_scheduler()
            # except Exception as e :
            #     print(f'erro starting scheduler {e}')    
                
                
                