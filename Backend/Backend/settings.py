
from pathlib import Path
import mysql.connector
from mysql.connector import errorcode
import django
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

print("LOADED SETTINGS.PY FROM:", __file__)
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-*^3rertep@4=xw8+gemuzk+)5q8-x^_3n)3*!c+1@b88q6*=m&'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]




# CORS_ALLOWED_ORIGINS=['https://silverline.vesoft.co.in']

CORS_ALLOW_ALL_ORIGINS=True

CORS_ALLOW_CREDENTIALS = True

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
     'django_extensions',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'django_apscheduler',
    'channels',
    'Masters',
    'Frontoffice',
    'IP',
    'LeninManagement',
    'OutPatient',
    'Workbench',
    'MisReports',
    'Ip_Workbench',
    'Inventory',
    'DrugAdminstrations',
    'Insurance',
    'HR_Management',
    'Finance',
    'AccetCategory',
    'WasteManagement',
    'Cssd',
    'OTManagement',
    'QualityIndicators',
    'MRD',
    'Lab',
    'whiteboard',
    'BloodBank',
    'DoctorPayOut',
    'Radiology',
    'NurseStation',
    'MCI.apps.MciConfig',
    

 
]
# Increase the maximum size of request body allowed for file uploads
DATA_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024 * 20  # 20 MB (for example)


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'Backend.middleware.jwt_auth_middleware.JWTAuthenticationMiddleware',
]

ROOT_URLCONF = 'Backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ASGI_APPLICATION = 'Backend.wsgi.application'


# Optional (but needed for .group_add)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'accept',
    'x-requested-with',
    'Apikey',  # Allow custom header api_key
    'Apipassword',  # Allow custom header api_password
    'Sessionid',
]


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'Trail_Chirayo_backend_11',
#         'USER': 'root',
#         'PASSWORD': '',
#         'HOST': 'localhost',
#         'PORT': '3306',
#          'OPTIONS': {
#             'connect_timeout': 60,  # Increase the connection timeout
#             'read_timeout': 60,     # Increase the read timeout
#             'write_timeout': 60,    # Increase the write timeout
#             # 'init_command': "SET sql_mode='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION'",
#         }
#     }
# }



 
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        # 'NAME': 'kg1',
        'NAME': 'kmc_28_02_26',
        # 'NAME': 'kmc_05_06_2025_server',

        # 'NAME' : 'kmc_27_10_2025',
        'USER': 'root',
        'PASSWORD': 'RELICVESOFT#123',
        'HOST': '127.0.0.1',
        'PORT': '3306',
         'OPTIONS': {
            'connect_timeout': 60,  # Increase the connection timeout
            'read_timeout': 60,     # Increase the read timeout
            'write_timeout': 60,    # Increase the write timeout
            # 'init_command': "SET sql_mode='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION'",
        }
    }
}


# PACS Configuration
PACS_SERVER = 'http://localhost:8042' 




# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'kmc_05_06_2025_server',
#                 # 'NAME': 'kmc_27_10_2025',
#        'USER': 'remoteapi',
#         'PASSWORD': 'kmc@123',
#         'HOST': '192.168.20.160',
#         'PORT': '3306',
#          'OPTIONS': {
#             'connect_timeout': 60,  # Increase the connection timeout
#             'read_timeout': 60,     # Increase the read timeout
#             'write_timeout': 60,    # Increase the write timeout
                   
#         }
#     }
# }




# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         # 'NAME': 'kmc_27_10_2025',
#         'NAME': 'kmch',
#         # 'NAME' : 'kmc_hospital_25_04_2025',
#         'USER': 'root',
#         'PASSWORD': '00000',
#         'HOST': '127.0.0.1',
#         'PORT': '3306', 
#          'OPTIONS': {
#             'connect_timeout': 60,  # Increase the connection timeout
#             'read_timeout': 60,     # Increase the read timeout
#             'write_timeout': 60,    # Increase the write timeout
            
#             # 'init_command': "SET sql_mode='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION'",
#         }
#     }
# }




# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         # 'NAME': 'kmc_27_10_2025',
#         'NAME': 'kmch',
#         # 'NAME' : 'kmc_hospital_25_04_2025',
#         'USER': 'admin',
#         'PASSWORD': 'Vesoft_123!',
#         'HOST': 'vesoft-db.c2tgwem82c9k.us-east-1.rds.amazonaws.com',
#         'PORT': '3306', 
#          'OPTIONS': {
#             'connect_timeout': 60,  # Increase the connection timeout
#             'read_timeout': 60,     # Increase the read timeout
#             'write_timeout': 60,    # Increase the write timeout
            
#             # 'init_command': "SET sql_mode='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION'",
#         }
#     }
# }



CONN_MAX_AGE = 0  # Closes the DB connection after each request


def create_database_if_not_exists():
    django.setup()  # Ensure Django settings are loadedurl

    try:
        connection = mysql.connector.connect(
            host=DATABASES['default']['HOST'],
            user=DATABASES['default']['USER'],
            password=DATABASES['default']['PASSWORD'],
            port=DATABASES['default']['PORT'],
        )
        cursor = connection.cursor()

        # Create database if it does not exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DATABASES['default']['NAME']}")
        cursor.execute(f"USE {DATABASES['default']['NAME']}")
        
        cursor.close()
        connection.close()
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your username or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print(f"Database does not exist and could not be created: {err}")
        else:
            print(err)


# create_database_if_not_exists()


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'
USE_TZ = False





# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
# File Storage
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add your production domain
]


# LOGGING = {
#     'version': 1,
#     'handlers': {
#         'file': {
#             'level': 'DEBUG',
#             'class': 'logging.FileHandler',
#             'filename': '/tmp/django_debug.log',
#         },
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['file'],
#             'level': 'DEBUG',
#             'propagate': True,
#         },
#     },
# }
CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_AGE = 300  # 5 minutes in seconds
SESSION_SAVE_EVERY_REQUEST = True  # Reset timer on every API call
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
