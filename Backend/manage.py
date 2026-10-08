# #!/usr/bin/env python
# """Django's command-line utility for administrative tasks."""
# import os
# import sys


# def main():
#     from django.core.management.commands.runserver import Command as runserver
#     runserver.default_port = "8000"
#     """Run administrative tasks."""
#     os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
    
#     try:
#         from django.core.management import execute_from_command_line
#     except ImportError as exc:
#         raise ImportError(
#             "Couldn't import Django. Are you sure it's installed and "
#             "available on your PYTHONPATH environment variable? Did you "
#             "forget to activate a virtual environment?"
#         ) from exc
#     if "runserver" in sys.argv:
#         # Dynamically run daphne with proper arguments
#         from daphne.cli import CommandLineInterface
#         sys.argv = ["daphne", "Backend.asgi:application", "-p", "8000"]  
#         CommandLineInterface.entrypoint()
#     else:
#         execute_from_command_line(sys.argv)


# if __name__ == '__main__':
#     main()



# !/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    from django.core.management.commands.runserver import Command as runserver
    runserver.default_port = "8000"
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()