from django.db.models.signals import post_save, post_delete, post_migrate
from django.dispatch import receiver
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

from HR_Management.models import *
from .models import *
from django.http import JsonResponse
from WasteManagement.models import WasteCount




from Finance.models import (Finance_NatureOfGroup_Detailes, 
Finance_GroupMaster_Detailes,Finance_LedgerMasters_Detailes)




@receiver(post_migrate)
def create_default_superadmin(sender, **kwargs):
    if sender.name == 'Masters':  # Replace with the name of your app
        # Check if the admin user already exists
        if not User.objects.filter(username='host').exists():
            # Create roles
            superadmin_role, _ = Role_Master.objects.get_or_create(
                Role_Name='host', defaults={'created_by': 'system'}
            )
            admin_role, _ = Role_Master.objects.get_or_create(
                Role_Name='admin', defaults={'created_by': 'system'}
            )

            # Create Titles
            titles = ['Dr', 'Mr', 'Master', 'Mrs', 'Ms', 'Miss', 'Baby', 'Transgender']
            for title in titles:
                Title_Detials.objects.get_or_create(Title_Name=title, defaults={'created_by': 'system'})

            # Fetch title instance for 'Mr'
            mr_title_instance = Title_Detials.objects.get(Title_Name='Mr')

            # Create employee records
            employee_1, _ = Employee_Personal_Form_Detials.objects.get_or_create(
                Employee_ID='CRTEMPL001',
                defaults={
                    'Tittle': mr_title_instance,
                    'First_Name': 'Vesoft',
                    'Middle_Name': 'Private',
                    'Last_Name': 'Limited',
                    'Gender': 'Male',
                    'DOB': '1999-01-01',
                    'Age': 25,
                    'Marital_Status': 'Single',
                    'E_mail': 'vesoft@gmail.com',
                    'Contact_Number': '8657867876',
                    'created_by': 'system'
                }
            )

            employee_2, _ = Employee_Personal_Form_Detials.objects.get_or_create(
                Employee_ID='CRTEMPL002',
                defaults={
                    'Tittle': mr_title_instance,
                    'First_Name': 'Admin',
                    'Last_Name': '',
                    'Gender': 'Male',
                    'DOB': '1999-01-01',
                    'Age': 25,
                    'Marital_Status': 'Single',
                    'E_mail': 'admin@gmail.com',
                    'Contact_Number': '8451313133',
                    'created_by': 'system'
                }
            )

            # Check if the superuser already exists
            superadmin, created = User.objects.get_or_create(
                username='host',
                defaults={
                    'first_name': 'Vesoft',
                    'last_name': 'Vesoft',
                    'email': 'vesoft@gmail.com',
                    'is_staff': True,
                    'is_active': True
                }
            )
            if created:
                superadmin.set_password("host")  # Set password securely
                superadmin.is_superuser = True
                superadmin.save()

            # Check if the admin user already exists
            admin, created = User.objects.get_or_create(
                username='admin',
                defaults={
                    'first_name': 'admin',
                    'email': 'admin@gmail.com',
                    'is_staff': True,
                    'is_active': True
                }
            )
            if created:
                admin.set_password("admin")
                admin.save()

            # Assign user registration details
            useradmin, _ = UserRegister_Master_Details.objects.get_or_create(
                auth_user_id=superadmin,  # Correct FK reference
                defaults={
                    'EmployeeType': 'EMPLOYEE',
                    'Doctor_Id': None,
                    'Employee_Id': employee_1,
                    'role': superadmin_role,
                    'Access': 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI',
                    'created_by': 'system',
                    'SubAccess': 'A1-1,A1-2,A1-3,A1-4,A1-5,A1-6,A1-7,A1-8,A1-9,A1-10,A1-11,A1-12,A1-13,A1-14,A1-15,A1-16,A1-17,A1-18,A1-19,A1-20,A1-21,A1-22,A1-23,A1-24,A1-25,A1-26,A1-27,A1-28,B2-1,B2-2,B2-3,B2-4,B2-5,B2-6,B2-7,C3-1,C3-2,C3-3,C3-4,C3-5,C3-6,C3-7,C3-8,D4-1,D4-2,D4-3,D4-4,D4-5,D4-6,D4-7,E5-1,E5-2,E5-3,E5-4,E5-5,E5-6,E5-7,E5-8,E5-9,E5-10,F6-1,F6-2,F6-3,F6-4,F6-5,F6-6,F6-7,F6-8,F6-9,F6-10,G7-1,G7-2,G7-3,G7-4,G7-5,G7-6,G7-7,G7-8,G7-9,G7-10,G7-11,G7-12,G7-13,G7-14,G7-15,G7-16,H8-1,H8-2,H8-3,H8-4,H8-5,H8-6,H8-7,H8-8,H8-9,H8-10,H8-11,H8-12,H8-13,H8-14,H8-15,H8-16,H8-17,H8-18,H8-19,H8-20,H8-21,H8-22,I9-1,I9-2,I9-3,I9-4,I9-5,I9-6,I9-7,I9-8,I9-9,I9-10,I9-11,I9-12,I9-13,I9-14,I9-15,I9-16,I9-17,I9-18,I9-19,I9-20,I9-21,I9-22,I9-23,J10-1,J10-2,J10-3,J10-4,J10-5,J10-6,J10-7,J10-8,J10-9,J10-10,J10-11,J10-12,J10-13,J10-14,J10-15,J10-16,J10-17,J10-18,J10-19,J10-20,J10-21,J10-22,J10-23,J10-24,K11-1,K11-2,K11-3,K11-4,K11-5,K11-6,K11-7,K11-8,K11-9,K11-10,K11-11,K11-12,K11-13,K11-14,K11-15,K11-16,K11-17,K11-18,K11-19,K11-20,K11-21,K11-22,K11-23,L12-1,L12-2,L12-3,L12-4,L12-5,L12-6,L12-7,M13-1,M13-2,M13-3,M13-4,M13-5,M13-6,M13-7,M13-8,M13-9,M13-10,N14-1,N14-2,N14-3,N14-4,N14-5,N14-6,N14-7,N14-8,O15-1,O15-2,O15-3,O15-4,O15-5,O15-6,O15-7,O15-8,O15-9,O15-10,O15-11,O15-12,O15-13,O15-14,O15-15,O15-16,O15-17,O15-18,O15-19,O15-20,O15-21,O15-22,O15-23,O15-24,O15-25,O15-26,O15-27,O15-28,O15-29,O15-30,015-31,015-32,015-33,P16-1,P16-2,P16-3,P16-4,P16-5,P16-6,P16-7,P16-8,P16-9,P16-10,P16-11,P16-12,P16-13,P16-14,P16-15,P16-16,P16-17,P16-18,P16-19,P16-20,P16-21,P16-22,P16-23,P16-24,P16-25,P16-26,P16-27,P16-28,P16-29,P16-30,P16-31,P16-32,P16-33,P16-34,P16-35,P16-36,P16-37,P16-38,P16-39,P16-40,P16-41,P16-42,P16-43,P16-44,P16-45,P16-46,P16-47,P16-48,P16-49,P16-50,P16-51,P16-52,P16-53,P16-54,P16-55,P16-56,Q17-1,Q17-2,Q17-3,Q17-4,Q17-5,Q17-6,Q17-7,Q17-8,Q17-9,Q17-10,Q17-11,Q17-12,Q17-13,Q17-14,Q17-15,Q17-16,Q17-17,R18-1,R18-2,R18-3,R18-4,R18-5,R18-6,R18-7,S19-1,S19-2,S19-3,S19-4,S19-5,S19-6,S19-7,S19-8,S19-9,S19-10,S19-11,S19-12,S19-13,S19-14,S19-15,T20-1,T20-2,T20-3,T20-4,T20-5,T20-6,T20-7,T20-8,T20-9,T20-10,T20-11,T20-12,T20-13,T20-14,T20-15,T20-16,T20-17,T20-18,T20-19,T20-20,T20-21,T20-22,T20-23,T20-24,T20-25,T20-26,U21-1,U21-2,U21-3,U21-4,U21-5U21-6,U21-7,U21-8,U21-9,V22-1,V22-2,V22-3,V22-4,V22-5,V22-6,V22-7,V22-8,W23-1,W23-2,W23-3,W23-4,W23-5,W23-6,W23-7,W23-8,W23-9,W23-10,W23-11,W23-12,W23-13,W23-14,W23-15,W23-16,X24-1,X24-2,X24-3,X24-4,Y25-1,Y25-2,Y25-3,Y25-4,Y25-5,Y25-6,Y25-7,Z26-1,Z26-2,Z26-3,Z26-4,Z26-5,Z26-6,Z26-7,AA27-1,AA27-2,AA27-3,AA27-4,AA27-5,AA27-6,AA27-7,AA27-8,AA27-9,AB28-1,AB28-2,AB28-3,AB28-4,AB28-5,AB28-6,Ac29-1,Ac29-2,Ac29-3,Ac29-4,Ac29-5,Ac29-6,AD30-1,AD30-2,AD30-3,AD30-4,AD30-5,AD30-6,AD30-7,AE31-1,AE31-2,AE31-3,AE31-4,AE31-5,AE31-6,AE31-7,AE31-8,AE31-9,AE31-10,AF32-1,AF32-2,AF32-3,AF32-4,AF32-5,AF32-6,AF32-7,AF32-8,AF32-9,AF32-10',
                    'Create':True,
                    'Edit':True,
                    'Delete':True,
                    'Read':True,
                    'plain_text_password':'host',
                }
            )

            admin_entry, _ = UserRegister_Master_Details.objects.get_or_create(
                auth_user_id=admin,
                defaults={
                    'EmployeeType': 'EMPLOYEE',
                    'Doctor_Id': None,
                    'Employee_Id': employee_2,
                    'role': admin_role,
                    'Access': 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI',
                    'created_by': 'system',
                    'SubAccess': 'A1-1,A1-2,A1-3,A1-4,A1-5,A1-6,A1-7,A1-8,A1-9,A1-10,A1-11,A1-12,A1-13,A1-14,A1-15,A1-16,A1-17,A1-18,A1-19,A1-20,A1-21,A1-22,A1-23,A1-24,A1-25,A1-26,A1-27,A1-28,B2-1,B2-2,B2-3,B2-4,B2-5,B2-6,B2-7,C3-1,C3-2,C3-3,C3-4,C3-5,C3-6,C3-7,C3-8,D4-1,D4-2,D4-3,D4-4,D4-5,D4-6,D4-7,E5-1,E5-2,E5-3,E5-4,E5-5,E5-6,E5-7,E5-8,E5-9,E5-10,F6-1,F6-2,F6-3,F6-4,F6-5,F6-6,F6-7,F6-8,F6-9,F6-10,G7-1,G7-2,G7-3,G7-4,G7-5,G7-6,G7-7,G7-8,G7-9,G7-10,G7-11,G7-12,G7-13,G7-14,G7-15,G7-16,H8-1,H8-2,H8-3,H8-4,H8-5,H8-6,H8-7,H8-8,H8-9,H8-10,H8-11,H8-12,H8-13,I9-1,I9-2,I9-3,I9-4,I9-5,I9-6,I9-7,I9-8,I9-9,I9-10,I9-11,I9-12,I9-13,I9-14,I9-15,I9-16,I9-17,I9-18,I9-19,I9-20,I9-21,I9-22,I9-23,J10-1,J10-2,J10-3,J10-4,J10-5,J10-6,J10-7,J10-8,J10-9,J10-10,J10-11,J10-12,J10-13,J10-14,J10-15,J10-16,J10-17,J10-18,J10-19,J10-20,J10-21,J10-22,J10-23,J10-24,K11-1,K11-2,K11-3,K11-4,K11-5,K11-6,K11-7,K11-8,K11-9,K11-10,K11-11,K11-12,K11-13,K11-14,K11-15,K11-16,K11-17,K11-18,K11-19,K11-20,K11-21,K11-22,K11-23,L12-1,L12-2,L12-3,L12-4,L12-5,L12-6,L12-7,L12-8,L12-8,M13-1,M13-2,M13-3,M13-4,M13-5,M13-6,M13-7,M13-8,M13-9,M13-10,N14-1,N14-2,N14-3,N14-4,N14-5,N14-6,N14-7,N14-8,O15-1,O15-2,O15-3,O15-4,O15-5,O15-6,O15-7,O15-8,O15-9,O15-10,O15-11,O15-12,O15-13,O15-14,O15-15,O15-16,O15-17,O15-18,O15-19,O15-20,O15-21,O15-22,O15-23,O15-24,O15-25,O15-26,O15-27,O15-28,O15-29,O15-30,P16-1,P16-2,P16-3,P16-4,P16-5,P16-6,P16-7,P16-8,P16-9,P16-10,P16-11,P16-12,P16-13,P16-14,P16-15,P16-16,P16-17,P16-18,P16-19,P16-20,P16-21,P16-22,P16-23,P16-24,P16-25,P16-26,P16-27,P16-28,P16-29,P16-30,P16-31,P16-32,P16-33,P16-34,P16-35,P16-36,P16-37,P16-38,P16-39,P6-40,P16-41,P16-42,P16-43,P16-44,P16-45,P16-46,P16-47,P16-48,P16-49,P16-50,Q17-1,Q17-2,Q17-3,Q17-4,Q17-5,Q17-6,Q17-7,Q17-8,Q17-9,Q17-10,Q17-11,Q17-12,Q17-13,Q17-14,Q17-15,Q17-16,Q17-17,R18-1,R18-2,R18-3,R18-4,R18-5,R18-6,R18-7,S19-1,S19-2,S19-3,S19-4,S19-5,S19-6,S19-7,S19-8,S19-9,S19-10,S19-11,S19-12,S19-13,S19-14,S19-15,T20-1,T20-2,T20-3,T20-4,T20-5,T20-6,T20-7,T20-8,T20-9,T20-10,T20-11,T20-12,T20-13,T20-14,T20-15,T20-16,T20-17,T20-18,T20-19,T20-20,T20-21,T20-22,T20-23,T20-24,T20-25,T20-26,U21-1,U21-2,U21-3,U21-4,U21-5U21-6,U21-7,U21-8,U21-9,V22-1,V22-2,V22-3,V22-4,V22-5,V22-6,V22-7,W23-1,W23-2,W23-3,W23-4,W23-5,W23-6,W23-7,X24-1,X24-2,X24-3,X24-4,Y25-1,Y25-2,Y25-3,Y25-4,Y25-5,Y25-6,Y25-7,Z26-1,Z26-2,Z26-3,Z26-4,Z26-5,Z26-6,Z26-7,AA27-1,AA27-2,AA27-3,AA27-4,AA27-5,AA27-6,AA27-7,AA27-8,AA27-9,AB28-1,AB28-2,AB28-3,AB28-4,AB28-5,AB28-6,Ac29-1,Ac29-2,Ac29-3,Ac29-4,Ac29-5,Ac29-6,Ac29-7,AD30-1,AD30-2,AD30-3,AD30-4,AD30-5,AD30-6,AD30-7,AE31-1,AE31-2,AE31-3,AE31-4,AE31-5,AE31-6,AE31-7,AE31-8,AE31-9,AE31-10,AF32-1,AF32-2,AF32-3,AF32-4,AF32-5,AF32-6,AF32-7,AF32-8,AF32-9,AF32-10',
                    # 'SubAccess': 'A1-1,A1-2,A1-3,A1-4,A1-5,A1-6,A1-7,A1-8,A1-9,A1-10,A1-11,A1-12,A1-13,A1-14,A1-15,A1-16,A1-17,A1-18,A1-19,A1-20,A1-21,A1-22,A1-23,A1-24,A1-25,A1-26,A1-27,A1-28,B2-1,B2-2,B2-3,B2-4,B2-5,B2-6,B2-7,C3-1,C3-2,C3-3,C3-4,C3-5,C3-6,C3-7,C3-8,D4-1,D4-2,D4-3,D4-4,D4-5,D4-6,D4-7,E5-1,E5-2,E5-3,E5-4,E5-5,E5-6,E5-7,E5-8,E5-9,E5-10,F6-1,F6-2,F6-3,F6-4,F6-5,F6-6,F6-7,F6-8,F6-9,F6-10,G7-1,G7-2,G7-3,G7-4,G7-5,G7-6,G7-7,G7-8,G7-9,G7-10,G7-11,G7-12,G7-13,G7-14,G7-15,G7-16,H8-1,H8-2,H8-3,H8-4,H8-5,H8-6,H8-7,H8-8,H8-9,H8-10,I9-1,I9-2,I9-3,I9-4,I9-5,I9-6,I9-7,I9-8,I9-9,I9-10,I9-11,I9-12,I9-13,I9-14,I9-15,I9-16,I9-17,I9-18,I9-19,J10-1,J10-2,J10-3,J10-4,J10-5,J10-6,J10-7,J10-8,J10-9,J10-10,J10-11,J10-12,J10-13,J10-14,J10-15,J10-16,J10-17,J10-18,J10-19,J10-20,J10-21,J10-22,J10-23,J10-24,K11-1,K11-2,K11-3,K11-4,K11-5,K11-6,K11-7,K11-8,K11-9,K11-10,K11-11,K11-12,K11-13,K11-14,K11-15,K11-16,K11-17,K11-18,K11-19,K11-20,K11-21,K11-22,K11-23,L12-1,L12-2,L12-3,L12-4,L12-5,L12-6,L12-7,M13-1,M13-2,M13-3,M13-4,M13-5,M13-6,M13-7,M13-8,M13-9,M13-10,N14-1,N14-2,N14-3,N14-4,N14-5,N14-6,N14-7,N14-8,O15-2,O15-3,O15-4,O15-5,O15-6,O15-7,O15-8,O15-9,O15-10,O15-11,O15-12,O15-13,O15-14,O15-15,O15-16,O15-17,O15-18,O15-20,O15-21,O15-22,O15-23,O15-24,O15-25,O15-26,O15-27,O15-28,O15-29,O15-30,P16-1,P16-2,P16-3,P16-4,P16-5,P16-6,P16-7,P16-8,P16-9,P16-10,P16-11,P16-12,P16-13,P16-14,P16-15,P16-16,P16-17,P16-18,P16-19,P16-20,P16-21,P16-22,P16-23,P16-24,P16-25,P16-26,P16-27,P16-28,P16-29,P16-30,Q17-1,Q17-2,Q17-3,Q17-4,Q17-5,Q17-6,Q17-7,Q17-8,Q17-9,Q17-10,Q17-11,Q17-12,Q17-13,Q17-14,Q17-15,Q17-16,Q17-17,R18-1,R18-2,R18-3,R18-4,R18-5,R18-6,R18-7,S19-1,S19-2,S19-3,S19-4,S19-5,S19-6,S19-7,S19-8,S19-9,S19-10,S19-11,S19-12,S19-13,S19-14,S19-15,T20-1,T20-2,T20-3,T20-4,T20-5,T20-6,T20-7,T20-8,T20-9,T20-10,T20-11,T20-12,T20-13,T20-14,T20-15,T20-16,T20-17,U21-1,U21-2,U21-3,U21-4,U21-5U21-6,U21-7,U21-8,U21-9,V22-1,V22-2,V22-3,V22-4,V22-5,V22-6,V22-7,W23-1,W23-2,W23-3,W23-4,W23-5,W23-6,W23-7,X24-1,X24-2,X24-3,X24-4,Y25-1,Y25-2,Y25-3,Y25-4,Y25-5,Y25-6,Y25-7,Z26-1,Z26-2,Z26-3,Z26-4,Z26-5,Z26-6,Z26-7,AA27-1,AA27-2,AA27-3,AA27-4,AA27-5,AA27-6,AA27-7,AA27-8,AA27-9,AB28-1,AB28-2,AB28-3,AB28-4,AB28-5,AB28-6,Ac29-1,Ac29-2,Ac29-3,Ac29-4,Ac29-5,Ac29-6,AD30-1,AD30-2,AD30-3,AD30-4,AD30-5,AD30-6,AD30-7',
                    'Create':True,
                    'Edit':True,
                    'Delete':True,
                    'Read':True,
                    'plain_text_password':'admin',
                }
            )

            # Create locations
            location_data = {'Location_Name': 'PALAKKAD', 'Bed_Count': 100, 'Status': True, 'created_by': 'system'}
            location, _ = Location_Detials.objects.get_or_create(**location_data)

            # Assign location (assuming ManyToManyField)
            if hasattr(useradmin, 'Locations'):
                useradmin.Locations.add(location)
                useradmin.save()

            if hasattr(admin_entry, 'Locations'):
                admin_entry.Locations.add(location)
                admin_entry.save()
            api=credentialapi.objects.create(
                token_id='11b8e78a-77f7-4a11-bf8e-48c783214ded',
                password_hash='3d5d76e8c735de0251ec20c9277cf1faa77c3b04615fabb7f4acdee11134f30e'
            )
            api.save()
            
            
            
            nature_of_group_list = [
                {'NatureOfGroupName': 'Assets', 'created_by': 'host'},
                {'NatureOfGroupName': 'Expenses', 'created_by': 'host'},
                {'NatureOfGroupName': 'Income', 'created_by': 'host'},
                {'NatureOfGroupName': 'Liabilities', 'created_by': 'host'},
            ]

            for item in nature_of_group_list:
                Finance_NatureOfGroup_Detailes.objects.get_or_create(
                    NatureOfGroupName=item['NatureOfGroupName'],
                    defaults={'created_by': item['created_by']}
                )

            prime_group_list = [
                
                {'GroupName': 'Capital Account', 'TypeOfGroup':'Prime','NatureOfGroup': 'Liabilities', 'created_by': 'host'},
                {'GroupName': 'Current Assets','TypeOfGroup':'Prime', 'NatureOfGroup': 'Assets', 'created_by': 'host'},
                {'GroupName': 'Current Liabilities','TypeOfGroup':'Prime', 'NatureOfGroup': 'Liabilities', 'created_by': 'host'},
                {'GroupName': 'Direct Expenses','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
                {'GroupName': 'Direct Incomes','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
                {'GroupName': 'Fixed Assets','TypeOfGroup':'Prime', 'NatureOfGroup': 'Assets', 'created_by': 'host'},
                {'GroupName': 'Indirect Expenses','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
                {'GroupName': 'Indirect Incomes','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
                {'GroupName': 'Investments', 'TypeOfGroup':'Prime','NatureOfGroup': 'Assets', 'created_by': 'host'},
                {'GroupName': 'Loans(Liability)','TypeOfGroup':'Prime', 'NatureOfGroup': 'Liabilities', 'created_by': 'host'},
                {'GroupName': 'Purchase Accounts','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
                {'GroupName': 'Sales Accounts','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
            ]

            for group in prime_group_list:
                nature_of_group = Finance_NatureOfGroup_Detailes.objects.get(NatureOfGroupName=group['NatureOfGroup'])
                Finance_GroupMaster_Detailes.objects.get_or_create(
                    GroupName=group['GroupName'],
                    defaults={
                        'NatureOfGroup': nature_of_group,
                        'TypeofGroup':group['TypeOfGroup'],
                        'ParentGroup': None, 
                        'created_by': group['created_by']
                    }
                )
            
            sub_group_list=[
                {'GroupName': 'Reserves & Suplus', 'TypeOfGroup':'Sub','UnderGroup': 'Capital Account', 'created_by': 'host'},
                {'GroupName': 'Bank Accounts', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Cash-in-Hand','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Deposits(Asset)', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Loans & Advances (Asset)','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Stock-in-Hand','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Sundry Debtors', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
                {'GroupName': 'Duties & Taxes', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
                {'GroupName': 'Provisions', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
                {'GroupName': 'Sundry Creditors', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
                {'GroupName': 'Bank OD A/c', 'TypeOfGroup':'Sub','UnderGroup': 'Loans(Liability)', 'created_by': 'host'},
                {'GroupName': 'Secured Loans', 'TypeOfGroup':'Sub','UnderGroup': 'Loans(Liability)', 'created_by': 'host'},
                {'GroupName': 'Unsecured Loans','TypeOfGroup':'Sub', 'UnderGroup': 'Loans(Liability)', 'created_by': 'host'}

            ]

            for subgroup in sub_group_list:
                parent_group = Finance_GroupMaster_Detailes.objects.get(GroupName=subgroup['UnderGroup'])
                Finance_GroupMaster_Detailes.objects.get_or_create(
                    GroupName=subgroup['GroupName'],
                    defaults={
                        'NatureOfGroup': parent_group.NatureOfGroup, 
                        'TypeofGroup':subgroup['TypeOfGroup'], 
                        'ParentGroup': parent_group,  
                        'created_by': subgroup['created_by']
                    }
                )   
            finance_ledger_list=[
                {'LedgerName':'Cash','LedgerGroupName': 'Current Assets','OpeningBalance':0,'DebitOrCredit':'Dr','created_by': 'host'},
                {'LedgerName':'Bank','LedgerGroupName': 'Bank Accounts','OpeningBalance':0,'DebitOrCredit':'Dr','created_by': 'host'},
            ]

            for ledger in finance_ledger_list:
                GroupMaster_ins=Finance_GroupMaster_Detailes.objects.get(GroupName=ledger['LedgerGroupName'])
                Finance_LedgerMasters_Detailes.objects.get_or_create(
                    LedgerName=ledger['LedgerName'],
                    LedgerGroupName=GroupMaster_ins,
                    OpeningBalance=ledger['OpeningBalance'],
                    DebitOrCredit=ledger['DebitOrCredit'],
                    created_by=ledger['created_by']
                )
            # Create default building, block, floor, and wards
            building_ins = Building_Master_Detials.objects.create(
                Building_Name='BUILDINGA',
                Location_Name=location,
                created_by='host'
            )
            block_ins = Block_Master_Detials.objects.create(
                Block_Name='BLOCKA',
                Building_Name=building_ins,
                Location_Name=building_ins.Location_Name,
                created_by='host'
            )
            floor_ins = Floor_Master_Detials.objects.create(
                Floor_Name='FLOOR1',
                Block_Name=block_ins,
                Building_Name=block_ins.Building_Name,
                Location_Name=block_ins.Location_Name,
                created_by='host'
            )
            for ward in ['GENERAL', 'ICU', 'CASUALITY']:
                WardType_Master_Detials.objects.create(
                    Location_Name=block_ins.Location_Name,
                    Type = 'WARD',
                    Ward_Name=ward,
                    created_by='host'
                )
            for rel in ['HINDU', 'MUSLIM', 'CRISTIAN']:
                Religion_Detials.objects.create(
                    Religion_Name=rel,
                    created_by='host'
                )
            for dep in ['IP', 'OP','CASUALITY','OT','RADIOLOGY','LAB','HR','MRD','FRONT OFFICE','PHARMACHY','ENDOCRINOLOGY','CLINICALPATHOLOGY','HEMATOLOGY','BIOCHEMISTRY','MICROBIOLOGY','SEROLOGY','HISTOPATHOLOGY','CT','MRI','XRAY','USG','HEMATOLOGY-BB']:
                Department_Detials.objects.create(
                    Department_Name=dep,
                    created_by='host'
                )
             
            for blood in ['A+','A-','B+','B-','O+','O-','AB+','AB-']:
                BloodGroup_Detials.objects.create(
                    BloodGroup_Name = blood,
                    created_by= 'system'
                )  
                   
            for classi in ['PARTTIME','FULLTIME','ONCALL']:
                
                Classification_Detials.objects.create(
                    Classification_Name = classi,
                    created_by='host'

                )
                
            for role in ['HOD','SENIOR','JUNIOR']:

                Role_Master.objects.create(
                    Role_Name = role,
                    created_by = 'host'
                )
                
            for cat in ['DOCTOR','NURSE','TECHNICIAN','RECEPTIONIST','CASHEIR','PHARMACIST']:
                category_ins =  Category_Detials.objects.create(
                    Category_Name = cat,
                    created_by = 'host'
                )
                if cat == 'DOCTOR':
                    for spec in ['GENERAL MEDICINE','NEUROLOGY','GYNECOLOGY','OPTHALMOLOGY','ANAESTHESIOLOGIST']:
                        Speciality_Detials.objects.create(
                            Category_Name=category_ins,
                            Speciality_Name=spec,
                            created_by='host'
                        )
                        
            for des in ['JUNIOR','SENIOR','JUNIORSURGEON','SENIORSURGEON','SCRUBNURSE','CIRCULATINGNURSE','MRI TECHNICIAN','CT TECHNICIAN','XRAY TECHNICIAN','ASSISTANT PROFESSOR','ASSOCIATE PROFESSOR','PROFESSOR','LAB TECHNICIAN','ASS.PHAMACIST','PHARMACIST']:
                Designation_Detials.objects.create(
                    Designation_Name = des,
                    created_by = 'host'
                )
            
                    
            F_instance = Finance_GroupMaster_Detailes.objects.get(pk=12)        
            for des in ['CONSULTATION','GENERALSERVICES','PROCEDURES',"LAB","RADIOLOGY","ROOMSERVICES","THERAPY",'OT']:
                Service_Category_Masters.objects.create(
                    Servicegroup = 'Group1',
                    ServiceCategory = des,
                    LedgerName = des.upper(),
                    LedgerGroupName =F_instance ,
                    OpeningBalance = 0,
                    DebitOrCredit = 'Cr',
                    Location=location,
                    Createdby = 'host'
                )

            for thr in ['Oncology Therapy','Neurotherapy','Physiotherapy']:
                TherapyType_Master.objects.create(
                    TherapyType_Name = thr
                )    
 
            
            flag_details = [
                    ('GENERAL', '#fff'),
                    ('VIP', '#FC939D'),
                    ('GOVT', '#DFEE17'),
                    ('INSURANCE', '#6C1BD0'),
                    ('MLC', '#F90606'),
                    ('CLIENT', '#CECECE'),
                    ('CORPORATE', '#F74A64'),
                    ('DONATION', '#F790FE'),
                    ('EMPLOYEE', '#856CC1'),
                    ('EMPLOYEERELATION', '#37E1D6'),
                    ('DOCTOR', '#2DD79E'),
                    ('DOCTORRELATION', '#24E7F5'),
                ]

            for name, color in flag_details:
                Flaggcolor_Detials.objects.create(
                    Flagg_Name=name,
                    Flagg_Color=color,
                    created_by='host'
                )
                
               
            for radiology in ['CT','MRI','XRAY']:

                RadiologyNames_Details.objects.create(

                    Radiology_Name = radiology,
                    Location_Name=location,
                    created_by='host'
                )
            
            for pay in ['Cash','Card','UPI','Cheque','Bank']:
 
                PaymentModeMaster.objects.create(
 
                    PaymentMode = pay,
                    created_by='host',
                )
                
            default_TriageCategory = [
                {'Category': 'Immediate','Description':'Life-threatening injuries', 'Colour':'#FF0000','created_by':'host'},
                {'Category': 'Delayed','Description':'Serious injuries', 'Colour':'#FFFF00','created_by':'host'},
                {'Category': 'Minor','Description':'Non-urgent injuries', 'Colour':'#008000','created_by':'host'},
                {'Category': 'Deceased/Expectant','Description':'No chance of survival ', 'Colour':'#000000','created_by':'host'},
                {'Category': 'Dismissed','Description':'No injuries or minor issues', 'Colour':'#FFFFFF','created_by':'host'},
                {'Category': 'Observation','Description':'continued observation', 'Colour':'#FFA500','created_by':'host'},
                {'Category': 'Expectant/Palliative','Description':'comfort care', 'Colour':'#0000FF','created_by':'host'},
                {'Category': 'Contaminated/Hazmat','Description':'contaminated with hazardous materials', 'Colour':'#800080','created_by':'host'},
                {'Category': 'Psychological','Description':'psychological distress', 'Colour':'#FFC0CB','created_by':'host'},
                {'Category': 'Hold/Temporary Delay','Description':'stable and can wait for a longer period', 'Colour':'#808080','created_by':'host'},
            ]
 
            for Triage in default_TriageCategory:
                TriageCategory_Detials.objects.create(
                    Category=Triage['Category'],
                    Description=Triage['Description'],
                    Colour=Triage['Colour'],
                    created_by=Triage['created_by']
            )
                

            default_WasteCount = [
                {'wasteCategory':'Bio Waste','wasteColor':'Red','weight':'0','totalWst':'0'},
                {'wasteCategory':'Bio Waste','wasteColor':'Yellow','weight':'0','totalWst':'0'},
                {'wasteCategory':'Bio Waste','wasteColor':'Blue','weight':'0','totalWst':'0'},
                {'wasteCategory':'Genrel Waste','wasteColor':'Green','weight':'0','totalWst':'0'},
                {'wasteCategory':'E Waste','wasteColor':'Black','weight':'0','totalWst':'0'},
            ]    

            for wastecount in default_WasteCount:
                WasteCount.objects.create(
                    wasteCategory= wastecount['wasteCategory'],
                    wasteColor= wastecount['wasteColor'],
                    weight= wastecount['weight'],
                    totalWst= wastecount['totalWst']
                )
                
            default_VentilatorType = [
                {'VentilatorTypeName':'VCV (Volume-Controlled Ventilator)','created_by':'system'},
                {'VentilatorTypeName':'PCV (Pressure-Controlled Ventilator)','created_by':'system'},
                {'VentilatorTypeName':'PSV (Pressure Support Ventilator)','created_by':'system'},
                {'VentilatorTypeName':'SIMV (Synchronized Intermittent Mandatory Ventilation)','created_by':'system'},
                {'VentilatorTypeName':'CPAP (Continuous Positive Airway Pressure)','created_by':'system'},
                {'VentilatorTypeName':'BiPAP (Bilevel Positive Airway Pressure)','created_by':'system'},
                {'VentilatorTypeName': 'Transport (Transport Ventilator)','created_by':'system'},
                {'VentilatorTypeName':'Neonatal (Neonatal/Pediatric Ventilator)','created_by':'system'},          
            ]    
 
            for VentilatorType in default_VentilatorType:
                VentilatorType_Detials.objects.create(
                    VentilatorTypeName= VentilatorType['VentilatorTypeName'],
                    created_by=VentilatorType['created_by']
                )     

            # nature_of_group_list = [
            #     {'NatureOfGroupName': 'Assets', 'created_by': 'host'},
            #     {'NatureOfGroupName': 'Expenses', 'created_by': 'host'},
            #     {'NatureOfGroupName': 'Income', 'created_by': 'host'},
            #     {'NatureOfGroupName': 'Liabilities', 'created_by': 'host'},
            # ]

            # for item in nature_of_group_list:
            #     Finance_NatureOfGroup_Detailes.objects.get_or_create(
            #         NatureOfGroupName=item['NatureOfGroupName'],
            #         defaults={'created_by': item['created_by']}
            #     )

            # prime_group_list = [
                
            #     {'GroupName': 'Capital Account', 'TypeOfGroup':'Prime','NatureOfGroup': 'Liabilities', 'created_by': 'host'},
            #     {'GroupName': 'Current Assets','TypeOfGroup':'Prime', 'NatureOfGroup': 'Assets', 'created_by': 'host'},
            #     {'GroupName': 'Current Liabilities','TypeOfGroup':'Prime', 'NatureOfGroup': 'Liabilities', 'created_by': 'host'},
            #     {'GroupName': 'Direct Expenses','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
            #     {'GroupName': 'Direct Incomes','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
            #     {'GroupName': 'Fixed Assets','TypeOfGroup':'Prime', 'NatureOfGroup': 'Assets', 'created_by': 'host'},
            #     {'GroupName': 'Indirect Expenses','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
            #     {'GroupName': 'Indirect Incomes','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
            #     {'GroupName': 'Investments', 'TypeOfGroup':'Prime','NatureOfGroup': 'Assets', 'created_by': 'host'},
            #     {'GroupName': 'Loans(Liability)','TypeOfGroup':'Prime', 'NatureOfGroup': 'Liabilities', 'created_by': 'host'},
            #     {'GroupName': 'Purchase Accounts','TypeOfGroup':'Prime', 'NatureOfGroup': 'Expenses', 'created_by': 'host'},
            #     {'GroupName': 'Sales Accounts','TypeOfGroup':'Prime', 'NatureOfGroup': 'Income', 'created_by': 'host'},
            # ]

            # for group in prime_group_list:
            #     nature_of_group = Finance_NatureOfGroup_Detailes.objects.get(NatureOfGroupName=group['NatureOfGroup'])
            #     Finance_GroupMaster_Detailes.objects.get_or_create(
            #         GroupName=group['GroupName'],
            #         defaults={
            #             'NatureOfGroup': nature_of_group,
            #             'TypeofGroup':group['TypeOfGroup'],
            #             'ParentGroup': None, 
            #             'created_by': group['created_by']
            #         }
            #     )
            
            # sub_group_list=[
            #     {'GroupName': 'Reserves & Suplus', 'TypeOfGroup':'Sub','UnderGroup': 'Capital Account', 'created_by': 'host'},
            #     {'GroupName': 'Bank Accounts', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
            #     {'GroupName': 'Cash-in-Hand','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
            #     {'GroupName': 'Deposits(Asset)', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
            #     {'GroupName': 'Loans & Advances (Asset)','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
            #     {'GroupName': 'Stock-in-Hand','TypeOfGroup':'Sub', 'UnderGroup': 'Current Assets', 'created_by': 'host'},
            #     {'GroupName': 'Sundry Debtors', 'TypeOfGroup':'Sub','UnderGroup': 'Current Assets', 'created_by': 'host'},
            #     {'GroupName': 'Duties & Taxes', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
            #     {'GroupName': 'Provisions', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
            #     {'GroupName': 'Sundry Creditors', 'TypeOfGroup':'Sub','UnderGroup': 'Current Liabilities', 'created_by': 'host'},
            #     {'GroupName': 'Bank OD A/c', 'TypeOfGroup':'Sub','UnderGroup': 'Loans(Liability)', 'created_by': 'host'},
            #     {'GroupName': 'Secured Loans', 'TypeOfGroup':'Sub','UnderGroup': 'Loans(Liability)', 'created_by': 'host'},
            #     {'GroupName': 'Unsecured Loans','TypeOfGroup':'Sub', 'UnderGroup': 'Loans(Liability)', 'created_by': 'host'}

            # ]

            # for subgroup in sub_group_list:
            #     parent_group = Finance_GroupMaster_Detailes.objects.get(GroupName=subgroup['UnderGroup'])
            #     Finance_GroupMaster_Detailes.objects.get_or_create(
            #         GroupName=subgroup['GroupName'],
            #         defaults={
            #             'NatureOfGroup': parent_group.NatureOfGroup, 
            #             'TypeofGroup':subgroup['TypeOfGroup'], 
            #             'ParentGroup': parent_group,  
            #             'created_by': subgroup['created_by']
            #         }
            #     )   
            # finance_ledger_list=[
            #     {'LedgerName':'Cash','LedgerGroupName': 'Current Assets','OpeningBalance':0,'DebitOrCredit':'Dr','created_by': 'host'},
            #     {'LedgerName':'Bank','LedgerGroupName': 'Bank Accounts','OpeningBalance':0,'DebitOrCredit':'Dr','created_by': 'host'},
            # ]

            # for ledger in finance_ledger_list:
            #     GroupMaster_ins=Finance_GroupMaster_Detailes.objects.get(GroupName=ledger['LedgerGroupName'])
            #     Finance_LedgerMasters_Detailes.objects.get_or_create(
            #         LedgerName=ledger['LedgerName'],
            #         LedgerGroupName=GroupMaster_ins,
            #         OpeningBalance=ledger['OpeningBalance'],
            #         DebitOrCredit=ledger['DebitOrCredit'],
            #         created_by=ledger['created_by']
            #     )
               

   

@receiver(post_save, sender=Location_Detials)
def add_location_to_superadmin(sender, instance, created, **kwargs):
    if created:
        # Add service and procedure charges for the new location
        for ins in Service_Master_Details.objects.all():
            Service_Procedure_Charges.objects.get_or_create(
                MasterType='Service',
                Service_ratecard=ins,
                Procedure_ratecard=None,
                Location=instance,
            )
        for ins in Procedure_Master_Details.objects.all():
            Service_Procedure_Charges.objects.get_or_create(
                MasterType='Procedure',
                Service_ratecard=None,
                Procedure_ratecard=ins,
                Location=instance,
            )

        # Add the new location to the superadmin
        try:
            superadmin = UserRegister_Master_Details.objects.get(auth_user_id__username='host')
            superadmin.Locations.add(instance)
        except UserRegister_Master_Details.DoesNotExist:
            pass


# @receiver(post_save, sender=Doctor_Personal_Form_Detials)
# def create_doctor_ratecard(sender, instance, created, **kwargs):
#   print('Into the doctor creation')
#   try:
    
#     if created and instance.DoctorType != 'Referral':
#         doctor_ratecard = Doctor_Ratecard_Master.objects.create(
#             Doctor_ID=instance,
#         )
#         print('Doctorrateeee', doctor_ratecard)
 
#         # Get all unique wards from rooms
#         unique_wards = RoomType_Master_Detials.objects.values_list('Ward_Name', flat=True).distinct()
 
#         for ward_id in unique_wards:
#             ward_instance = WardType_Master_Detials.objects.get(pk=ward_id)
 
#             # Create a ratecard fee entry per ward
#             room_type_fee, _ = RoomTypeFee.objects.get_or_create(
#                 doctor_ratecard=doctor_ratecard,
#                 ward=ward_instance,  # NOTE: Ensure `ward` field exists in RoomTypeFee model
#                 room_type = ward_id
#             )
 
#             for insurance in Insurance_Master_Detials.objects.all():
#                 InsuranceRoomTypeFee.objects.get_or_create(
#                     doctor_ratecard=doctor_ratecard,
#                     room_type_fee=room_type_fee,
#                     insurance=insurance
#                 )
 
#             for client in Client_Master_Detials.objects.all():
#                 ClientRoomTypeFee.objects.get_or_create(
#                     doctor_ratecard=doctor_ratecard,
#                     room_type_fee=room_type_fee,
#                     client=client
#                 )
 
#         for insurance in Insurance_Master_Detials.objects.all():
#             InsuranceFee.objects.get_or_create(
#                 doctor_ratecard=doctor_ratecard,
#                 insurance=insurance
#             )
#         for client in Client_Master_Detials.objects.all():
#             ClientFee.objects.get_or_create(
#                 doctor_ratecard=doctor_ratecard,
#                 client=client
#             )
 
#         print('🎀DoctorrateCard created successfully')
#   except Exception as e :
#      print('the',e)
        
 
# @receiver(post_save, sender=RoomType_Master_Detials)
# def create_room_type_fee(sender, instance, created, **kwargs):
#     if created:
#         print('Room type creation detected 💙💙💙')
 
#         # Doctor Ratecard: Create ward-based RoomTypeFee
#         for doctor_ratecard in Doctor_Ratecard_Master.objects.all():
#             room_type_fee, _ = RoomTypeFee.objects.get_or_create(
#                 doctor_ratecard=doctor_ratecard,
#                 ward=instance.Ward_Name,  # ✅ Corrected: pass the Ward instance
#                 room_type=instance  
#             )
 
#             for insurance in Insurance_Master_Detials.objects.all():
#                 InsuranceRoomTypeFee.objects.get_or_create(
#                     doctor_ratecard=doctor_ratecard,
#                     room_type_fee=room_type_fee,
#                     insurance=insurance
#                 )
 
#             for client in Client_Master_Detials.objects.all():
#                 ClientRoomTypeFee.objects.get_or_create(
#                     doctor_ratecard=doctor_ratecard,
#                     room_type_fee=room_type_fee,
#                     client=client
#                 )
 
#         # Service/Procedure Charges: Still using room_type, needs full redesign
#         for ratecard in Service_Procedure_Charges.objects.all():
#             if ratecard.MasterType == 'Service':
#                 if ratecard.Service_ratecard.Department != 'OP':
#                     room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=ratecard,
#                         room_type=instance,  # You may want to refactor this to use Ward instead
#                         General_fee=ratecard.Service_ratecard.Amount,
#                         Special_fee=ratecard.Service_ratecard.Amount,
#                     )
 
#                     for insurance in Insurance_Master_Detials.objects.all():
#                         Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
#                             Service_Procedure_ratecard=ratecard,
#                             room_type_fee=room_type_fee,
#                             insurance=insurance,
#                             fee=ratecard.Service_ratecard.Amount,
#                         )
 
#                     for client in Client_Master_Detials.objects.all():
#                         Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
#                             Service_Procedure_ratecard=ratecard,
#                             room_type_fee=room_type_fee,
#                             client=client,
#                             fee=ratecard.Service_ratecard.Amount,
#                         )
#             else:
#                 room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
#                     Service_Procedure_ratecard=ratecard,
#                     room_type=instance,  # Again, may refactor to ward-based later
#                     General_fee=ratecard.Procedure_ratecard.Amount,
#                     Special_fee=ratecard.Procedure_ratecard.Amount,
#                 )
 
#                 for insurance in Insurance_Master_Detials.objects.all():
#                     Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=ratecard,
#                         room_type_fee=room_type_fee,
#                         insurance=insurance,
#                         fee=ratecard.Procedure_ratecard.Amount,
#                     )
 
#                 for client in Client_Master_Detials.objects.all():
#                     Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=ratecard,
#                         room_type_fee=room_type_fee,
#                         client=client,
#                         fee=ratecard.Procedure_ratecard.Amount,
#                     )
#     print('room type master created successfully 🤍')  


# @receiver(post_save, sender=Insurance_Master_Detials)
# def create_insurance_fee(sender, instance, created, **kwargs):
#     if created:
#         for doctor_ratecard in Doctor_Ratecard_Master.objects.all():
#             InsuranceFee.objects.get_or_create(
#                 doctor_ratecard=doctor_ratecard,
#                 insurance=instance,
#             )
#         for room_type_fee in RoomTypeFee.objects.all():
#             InsuranceRoomTypeFee.objects.get_or_create(
#                 doctor_ratecard=room_type_fee.doctor_ratecard,
#                 room_type_fee=room_type_fee,
#                 insurance=instance
#             )
#         print('labbb_insssss')
#         for tests in Testmaster_Cost_List.objects.all():
#             InsuranceFeeLab.objects.get_or_create(
#                 Lab_Test_Id = tests,
#                 insurance = instance
#             )
#         for ratecard in Service_Procedure_Charges.objects.all():
#             if ratecard.MasterType=='Service':
#                 if ratecard.Service_ratecard.Department != 'IP':
#                     Service_Procedure_InsuranceFee.objects.get_or_create(
#                         Service_Procedure_ratecard=ratecard,
#                         insurance=instance,
#                         fee=ratecard.Service_ratecard.Amount,
#                     )
                   
                   
#             else:
#                 Service_Procedure_InsuranceFee.objects.get_or_create(
#                         Service_Procedure_ratecard=ratecard,
#                         insurance=instance,
#                         fee=ratecard.Procedure_ratecard.Amount,
                       
#                     )
#         for room_type_fee in Service_Procedure_RoomTypeFee.objects.all():
#             if room_type_fee.Service_Procedure_ratecard.MasterType=='Service':
#                 if room_type_fee.Service_Procedure_ratecard.Service_ratecard.Department != 'OP':
#                     Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
#                         room_type_fee=room_type_fee.room_type,
#                         insurance=instance,
#                         fee=room_type_fee.Service_Procedure_ratecard.Service_ratecard.Amount
#                     )
#             else:
#                 Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
#                     Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
#                     room_type_fee=room_type_fee.room_type,
#                     insurance=instance,
#                     fee=room_type_fee.Service_Procedure_ratecard.Procedure_ratecard.Amount
                   
#                 )
#         print('Insuranceeeeeeeeeeeeeeeeeeeeeee')
 
# @receiver(post_save, sender=Client_Master_Detials)
# def create_client_fee(sender, instance, created, **kwargs):
#     if created:
#         for doctor_ratecard in Doctor_Ratecard_Master.objects.all():
#             ClientFee.objects.get_or_create(
#                 doctor_ratecard=doctor_ratecard,
#                 client=instance,
#             )
#         for room_type_fee in RoomTypeFee.objects.all():
#             ClientRoomTypeFee.objects.get_or_create(
#                 doctor_ratecard=room_type_fee.doctor_ratecard,
#                 room_type_fee=room_type_fee,
#                 client=instance
#             )
       
#         for tests in Testmaster_Cost_List.objects.all():
#             ClientFeeLab.objects.get_or_create(
#                 Lab_Test_Id = tests,
#                 client = instance
#             )
#         for ratecard in Service_Procedure_Charges.objects.all():
#             if ratecard.MasterType=='Service':
#                 if ratecard.Service_ratecard.Department != 'IP':
#                     Service_Procedure_ClientFee.objects.get_or_create(
#                         Service_Procedure_ratecard=ratecard,
#                         client=instance,
#                         fee=ratecard.Service_ratecard.Amount,
                       
#                     )
                   
#             else:
#                 Service_Procedure_ClientFee.objects.get_or_create(
#                     Service_Procedure_ratecard=ratecard,
#                     client=instance,
#                     fee=ratecard.Procedure_ratecard.Amount,
                   
#                 )
#         for room_type_fee in Service_Procedure_RoomTypeFee.objects.all():
#             if room_type_fee.Service_Procedure_ratecard.MasterType=='Service':
#                 if room_type_fee.Service_Procedure_ratecard.Service_ratecard.Department != 'OP':
#                     Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
#                         room_type_fee=room_type_fee.room_type,
#                         client=instance,
#                         fee=room_type_fee.Service_Procedure_ratecard.Service_ratecard.Amount
                       
#                     )
#             else:
#                 Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
#                     Service_Procedure_ratecard=room_type_fee.Service_Procedure_ratecard,
#                     room_type_fee=room_type_fee.room_type,
#                     client=instance,
#                     fee=room_type_fee.Service_Procedure_ratecard.Procedure_ratecard.Amount
                   
#                 )
 
 
 
# # Service Procedure Master Signals

# @receiver(post_save, sender=Service_Master_Details)
# def create_service_procedure_charges(sender, instance, created, **kwargs):
#     if created:
#         locations = Location_Detials.objects.all()
#         for location in locations:
#             Service_Procedure_Charges.objects.get_or_create(
#                 MasterType='Service',
#                 Service_ratecard=instance,
#                 Procedure_ratecard=None,
#                 Location=location,
#             )

# @receiver(post_save, sender=Procedure_Master_Details)
# def create_procedure_procedure_charges(sender, instance, created, **kwargs):
#     if created:
#         locations = Location_Detials.objects.all()
#         for location in locations:
#             Service_Procedure_Charges.objects.get_or_create(
#                 MasterType='Procedure',
#                 Service_ratecard=None,
#                 Procedure_ratecard=instance,
#                 Location=location,
#             )

# @receiver(post_save, sender=Service_Procedure_Charges)
# def create_service_procedure_related_fees(sender, instance, created, **kwargs):
#     if created:

#         if instance.MasterType=='Service':
#             if instance.Service_ratecard.Department=='IP':
#                 for room in RoomType_Master_Detials.objects.all():
#                     room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=instance,
#                         room_type=room,
#                         General_fee=instance.Service_ratecard.Amount,
#                         Special_fee=instance.Service_ratecard.Amount,
#                     )
#                     for insurance in Insurance_Master_Detials.objects.all():
#                         Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
#                             Service_Procedure_ratecard=instance,
#                             room_type_fee=room,
#                             insurance=insurance,
#                             fee=instance.Service_ratecard.Amount,
#                         )
#                     for client in Client_Master_Detials.objects.all():
#                         Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
#                             Service_Procedure_ratecard=instance,
#                             room_type_fee=room,
#                             client=client,
#                             fee=instance.Service_ratecard.Amount,
#                         )
#             elif instance.Service_ratecard.Department=='OP':
#                 Service_Procedure_Rate_Charges.objects.create(
#                     Service_Procedure_ratecard=instance,
#                     General_fee=instance.Service_ratecard.Amount,
#                     Special_fee=instance.Service_ratecard.Amount,
#                 )
#                 for insurance in Insurance_Master_Detials.objects.all():
#                     Service_Procedure_InsuranceFee.objects.get_or_create(
#                         Service_Procedure_ratecard=instance,
#                         insurance=insurance,
#                         fee=instance.Service_ratecard.Amount,
#                     )
#                 for client in Client_Master_Detials.objects.all():
#                     Service_Procedure_ClientFee.objects.get_or_create(
#                         Service_Procedure_ratecard=instance,
#                         client=client,
#                         fee=instance.Service_ratecard.Amount,
#                     )
#             else:
#                 Service_Procedure_Rate_Charges.objects.create(
#                     Service_Procedure_ratecard=instance
#                 )
#                 for room in RoomType_Master_Detials.objects.all():
#                     room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=instance,
#                         room_type=room,
#                         General_fee=instance.Service_ratecard.Amount,
#                         Special_fee=instance.Service_ratecard.Amount,
#                     )
#                     for insurance in Insurance_Master_Detials.objects.all():
#                         Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
#                             Service_Procedure_ratecard=instance,
#                             room_type_fee=room,
#                             insurance=insurance,
#                             fee=instance.Service_ratecard.Amount,
#                         )
#                     for client in Client_Master_Detials.objects.all():
#                         Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
#                             Service_Procedure_ratecard=instance,
#                             room_type_fee=room,
#                             client=client,
#                             fee=instance.Service_ratecard.Amount,
#                         )
                        
#                 for insurance in Insurance_Master_Detials.objects.all():
#                     Service_Procedure_InsuranceFee.objects.get_or_create(
#                         Service_Procedure_ratecard=instance,
#                         insurance=insurance,
#                         fee=instance.Service_ratecard.Amount,
#                     )
#                 for client in Client_Master_Detials.objects.all():
#                     Service_Procedure_ClientFee.objects.get_or_create(
#                         Service_Procedure_ratecard=instance,
#                         client=client,
#                         fee=instance.Service_ratecard.Amount,
#                     )
#         else:
#             Service_Procedure_Rate_Charges.objects.create(
#                 Service_Procedure_ratecard=instance,
#                 General_fee=instance.Procedure_ratecard.Amount,
#                 Special_fee=instance.Procedure_ratecard.Amount,
#             )
#             for room in RoomType_Master_Detials.objects.all():
#                 room_type_fee, _ = Service_Procedure_RoomTypeFee.objects.get_or_create(
#                     Service_Procedure_ratecard=instance,
#                     room_type=room,
#                     General_fee=instance.Procedure_ratecard.Amount,
#                     Special_fee=instance.Procedure_ratecard.Amount,
#                 )
#                 for insurance in Insurance_Master_Detials.objects.all():
#                     Service_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=instance,
#                         room_type_fee=room,
#                         insurance=insurance,
#                         fee=instance.Procedure_ratecard.Amount,
#                     )
#                 for client in Client_Master_Detials.objects.all():
#                     Service_Procedure_ClientRoomTypeFee.objects.get_or_create(
#                         Service_Procedure_ratecard=instance,
#                         room_type_fee=room,
#                         client=client,
#                         fee=instance.Procedure_ratecard.Amount,
#                     )
                    
#             for insurance in Insurance_Master_Detials.objects.all():
#                 Service_Procedure_InsuranceFee.objects.get_or_create(
#                     Service_Procedure_ratecard=instance,
#                     insurance=insurance,
#                     fee=instance.Procedure_ratecard.Amount,
#                 )
#             for client in Client_Master_Detials.objects.all():
#                 Service_Procedure_ClientFee.objects.get_or_create(
#                     Service_Procedure_ratecard=instance,
#                     client=client,
#                     fee=instance.Procedure_ratecard.Amount,
#                 )
       
#     # ---------------- update the charge -------


# # Signal for updating related records when Service_Master_Details.Amount changes
# @receiver(post_save, sender=Service_Master_Details)
# def update_service_amount(sender, instance, created, **kwargs):
#     if not created:  # Only trigger on updates, not on create
        
#         # Find related Service_Procedure_Charges entries and update related tables
#         service_procedure_charges = Service_Procedure_Charges.objects.filter(Service_ratecard=instance)
#         for sp_charge in service_procedure_charges:

#             # Update Service_Procedure_Rate_Charges
#             for rate_charge in Service_Procedure_Rate_Charges.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 rate_charge.General_Prev_fee = rate_charge.General_fee
#                 rate_charge.Special_Prev_fee = rate_charge.Special_fee
#                 rate_charge.General_fee = instance.Amount
#                 rate_charge.Special_fee = instance.Amount
#                 rate_charge.save()

#             # Update Service_Procedure_RoomTypeFee
#             for room_type_fee in Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 room_type_fee.General_Prev_fee = room_type_fee.General_fee
#                 room_type_fee.Special_Prev_fee = room_type_fee.Special_fee
#                 room_type_fee.General_fee = instance.Amount
#                 room_type_fee.Special_fee = instance.Amount
#                 room_type_fee.save()

#             # Update Service_Procedure_InsuranceFee
#             for insurance_fee in Service_Procedure_InsuranceFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 insurance_fee.Prev_fee = insurance_fee.fee
#                 insurance_fee.fee = instance.Amount
#                 insurance_fee.save()

#             # Update Service_Procedure_ClientFee
#             for client_fee in Service_Procedure_ClientFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 client_fee.Prev_fee = client_fee.fee
#                 client_fee.fee = instance.Amount
#                 client_fee.save()

#             # Update Service_Procedure_InsuranceRoomTypeFee
#             for insurance_room_type_fee in Service_Procedure_InsuranceRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 insurance_room_type_fee.Prev_fee = insurance_room_type_fee.fee
#                 insurance_room_type_fee.fee = instance.Amount
#                 insurance_room_type_fee.save()

#             # Update Service_Procedure_ClientRoomTypeFee
#             for client_room_type_fee in Service_Procedure_ClientRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 client_room_type_fee.Prev_fee = client_room_type_fee.fee
#                 client_room_type_fee.fee = instance.Amount
#                 client_room_type_fee.save()

# # Signal for updating related records when Procedure_Master_Details.Amount changes
# @receiver(post_save, sender=Procedure_Master_Details)
# def update_procedure_amount(sender, instance, created, **kwargs):
#     if not created:  # Only trigger on updates, not on create

#         # Find related Service_Procedure_Charges entries and update related tables
#         procedure_procedure_charges = Service_Procedure_Charges.objects.filter(Procedure_ratecard=instance)
#         for sp_charge in procedure_procedure_charges:

#             # Update Service_Procedure_Rate_Charges
#             for rate_charge in Service_Procedure_Rate_Charges.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 rate_charge.General_Prev_fee = rate_charge.General_fee
#                 rate_charge.Special_Prev_fee = rate_charge.Special_fee
#                 rate_charge.General_fee = instance.Amount
#                 rate_charge.Special_fee = instance.Amount
#                 rate_charge.save()

#             # Update Service_Procedure_RoomTypeFee
#             for room_type_fee in Service_Procedure_RoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 room_type_fee.General_Prev_fee = room_type_fee.General_fee
#                 room_type_fee.Special_Prev_fee = room_type_fee.Special_fee
#                 room_type_fee.General_fee = instance.Amount
#                 room_type_fee.Special_fee = instance.Amount
#                 room_type_fee.save()

#             # Update Service_Procedure_InsuranceFee
#             for insurance_fee in Service_Procedure_InsuranceFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 insurance_fee.Prev_fee = insurance_fee.fee
#                 insurance_fee.fee = instance.Amount
#                 insurance_fee.save()

#             # Update Service_Procedure_ClientFee
#             for client_fee in Service_Procedure_ClientFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 client_fee.Prev_fee = client_fee.fee
#                 client_fee.fee = instance.Amount
#                 client_fee.save()

#             # Update Service_Procedure_InsuranceRoomTypeFee
#             for insurance_room_type_fee in Service_Procedure_InsuranceRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 insurance_room_type_fee.Prev_fee = insurance_room_type_fee.fee
#                 insurance_room_type_fee.fee = instance.Amount
#                 insurance_room_type_fee.save()

#             # Update Service_Procedure_ClientRoomTypeFee
#             for client_room_type_fee in Service_Procedure_ClientRoomTypeFee.objects.filter(Service_Procedure_ratecard=sp_charge):
#                 client_room_type_fee.Prev_fee = client_room_type_fee.fee
#                 client_room_type_fee.fee = instance.Amount
#                 client_room_type_fee.save()
         
# @receiver(post_delete, sender=Location_Detials)
# def delete_related_service_procedure_charges(sender, instance, **kwargs):
#     Service_Procedure_Charges.objects.filter(Location=instance).delete()

# @receiver(post_delete, sender=Doctor_Personal_Form_Detials)
# def delete_related_doctor_ratecards(sender, instance, **kwargs):
#     Doctor_Ratecard_Master.objects.filter(Doctor_ID=instance).delete()

# @receiver(post_delete, sender=RoomType_Master_Detials)
# def delete_related_room_type_fees(sender, instance, **kwargs):
#     RoomTypeFee.objects.filter(room_type=instance).delete()
#     Service_Procedure_RoomTypeFee.objects.filter(room_type=instance).delete()
#     Surgery_Procedure_RoomTypeFee.objects.filter(room_type=instance).delete()

# @receiver(post_delete, sender=Insurance_Master_Detials)
# def delete_related_insurance_fees(sender, instance, **kwargs):
#     InsuranceFee.objects.filter(insurance=instance).delete()
#     InsuranceRoomTypeFee.objects.filter(insurance=instance).delete()
#     Service_Procedure_InsuranceFee.objects.filter(insurance=instance).delete()
#     Service_Procedure_InsuranceRoomTypeFee.objects.filter(insurance=instance).delete()
#     Surgery_Procedure_InsuranceFee.objects.filter(insurance=instance).delete()
#     Surgery_Procedure_InsuranceRoomTypeFee.objects.filter(insurance=instance).delete()

# @receiver(post_delete, sender=Client_Master_Detials)
# def delete_related_client_fees(sender, instance, **kwargs):
#     ClientFee.objects.filter(client=instance).delete()
#     ClientRoomTypeFee.objects.filter(client=instance).delete()
#     Service_Procedure_ClientFee.objects.filter(client=instance).delete()
#     Service_Procedure_ClientRoomTypeFee.objects.filter(client=instance).delete()
#     Surgery_Procedure_ClientFee.objects.filter(client=instance).delete()
#     Surgery_Procedure_ClientRoomTypeFee.objects.filter(client=instance).delete()


@receiver(post_delete, sender=Service_Master_Details)
def delete_related_service_procedure_charges(sender, instance, **kwargs):
    Service_Procedure_Charges.objects.filter(Service_ratecard=instance).delete()

@receiver(post_delete, sender=Procedure_Master_Details)
def delete_related_procedure_procedure_charges(sender, instance, **kwargs):
    Service_Procedure_Charges.objects.filter(Procedure_ratecard=instance).delete()

@receiver(post_save, sender=Doctor_Ratecard_Master, dispatch_uid="unique_doctor_ratecard_signal")
def new_signal_for_doctor_ratecard(sender, instance, created, **kwargs):
   
 
    if created:  
       
        try:
            content_type = ContentType.objects.get_for_model(Doctor_Ratecard_Master)
            category_ins, _ = Service_Category_Masters.objects.get_or_create(ServiceCategory='CONSULTATION')
 
            # Creating service group details
            Services_Group_Details.objects.create(
                content_type=content_type,
                object_id=instance.pk,
                service_category=category_ins,
                service_sub_category=instance,  # Ensure this field expects a `Doctor_Ratecard_Master`
            )
 
            print('Service mapped successfully')
 
        except Exception as e:
            print("Error occurred:", e)
import logging
from django.db import IntegrityError

# Configure logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender=Service_Master_Details, dispatch_uid="service_master_details_signal")
def handle_service_master_details(sender, instance, created, **kwargs):
    """
    Signal handler for Service_Master_Details post_save event.
    Creates or updates a Services_Group_Details entry based on the ServiceCategory
    when a Service_Master_Details instance is created or updated.
    """
    try:
        # Get ContentType for Service_Master_Details
        content_type = ContentType.objects.get_for_model(Service_Master_Details)

        # Ensure instance has ServiceCategory
        if not hasattr(instance, 'ServiceCategory') or instance.ServiceCategory is None:
            logger.warning(f"Service_Master_Details pk={instance.pk} has no ServiceCategory")
            return

        # Validate that ServiceCategory.Serviceid exists in Service_Category_Masters
        try:
            category_ins = Service_Category_Masters.objects.get(Serviceid=instance.ServiceCategory.Serviceid)
        except Service_Category_Masters.DoesNotExist:
            # Attempt to create a new Service_Category_Masters instance
            try:
                # Fetch a default Location (adjust logic as needed)
                default_location = Location_Detials.objects.first()  # Or use a specific logic to select Location
                if not default_location:
                    logger.error(f"No Location found for Service_Master_Details pk={instance.pk}")
                    return

                category_ins, _ = Service_Category_Masters.objects.get_or_create(
                    Serviceid=instance.ServiceCategory.Serviceid,
                    ServiceCategory=instance.ServiceCategory.Serviceid,
                    defaults={
                        'LedgerName': instance.ServiceCategory.Serviceid,
                        'DebitOrCredit': 'Cr',
                        'Location_id': default_location.id  # Provide required Location_id
                    }
                )
            except IntegrityError as e:
                logger.error(f"Failed to create Service_Category_Masters for Serviceid={instance.ServiceCategory.Serviceid}: {str(e)}")
                return

        if created:
            # For new instances, create a Services_Group_Details entry
            Services_Group_Details.objects.create(
                content_type=content_type,
                object_id=instance.pk,
                service_category=category_ins,
                service_sub_category=instance
            )
            logger.info(f"Service mapped successfully for pk={instance.pk}, category={category_ins.Serviceid}")
        else:
            # For updates, check if a Services_Group_Details entry exists
            group_details = Services_Group_Details.objects.filter(
                content_type=content_type,
                object_id=instance.pk
            ).first()

            if group_details:
                # Update existing entry if ServiceCategory has changed
                if group_details.service_category != category_ins:
                    group_details.service_category = category_ins
                    group_details.service_sub_category = instance
                    group_details.save()
                    logger.info(f"Updated Services_Group_Details for pk={instance.pk}, new category={category_ins.Serviceid}")
            else:
                # Create new entry if none exists
                Services_Group_Details.objects.create(
                    content_type=content_type,
                    object_id=instance.pk,
                    service_category=category_ins,
                    service_sub_category=instance
                )
                logger.info(f"Created Services_Group_Details for updated pk={instance.pk}, category={category_ins.Serviceid}")

    except Exception as e:
        logger.error(f"Error in handle_service_master_details for pk={instance.pk}: {str(e)}")
    
@receiver(post_save, sender=Procedure_Master_Details, dispatch_uid="unique_procedure_master_signal")
def new_signal_for_procedure_master(sender, instance, created, **kwargs):
   
 
    if created:  
       
        try:
            content_type = ContentType.objects.get_for_model(Procedure_Master_Details)
            category_ins, _ = Service_Category_Masters.objects.get_or_create(ServiceCategory='PROCEDURES')
 
            # Creating service group details
            Services_Group_Details.objects.create(
                content_type=content_type,
                object_id=instance.pk,
                service_category=category_ins,
                service_sub_category=instance,  # Ensure this field expects a `Doctor_Ratecard_Master`
            )
 
            print('Service mapped successfully')
 
        except Exception as e:
            print("Error occurred:", e)

# @receiver(post_save, sender=Testmaster_Cost_List, dispatch_uid="unique_lab_master_signal")
# def new_signal_for_lab_master(sender, instance, created, **kwargs):
   
 
#     if created:  
       
#         try:
#             content_type = ContentType.objects.get_for_model(Testmaster_Cost_List)
#             category_ins, _ = Service_Category_Masters.objects.get_or_create(ServiceCategory='LAB')
 
#             # Creating service group details
#             Services_Group_Details.objects.create(
#                 content_type=content_type,
#                 object_id=instance.pk,
#                 service_category=category_ins,
#                 service_sub_category=instance,  # Ensure this field expects a `Doctor_Ratecard_Master`
#             )
 
#             print('Service mapped successfully')
 
#         except Exception as e:
#             print("Error occurred:", e)


@receiver(post_save, sender=Testmaster_Cost_List, dispatch_uid="unique_lab_master_signal")
def new_signal_for_lab_master(sender, instance, created, **kwargs):
   
 
    try:
        content_type = ContentType.objects.get_for_model(Testmaster_Cost_List)
        category_ins, _ = Service_Category_Masters.objects.get_or_create(ServiceCategory='LAB')
 
        # Update or create the Services_Group_Details record
        Services_Group_Details.objects.update_or_create(
            content_type=content_type,
            object_id=instance.pk,
            defaults={
                'service_category': category_ins,
                'service_sub_category': instance
            }
        )
 
        print('Service mapping created or updated successfully')
 
    except Exception as e:
        print("Error occurred:", e)
 
@receiver(post_save, sender=TestName_Details, dispatch_uid="unique_radiology_master_signal")
def new_signal_for_radiology_master(sender, instance, created, **kwargs):
    if not created:
        return  # Only process when a new instance is created

    if instance is None:
        print("Error: Signal received with None instance")
        return

    try:
        content_type = ContentType.objects.get_for_model(TestName_Details)
        category_ins, _ = Service_Category_Masters.objects.get_or_create(ServiceCategory='RADIOLOGY')

        print(f"Instance: {instance}, PK: {instance.pk}")
        print(f"Content Type: {content_type}")
        print(f"Category Instance: {category_ins}")

        # Creating service group details
        Services_Group_Details.objects.create(
            content_type=content_type,
            object_id=instance.pk,
            service_category=category_ins,
            service_sub_category=instance,  # Ensure this field expects a TestName_Details instance
        )

        print("Radiology Service mapped successfully")

    except Exception as e:
        print(f"Error occurred in signal handler: {str(e)}")
        # Optionally, log the error to a file or monitoring system for further analysis

@receiver(post_save, sender=TherapyType_Detials, dispatch_uid="unique_therapy_master_signal")
def new_signal_for_therapy_master(sender, instance, created, **kwargs):
   
 
    if created:  
       
        try:
            content_type = ContentType.objects.get_for_model(TherapyType_Detials)
            category_ins, _ = Service_Category_Masters.objects.get_or_create(ServiceCategory='THERAPY')
 
            # Creating service group details
            Services_Group_Details.objects.create(
                content_type=content_type,
                object_id=instance.pk,
                service_category=category_ins,
                service_sub_category=instance,  # Ensure this field expects a `Doctor_Ratecard_Master`
            )
 
            print('Therapy Service mapped successfully')
 
        except Exception as e:
            print("Error occurred:", e)
 
@receiver(post_save, sender=WardType_Master_Detials, dispatch_uid="unique_ward_master_signal")
def new_signal_for_ward_master(sender, instance, created, **kwargs):
   
 
    if created:  
       
        try:
            content_type = ContentType.objects.get_for_model(WardType_Master_Detials)
            category_ins, _ = Service_Category_Masters.objects.get_or_create(ServiceCategory='ROOMSERVICES')
 
            # Creating service group details
            Services_Group_Details.objects.create(
                content_type=content_type,
                object_id=instance.pk,
                service_category=category_ins,
                service_sub_category=instance,  # Ensure this field expects a `Doctor_Ratecard_Master`
            )
 
            print('Ward Service mapped successfully')
 
        except Exception as e:
            print("Error occurred:", e)
 
@receiver(post_save, sender=Package_Master, dispatch_uid="unique_package_master_signal")
def new_signal_for_Package_master(sender, instance, created, **kwargs):
   
 
    if created:  
       
        try:
            content_type = ContentType.objects.get_for_model(Package_Master)
            category_ins, _ = Service_Category_Masters.objects.get_or_create(ServiceCategory='PACKAGE')
 
            # Creating service group details
            Services_Group_Details.objects.create(
                content_type=content_type,
                object_id=instance.pk,
                service_category=category_ins,
                service_sub_category=instance,  # Ensure this field expects a `Doctor_Ratecard_Master`
            )
 
            print('Package Service mapped successfully')
 
        except Exception as e:
            print("Error occurred:", e)



@receiver(post_save, sender=Location_Detials)
def add_location_to_superadmin_surgery(sender, instance, created, **kwargs):
    if created:
        for ins in SurgeryName_Details.objects.all():
            Surgery_Procedure_Charges.objects.get_or_create(
                MasterType='Surgery',
                Surgery_ratecard=ins,
                Location=instance,
            )
        try:
            superadmin = UserRegister_Master_Details.objects.get(auth_user_id__username='host')
            superadmin.Locations.add(instance)
        except UserRegister_Master_Details.DoesNotExist:
            pass


@receiver(post_save, sender=RoomType_Master_Detials)
def create_room_type_fee_surgery(sender, instance, created, **kwargs):
    if created:
        for ratecard in Surgery_Procedure_Charges.objects.all():
            
            if ratecard.MasterType== 'Surgery':
                room_type_fee, _ = Surgery_Procedure_RoomTypeFee.objects.get_or_create(
                    Surgery_Procedure_ratecard=ratecard,
                    room_type=instance,
                    General_fee=ratecard.Surgery_ratecard.Estimate_Cost,
                    Special_fee=ratecard.Surgery_ratecard.Estimate_Cost,
                )

                for insurance in Insurance_Master_Detials.objects.all():
                    Surgery_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                        Surgery_Procedure_ratecard=ratecard,
                        room_type_fee=instance,  # Fixed incorrect reference
                        insurance=insurance,
                        fee=ratecard.Surgery_ratecard.Estimate_Cost,
                    )

                for client in Client_Master_Detials.objects.all():
                    Surgery_Procedure_ClientRoomTypeFee.objects.get_or_create(
                        Surgery_Procedure_ratecard=ratecard,
                        room_type_fee=instance,  # Fixed incorrect reference
                        client=client,
                        fee=ratecard.Surgery_ratecard.Estimate_Cost,  # Removed extra comma
                    )

@receiver(post_save, sender=Insurance_Master_Detials)
def create_insurance_fee_surgery(sender, instance, created, **kwargs):
    if created:
        # for ratecard in Surgery_Procedure_Charges.objects.all():
            # if ratecard.MasterType=='Surgery':
            #     Surgery_Procedure_InsuranceFee.objects.get_or_create(
            #         Surgery_Procedure_ratecard=ratecard,
            #         insurance=instance,
            #         fee=ratecard.Surgery_ratecard.Estimate_Cost,
            #     )
        

        for room_type_fee in Surgery_Procedure_RoomTypeFee.objects.all():
            if room_type_fee.Surgery_Procedure_ratecard.MasterType=='Surgery':
       
                Surgery_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                    Surgery_Procedure_ratecard=room_type_fee.Surgery_Procedure_ratecard,
                    room_type_fee=room_type_fee.room_type, 
                    insurance=instance,
                    fee=room_type_fee.Surgery_Procedure_ratecard.Surgery_ratecard.Estimate_Cost
                )


@receiver(post_save, sender=Client_Master_Detials)
def create_client_fee_surgery(sender, instance, created, **kwargs):
    if created:
        # for ratecard in Surgery_Procedure_Charges.objects.all():
        #     if ratecard.MasterType=='Surgery':
              
        #         Surgery_Procedure_ClientFee.objects.get_or_create(
        #             Surgery_Procedure_ratecard=ratecard,
        #             client=instance,
        #             fee=ratecard.Surgery_ratecard.Estimate_Cost,
                    
        #         )
                   

        for room_type_fee in Surgery_Procedure_RoomTypeFee.objects.all():
            if room_type_fee.Surgery_Procedure_ratecard.MasterType=='Surgery':

                Surgery_Procedure_ClientRoomTypeFee.objects.get_or_create(
                    Surgery_Procedure_ratecard=room_type_fee.Surgery_Procedure_ratecard,
                    room_type_fee=room_type_fee.room_type,
                    client=instance,
                    fee=room_type_fee.Surgery_Procedure_ratecard.Surgery_ratecard.Estimate_Cost
                    
                )


    

@receiver(post_save, sender=SurgeryName_Details)
def create_surgery_procedure_charges(sender, instance, created, **kwargs):
    if created:
        locations = Location_Detials.objects.all()
        for location in locations:
            Surgery_Procedure_Charges.objects.get_or_create(
                MasterType='Surgery',
                Surgery_ratecard=instance,
                Location=location,
            )


@receiver(post_save, sender=Surgery_Procedure_Charges)
def create_surgery_related_fees(sender, instance, created, **kwargs):
    if created:
        if instance.MasterType=='Surgery':
            for room in RoomType_Master_Detials.objects.all():
                room_type_fee, _ = Surgery_Procedure_RoomTypeFee.objects.get_or_create(
                    Surgery_Procedure_ratecard=instance,
                    room_type=room,
                    General_fee=instance.Surgery_ratecard.Estimate_Cost,
                    Special_fee=instance.Surgery_ratecard.Estimate_Cost,
                )
                for insurance in Insurance_Master_Detials.objects.all():
                    print("insurance222222222-------",insurance)
                    Surgery_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
                        Surgery_Procedure_ratecard=instance,
                        room_type_fee=room,
                        insurance=insurance,
                        fee=instance.Surgery_ratecard.Estimate_Cost,

                    )
                for client in Client_Master_Detials.objects.all():
                    print("client222222222---------",client)
                    Surgery_Procedure_ClientRoomTypeFee.objects.get_or_create(
                        Surgery_Procedure_ratecard=instance,
                        room_type_fee=room,
                        client=client,
                        fee=instance.Surgery_ratecard.Estimate_Cost,

                    )

        # else:
        #     Surgery_Procedure_Rate_Charges.objects.create(
        #         Surgery_Procedure_ratecard=instance,


        #     )
        #     for room in RoomType_Master_Detials.objects.all():
        #         room_type_fee, _ = Surgery_Procedure_RoomTypeFee.objects.get_or_create(
        #             Surgery_Procedure_ratecard=instance,
        #             room_type_fee=room,
        #             insurance=insurance,
        #             fee=instance.Surgery_ratecard.Estimate_Cost,
        #         )
        #     for insurance in Insurance_Master_Detials.objects.all():
        #         Surgery_Procedure_InsuranceRoomTypeFee.objects.get_or_create(
        #             Surgery_Procedure_ratecard=instance,
        #             room_type_fee=room,
        #             insurance=insurance,
        #             fee=instance.Surgery_ratecard.Estimate_Cost,


        #         )
        #     for client in Client_Master_Detials.objects.all():
        #         Surgery_Procedure_ClientRoomTypeFee.objects.get_or_create(
        #             Surgery_Procedure_ratecard=instance,
        #             room_type_fee=room,
        #             client=client,
        #             fee=instance.Surgery_ratecard.Estimate_Cost,
        #         )
            
        #     for insurance in Insurance_Master_Detials.objects.all():
        #         Surgery_Procedure_InsuranceFee.objects.get_or_create(
        #             Surgery_Procedure_ratecard=instance,
        #             insurance=insurance,
        #             fee=instance.Surgery_ratecard.Estimate_Cost,
        #         )
        #     for client in Client_Master_Detials.objects.all():
        #         Surgery_Procedure_ClientFee.objects.get_or_create(
        #             Surgery_Procedure_ratecard=instance,
        #             client=client,
        #             fee=instance.Surgery_ratecard.Estimate_Cost,
        #         )


@receiver(post_save, sender=SurgeryName_Details)
def update_surgery_amount(sender, instance, created, **kwargs):
    if not created:
        surgery_procedure_charges = Surgery_Procedure_Charges.objects.filter(Surgery_ratecard=instance)

        for sp_charge in surgery_procedure_charges:

            for rate_charge in Surgery_Procedure_Rate_Charges.objects.filter(Surgery_Procedure_ratecard=sp_charge):
                rate_charge.General_Prev_fee = rate_charge.General_fee
                rate_charge.Special_Prev_fee = rate_charge.Special_fee
                rate_charge.General_fee = instance.Estimate_Cost
                rate_charge.Special_fee = instance.Estimate_Cost
                rate_charge.save()
            
            for room_type_fee in Surgery_Procedure_RoomTypeFee.objects.filter(Surgery_Procedure_ratecard=sp_charge):
                room_type_fee.General_Prev_fee = room_type_fee.General_fee
                room_type_fee.Special_Prev_fee = room_type_fee.Special_fee
                room_type_fee.General_fee = instance.Estimate_Cost
                room_type_fee.Special_fee = instance.Estimate_Cost
                room_type_fee.save()
            
            for insurance_fee in Surgery_Procedure_InsuranceFee.objects.filter(Surgery_Procedure_ratecard=sp_charge):
                insurance_fee.Prev_fee = insurance_fee.fee
                insurance_fee.fee = instance.Estimate_Cost
                insurance_fee.save()
            
            for client_fee in Surgery_Procedure_ClientFee.objects.filter(Surgery_Procedure_ratecard=sp_charge):
                client_fee.Prev_fee = client_fee.fee
                client_fee.fee = instance.Estimate_Cost
                client_fee.save()
            
            for insurance_room_type_fee in Surgery_Procedure_InsuranceRoomTypeFee.objects.filter(Surgery_Procedure_ratecard=sp_charge):
                insurance_room_type_fee.Prev_fee = insurance_room_type_fee.fee
                insurance_room_type_fee.fee = instance.Estimate_Cost
                insurance_room_type_fee.save()
            
            for client_room_type_fee in Surgery_Procedure_ClientRoomTypeFee.objects.filter(Surgery_Procedure_ratecard=sp_charge):
                client_room_type_fee.Prev_fee = client_room_type_fee.fee
                client_room_type_fee.fee = instance.Estimate_Cost
                client_room_type_fee.save()

@receiver(post_delete, sender=Location_Detials)
def delete_related_surgery_procedure_charges(sender, instance, **kwargs):
    Surgery_Procedure_Charges.objects.filter(Location=instance).delete()


@receiver(post_delete, sender=SurgeryName_Details)
def delete_related_surgery_charges(sender, instance, **kwargs):
    Surgery_Procedure_Charges.objects.filter(Surgery_ratecard=instance).delete()


@receiver(post_save, sender=WardType_Master_Detials)
def create_room_ratecard(sender, instance, created, **kwargs):
   if created:
       
       for insurance in Insurance_Master_Detials.objects.all():
            Insurance_Ward_Fee.objects.get_or_create(
                Ward_Ratecard=instance,
                Insurance=insurance,
                defaults={
                    'Fee': instance.Amount,  # Use Current_Charge for consistency
                    'AC_Fee': instance.Acamt,        # Use Acamt for consistency
                    'NAC_Fee': instance.NonACamt,    # Use NonACamt for consistency
                    'Prev_Fee': 0.00,
                    'Prev_AC_Fee': 0.00,
                    'Prev_NAC_Fee': 0.00
                }
            )
 
       for client in Client_Master_Detials.objects.all():
            Client_Ward_Fee.objects.get_or_create(
                Ward_Ratecard=instance,
                Client=client,
                defaults={
                    'Fee': instance.Amount,  # Use Current_Charge for consistency
                    'AC_Fee': instance.Acamt,        # Use Acamt for consistency
                    'NAC_Fee': instance.NonACamt,    # Use NonACamt for consistency
                    'Prev_Fee': 0.00,
                    'Prev_AC_Fee': 0.00,
                    'Prev_NAC_Fee': 0.00
                }
            )
 
       for corporate in Corporate_Master_Detials.objects.all():
            Corporate_Ward_Fee.objects.get_or_create(
                Ward_Ratecard=instance,
                Corporate=corporate,
                defaults={
                    'Fee': instance.Amount,  # Use Current_Charge for consistency
                    'AC_Fee': instance.Acamt,        # Use Acamt for consistency
                    'NAC_Fee': instance.NonACamt,    # Use NonACamt for consistency
                    'Prev_Fee': 0.00,
                    'Prev_AC_Fee': 0.00,
                    'Prev_NAC_Fee': 0.00
                }
            )
 
       for discount in DiscountMaster.objects.all():
            service = Service_Category_Masters.objects.get(Serviceid = discount.Service.pk)
            if service.ServiceCategory.upper() == 'ROOMSERVICES':
                DiscountFeeRoom.objects.get_or_create(
                    Ward_Rate_Id=instance,
                    discount = discount,
                    Cur_Fee = discount.Discount_Value,
                    Cur_AC_Fee = discount.Discount_Value,
                    Cur_NON_AC_Fee = discount.Discount_Value
 
                )
        
@receiver(post_save, sender=Insurance_Master_Detials)
def create_insurance_room_fee(sender, instance, created, **kwargs):
    if created:
        # Create Insurance_Room_Fee for each Room_Ratecard_Master
        for room_ratecard in WardType_Master_Detials.objects.all():
            Insurance_Ward_Fee.objects.get_or_create(
                Ward_Ratecard=room_ratecard,
                Insurance=instance,
                defaults={
                    'Fee': room_ratecard.Amount,
                    'AC_Fee': room_ratecard.Acamt,
                    'NAC_Fee': room_ratecard.NonACamt,
                    'Prev_Fee': 0,
                    'Prev_AC_Fee': 0,
                    'Prev_NAC_Fee': 0
                }
            )
 
@receiver(post_save, sender=Client_Master_Detials)
def create_client_room_fee(sender, instance, created, **kwargs):
    if created:
        # Create Client_Room_Fee for each Room_Ratecard_Master
        for room_ratecard in WardType_Master_Detials.objects.all():
            Client_Ward_Fee.objects.get_or_create(
                Ward_Ratecard=room_ratecard,
                Client=instance,
                defaults={
                    'Fee': room_ratecard.Amount,
                    'AC_Fee': room_ratecard.Acamt,
                    'NAC_Fee': room_ratecard.NonACamt,
                    'Prev_Fee': 0,
                    'Prev_AC_Fee': 0,
                    'Prev_NAC_Fee': 0
                }
            )
 
@receiver(post_save, sender=Corporate_Master_Detials)
def create_corporate_room_fee(sender, instance, created, **kwargs):
    if created:
        # Create Corporate_Room_Fee for each Room_Ratecard_Master
        for room_ratecard in WardType_Master_Detials.objects.all():
            Corporate_Ward_Fee.objects.get_or_create(
                Ward_Ratecard=room_ratecard,
                Corporate=instance,
                defaults={
                    'Fee': room_ratecard.Amount,
                    'AC_Fee': room_ratecard.Acamt,
                    'NAC_Fee': room_ratecard.NonACamt,
                    'Prev_Fee': 0,
                    'Prev_AC_Fee': 0,
                    'Prev_NAC_Fee': 0
                }
            )
 
 
 
 
 
@receiver(post_save,sender = Testmaster_Cost_List)
def create_lab_test_ratecard(sender,instance,created, **kwargs):
    print('Got into the Lab_test_ratecarddddd')
    try:
        if created:
            print('vutvbjvevreb',instance)
            for test in Insurance_Master_Detials.objects.all():
                InsuranceFeeLab.objects.get_or_create(
                    Lab_Test_Id = instance,
                    insurance = test
                )
            for client in Client_Master_Detials.objects.all():
                ClientFeeLab.objects.get_or_create(
                    Lab_Test_Id=instance,
                    client=client,
                )
            for discount in DiscountMaster.objects.all():
                disc_dep = Department_Detials.objects.get(Department_Id=discount.Department.Department_Id)
                service = Service_Category_Masters.objects.get(Serviceid = discount.Service.pk)
                if disc_dep.Department_Name.upper() == 'LAB':
                    if service.ServiceCategory.upper() == 'LAB':
                        DiscountFeeLab.objects.get_or_create(
                            Lab_Test_Id=instance,
                            discount = discount
                        )  
        print('iyvsidbifrb')
 
    except Exception as e:
        print('error:',str(e))
 
 
# @receiver(post_save,sender = DiscountMaster)
# def create_discount_master(sender,instance,created,**kwargs):
#     if created:
#         print('yuvhbjb')
#         for tests in Testmaster_Cost_List.objects.all():
#             disc_dep = Department_Detials.objects.get(Department_Id=instance.Department.Department_Id)
#             service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
#             if disc_dep.Department_Name.upper() == 'LAB':
#                 if service.ServiceCategory.upper() == 'LAB':
#                     DiscountFeeLab.objects.get_or_create(
#                         Lab_Test_Id=tests,
#                         discount = instance,
#                     )

#         for rad in Radiology_Ratecard_Master.objects.all():
#             # disc_dep = Department_Detials.objects.get(Department_Id=instance.Department.Department_Id)
#             service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
#             # if disc_dep.Department_Name.upper() == 'RAD':
#             if service.ServiceCategory.upper() == 'RADIOLOGY':
#                 Discount_Radiology_Fee.objects.get_or_create(
#                         Radiology_Test_Id=rad,
#                         discount = instance,
#                     )
#     print('gvhdv')
 
@receiver(post_save,sender = DiscountMaster)
def create_discount_master(sender,instance,created,**kwargs):
   
 
    if created:
        print('yuvhbjb')
 
        service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
 
        if service.ServiceCategory.upper() == 'LAB':
 
            for tests in Testmaster_Cost_List.objects.all():
                # disc_dep = Department_Detials.objects.get(Department_Id=instance.Department.Department_Id)
                service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
                # if disc_dep.Department_Name.upper() == 'LAB':
                if service.ServiceCategory.upper() == 'LAB':
                        DiscountFeeLab.objects.get_or_create(
                            Lab_Test_Id=tests,
                            discount = instance,
                            Cur_Test_Fee = instance.Discount_Value,
                        )
 
        elif service.ServiceCategory.upper() == 'RADIOLOGY':
            for rad in Radiology_Ratecard_Master.objects.all():
                # disc_dep = Department_Detials.objects.get(Department_Id=instance.Department.Department_Id)
                service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
                # if disc_dep.Department_Name.upper() == 'RAD':
                if service.ServiceCategory.upper() == 'RADIOLOGY':
                    Discount_Radiology_Fee.objects.get_or_create(
                            Radiology_Test_Id=rad,
                            discount = instance,
                            Cur_Test_Fee = instance.Discount_Value,
 
                        )
   
        elif  service.ServiceCategory.upper() == 'ROOMSERVICES':
 
            for rooms in WardType_Master_Detials.objects.all():
 
                service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
                if service.ServiceCategory.upper() == 'ROOMSERVICES':
                        DiscountFeeRoom.objects.get_or_create(
                            Ward_Rate_Id=rooms,
                            discount = instance,
                            Cur_Fee = instance.Discount_Value,
                        )
 
        elif  service.ServiceCategory.upper() == 'PROCEDURES':
 
            for procedure in Procedure_Master_Details.objects.all():
 
                service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
                if service.ServiceCategory.upper() == 'PROCEDURES':
                        DiscountFeeProcedure.objects.get_or_create(
                            ProcedureId=procedure,
                            discount = instance,
                            SurgeonFee = instance.Discount_Value,
                            OTFee = instance.Discount_Value,
                            AssistantSurgeonFee = instance.Discount_Value,
                            AnesthesianFee = instance.Discount_Value,
                        )
 
        elif  service.ServiceCategory.upper() == 'THERAPY':
       
            for th in Therapy_Ratecard_Master.objects.all():
               service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
           
               if service.ServiceCategory.upper()=='THERAPY':
                 Therapy_Discount_Fee.objects.get_or_create(
                therapy_Id =th,
                discount = instance,
                Cur_Therapy_Fee = instance.Discount_Value,
               )
        # print('🫠🫠gvhdv')  
         
        elif  service.ServiceCategory.upper() == 'CONSULTATION':
         
           for dr in Doctor_Ratecard_Master.objects.all():
             service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
           
             if service.ServiceCategory.upper()=='CONSULTATION':
                Discount_Doctore_Fee.objects.get_or_create(
                doctor_id =dr,
                discount = instance,
                Cur_Test_Fee = instance.Discount_Value,
               )
   
        else:
            for ser in Service_Ratecard_Master.objects.all():
           
                service = Service_Category_Masters.objects.get(Serviceid = instance.Service.pk)
 
                print(service,'discount for service')
           
                # if service.ServiceCategory.upper() == 'GENERALSERVICES':
                Discount_service_Fee.objects.get_or_create(
                service_Id =ser,
                discount = instance,
                Cur_Test_Fee = instance.Discount_Value,
               )
       
 
 
  
 
@receiver(post_save, sender=TestName_Details)
def create_radiology_ratecard(sender, instance, created, **kwargs):
    if created:


        print('Radiology Ratevardddddddddddd')
        # Create a Radiology_Ratecard_Master entry for the new test
        radiology_ratecard = Radiology_Ratecard_Master.objects.create(
            Room_Id=instance,
        )
        # Create Radiology_Insurance_Fee for each Insurance
        for insurance in Insurance_Master_Detials.objects.all():
            Radiology_Insurance_Fee.objects.get_or_create(
                Radiology_Ratecard=radiology_ratecard,
                Insurance=insurance,
            )
           
        # Create Radiology_Client_Fee for each Client
        for client in Client_Master_Detials.objects.all():
            Radiology_Client_Fee.objects.get_or_create(
                Radiology_Ratecard=radiology_ratecard,
                Client=client,
            )
           
        # Create Radiology_Corporate_Fee for each Corporate
        for corporate in Corporate_Master_Detials.objects.all():
            Radiology_Corporate_Fee.objects.get_or_create(
                Radiology_Ratecard=radiology_ratecard,
                Corporate=corporate,
            )

        print('beforeeeeeeeeeeeeee')
 
        for discount in DiscountMaster.objects.all():

            print(discount.Service,'discount.Service')
            service = Service_Category_Masters.objects.get(Serviceid = discount.Service.pk)
            if service.ServiceCategory.upper() == 'RADIOLOGY':
                Discount_Radiology_Fee.objects.get_or_create(
                    Radiology_Test_Id=radiology_ratecard,
                    discount = discount
                )

        print('Ratecard created sucessssssssssss')
                
                
                
 
@receiver(post_save, sender=Insurance_Master_Detials)
def create_radiology_insurance_fee(sender, instance, created, **kwargs):
    if created:
        # Create Radiology_Insurance_Fee for each Radiology_Ratecard_Master
        for radiology_ratecard in Radiology_Ratecard_Master.objects.all():
            Radiology_Insurance_Fee.objects.get_or_create(
                Radiology_Ratecard=radiology_ratecard,
                Insurance=instance,
               
            )
            print(radiology_ratecard,'kidddddinggg')
 
@receiver(post_save, sender=Client_Master_Detials)
def create_radiology_client_fee(sender, instance, created, **kwargs):
    if created:
        # Create Radiology_Client_Fee for each Radiology_Ratecard_Master
        for radiology_ratecard in Radiology_Ratecard_Master.objects.all():
            Radiology_Client_Fee.objects.get_or_create(
                Radiology_Ratecard=radiology_ratecard,
                Client=instance,
            )
 
@receiver(post_save, sender=Corporate_Master_Detials)
def create_radiology_corporate_fee(sender, instance, created, **kwargs):
    if created:
        # Create Radiology_Corporate_Fee for each Radiology_Ratecard_Master
        for radiology_ratecard in Radiology_Ratecard_Master.objects.all():
            Radiology_Corporate_Fee.objects.get_or_create(
                Radiology_Ratecard=radiology_ratecard,
                Corporate=instance,
            )

 
@receiver(post_save, sender=Service_Master_Details)
def create_service_ratecard(sender, instance, created, **kwargs):
    if created:
        # Create a Service_Ratecard_Master entry for the new service
        service_ratecard = Service_Ratecard_Master.objects.create(
            Service=instance,
        )

        # Create Service_Insurance_Fee for each Insurance
        for insurance in Insurance_Master_Detials.objects.all():
            Service_Insurance_Fee.objects.get_or_create(
                Service_Ratecard=service_ratecard,
                Insurance=insurance,
            )

        # Create Service_Client_Fee for each Client
        for client in Client_Master_Detials.objects.all():
            Service_Client_Fee.objects.get_or_create(
                Service_Ratecard=service_ratecard,
                Client=client,
            )

        # Create Service_Corporate_Fee for each Corporate
        for corporate in Corporate_Master_Detials.objects.all():
            Service_Corporate_Fee.objects.get_or_create(
                Service_Ratecard=service_ratecard,
                Corporate=corporate,
            )

        # Create Discount_Service_Fee for discounts related to this service
        for discount in DiscountMaster.objects.all():
            try:
                service_cat = Service_Category_Masters.objects.get(Serviceid=discount.Service.pk)
                if service_cat.ServiceCategory.upper() == 'GENERALSERVICES':  # or 'OP SERVICE' / 'GENERAL' etc.
                    Discount_service_Fee.objects.get_or_create(
                        Service_Id=service_ratecard,
                        discount=discount
                    )
            except Service_Category_Masters.DoesNotExist:
                pass  # Skip if not matched
    print('🧚‍♀️🧚‍♀️🧚‍♀️ service ratecard created succesfullty ...')

@receiver(post_save, sender=Insurance_Master_Detials)
def create_service_insurance_fee(sender, instance, created, **kwargs):
    if created:
        for service_ratecard in Service_Ratecard_Master.objects.all():
            Service_Insurance_Fee.objects.get_or_create(
                Service_Ratecard=service_ratecard,
                Insurance=instance,
            )

    print('🧚‍♀️🧚‍♀️🧚‍♀️ service ratecard created succesfullty ...1')

@receiver(post_save, sender=Client_Master_Detials)
def create_service_client_fee(sender, instance, created, **kwargs):
    if created:
        for service_ratecard in Service_Ratecard_Master.objects.all():
            Service_Client_Fee.objects.get_or_create(
                Service_Ratecard=service_ratecard,
                Client=instance,
            )

    print('🧚‍♀️🧚‍♀️🧚‍♀️ service ratecard created succesfullty ...2')

@receiver(post_save, sender=Corporate_Master_Detials)
def create_service_corporate_fee(sender, instance, created, **kwargs):
    if created:
        for service_ratecard in Service_Ratecard_Master.objects.all():
            Service_Corporate_Fee.objects.get_or_create(
                Service_Ratecard=service_ratecard,
                Corporate=instance,
            )

 
    print('🧚‍♀️🧚‍♀️🧚‍♀️ service ratecard created succesfullty ...3')


@receiver(post_save, sender=Service_Ratecard_Master)
def create_service_wardtype(sender, instance, created, **kwargs):
    try:
        if created:
            ward_name = WardType_Master_Detials.objects.all()
            # Loop through all WardType_Master_Detials
            for ward in ward_name:
                WardtypeFee.objects.get_or_create(
                    service_ratecard=instance,  # correct service
                    ward=ward,                 # correct ward
                )
            print('🔥 wardtype entries created successfully...')
    except Exception as e:
        print('the err :', e)
        

@receiver(post_save, sender=WardType_Master_Detials)
def create_service_wardtype2(sender, instance, created, **kwargs):
    try:
        if created:
            print('entr8')
            ward_name = Service_Ratecard_Master.objects.all()
            # Loop through all WardType_Master_Detials
            for ward in ward_name:
                WardtypeFee.objects.get_or_create(
                    service_ratecard=ward,  # correct service
                    ward=instance,                 # correct ward
                )
            print('🔥 wardtype entries created successfully...')
    except Exception as e:
        print('the err :', e)        
        
        
        # doctor ratecard
@receiver(post_save, sender=Doctor_Personal_Form_Detials)
def create_doctor_ratecard(sender, instance, created, **kwargs):
    if created:
      print('Into the doctor creation')
      if created and instance.DoctorType != 'Referral':
        
        doctor_ratecard = Doctor_Ratecard_Master.objects.create(
            Doctor_ID=instance,
        )
        
        # Insurance Fees
        for insurance in Insurance_Master_Detials.objects.all():
            InsuranceFee_for_Doctor.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                insurance=insurance
            )

        # Client Fees
        for client in Client_Master_Detials.objects.all():
            ClientFee_for_Doctor.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                client=client
            )

        # Corporate Fees
        for corporate in Corporate_Master_Detials.objects.all():
            CorporateFee_for_Doctor.objects.get_or_create(
                doctor_ratecard=doctor_ratecard,
                corporate=corporate
            )

        # Discount Fees
        for discount in DiscountMaster.objects.all():
            
          try:  
            service_cat = Service_Category_Masters.objects.get(Serviceid=discount.Service.pk)
            if service_cat.ServiceCategory.upper() == 'CONSULTATION':  # or 'OP SERVICE' / 'GENERAL' etc.
               Discount_Doctore_Fee.objects.get_or_create(
                doctor_id=instance,
                discount=discount
            )
          except Exception as e:
              pass  

        print("✅ Doctor ratecard and related fee entries created successfully.")

@receiver(post_save, sender=Insurance_Master_Detials)
def create_doctor_insurance_fee(sender, instance, created, **kwargs):
    if created:
        for ratecard in Doctor_Ratecard_Master.objects.all():
            InsuranceFee_for_Doctor.objects.get_or_create(
                doctor_ratecard=ratecard,
                insurance=instance
            )
        print("✅ InsuranceFee_for_Doctor created for new insurance.")

@receiver(post_save, sender=Client_Master_Detials)
def create_doctor_client_fee(sender, instance, created, **kwargs):
    if created:
        for ratecard in Doctor_Ratecard_Master.objects.all():
            ClientFee_for_Doctor.objects.get_or_create(
                doctor_ratecard=ratecard,
                client=instance
            )
        print("✅ ClientFee_for_Doctor created for new client.")

@receiver(post_save, sender=Corporate_Master_Detials)
def create_doctor_corporate_fee(sender, instance, created, **kwargs):
    if created:
        for ratecard in Doctor_Ratecard_Master.objects.all():
            CorporateFee_for_Doctor.objects.get_or_create(
                doctor_ratecard=ratecard,
                corporate=instance
            )
        print("✅ CorporateFee_for_Doctor created for new corporate.")

@receiver(post_save, sender=Doctor_Ratecard_Master)
def create_doctor_ward_fee(sender, instance, created, **kwargs):
    if created:
        for ratecard in WardType_Master_Detials.objects.all():
            WardTypee_for_Doctor.objects.get_or_create(
                doctor_ratecard=instance,
                ward=ratecard
            )
        print("✅ WardTypee_for_Doctor created for new ward.")
        
@receiver(post_save, sender=WardType_Master_Detials)
def create_doctor_ward_fee1(sender, instance, created, **kwargs):
    if created:
        for ratecard in Doctor_Ratecard_Master.objects.all():
            WardTypee_for_Doctor.objects.get_or_create(
                doctor_ratecard=ratecard,
                ward=instance
            )
        print("✅ WardTypee_for_Doctor created for new ward.")        

#    therapee

@receiver(post_save, sender=TherapyType_Detials)
def create_therapy_ratecard(sender, instance, created, **kwargs):
    if created:
        # Create a Therapy_Ratecard_Master entry for the new therapy
        therapy_ratecard = Therapy_Ratecard_Master.objects.create(
            Therapy=instance,
        )

        # Create Therapy_Insurance_Fee for each Insurance
        for insurance in Insurance_Master_Detials.objects.all():
            Therapy_Insurance_Fee.objects.get_or_create(
                Therapy_Ratecard=therapy_ratecard,
                Insurance=insurance,
            )

        # Create Therapy_Client_Fee for each Client
        for client in Client_Master_Detials.objects.all():
            Therapy_Client_Fee.objects.get_or_create(
                Therapy_Ratecard=therapy_ratecard,
                Client=client,
            )

        # Create Therapy_Corporate_Fee for each Corporate
        for corporate in Corporate_Master_Detials.objects.all():
            Therapy_Corporate_Fee.objects.get_or_create(
                Therapy_Ratecard=therapy_ratecard,
                Corporate=corporate,
            )

        # Create Therapy_Discount_Fee for discounts related to this therapy
        for discount in DiscountMaster.objects.all():
            try:
                therapy_cat = Service_Category_Masters.objects.get(Serviceid=discount.Service.pk)
                if therapy_cat.ServiceCategory.upper() == 'THERAPY ':  # Example category
                    Therapy_Discount_Fee.objects.get_or_create(
                        therapy_Id=therapy_ratecard,
                        discount=discount
                    )
            except Service_Category_Masters.DoesNotExist:
                pass  # Skip if not matched

    print('🧚‍♀️ Therapy ratecard created successfully...')


@receiver(post_save, sender=Therapy_Ratecard_Master)
def create_therapy_wardtype(sender, instance, created, **kwargs):
    try:
        if created:
            # Loop through all WardType_Master_Detials
            for ward in WardType_Master_Detials.objects.all():
                WardtypeFeeForTherapy.objects.get_or_create(
                    Therapy_ratecard=instance,  # correct therapy
                    ward=ward,                 # correct ward
                )
            print('🔥 Wardtype entries created successfully  for therapy...')
    except Exception as e:
        print('The error:', e)
        
        
@receiver(post_save, sender=Insurance_Master_Detials)
def create_therapy_insurance_fee(sender, instance, created, **kwargs):
    if created:
        for therapy_ratecard in Therapy_Ratecard_Master.objects.all():
            Therapy_Insurance_Fee.objects.get_or_create(
                Therapy_Ratecard=therapy_ratecard,
                Insurance=instance,
            )

    print('🧚‍♀️ Therapy insurance fee created successfully...')

@receiver(post_save, sender=Client_Master_Detials)
def create_therapy_client_fee(sender, instance, created, **kwargs):
    if created:
        for therapy_ratecard in Therapy_Ratecard_Master.objects.all():
            Therapy_Client_Fee.objects.get_or_create(
                Therapy_Ratecard=therapy_ratecard,
                Client=instance,
            )

    print('🧚‍♀️ Therapy client fee created successfully...')

@receiver(post_save, sender=Corporate_Master_Detials)
def create_therapy_corporate_fee(sender, instance, created, **kwargs):
    if created:
        for therapy_ratecard in Therapy_Ratecard_Master.objects.all():
            Therapy_Corporate_Fee.objects.get_or_create(
                Therapy_Ratecard=therapy_ratecard,
                Corporate=instance,
            )

    print('🧚‍♀️ Therapy corporate fee created successfully...')

@receiver(post_save, sender=Therapy_Ratecard_Master)
def create_therapy_wardtype1(sender, instance, created, **kwargs):
    try:
        if created:
            # Loop through all WardType_Master_Detials
            for ward in WardType_Master_Detials.objects.all():
                WardtypeFeeForTherapy.objects.get_or_create(
                    Therapy_ratecard=instance,  # correct therapy
                    ward=ward,                 # correct ward
                )
            print('🔥 Wardtype entries created successfully  for therapy...')
    except Exception as e:
        print('The error:', e)



@receiver(post_save, sender=WardType_Master_Detials)
def create_therapy_wardtype2(sender, instance, created, **kwargs):
    try:
        if created:
            # Loop through all WardType_Master_Detials
            for ward in Therapy_Ratecard_Master.objects.all():
                WardtypeFeeForTherapy.objects.get_or_create(
                    Therapy_ratecard=ward,  # correct therapy
                    ward=instance,                 # correct ward
                )
            print('🔥 Wardtype entries created successfully  for therapy...')
    except Exception as e:
        print('The error:', e)
 
 
# procedureeeeeeeeee ratecardddddddddddd
 
@receiver(post_save, sender=Procedure_Master_Details)
def create_procedure_ratecard(sender, instance, created, **kwargs):
   if created:
       
 
       for ward in WardType_Master_Detials.objects.all():
            wardFeeProcedure.objects.get_or_create(
                ProcedureId=instance,
                Ward=ward,
                defaults={
                    'Fee': instance.TotalAmount,
                    'SurgeonFee': instance.SurgeonFee,    
                    'OTFee': instance.OTFee,
                    'AssistantSurgeonFee': instance.AssistantSurgeonFee,
                    'AnesthesianFee': instance.AnesthesianFee,
 
                    'Special_fee':  0.00,
                    'Special_SurgeonFee':  0.00,
                    'Special_OTFee':  0.00,
                    'Special_AssistantSurgeonFee':  0.00,
                    'Special_AnesthesianFee':  0.00,
                   
                    'Prev_Fee': 0.00,
                    'Prev_SurgeonFee': 0.00,
                    'Prev_OTFee': 0.00,
                    'Prev_AssistantSurgeonFee': 0.00,
                    'Prev_AnesthesianFee': 0.00,
                }
            )
       
       for insurance in Insurance_Master_Detials.objects.all():
            InsuranceFeeProcedure.objects.get_or_create(
                ProcedureId=instance,
                Insurance=insurance,
                defaults={
                    'Fee': instance.TotalAmount,  # Use Current_Charge for consistency
                    'SurgeonFee': instance.SurgeonFee,        # Use Acamt for consistency
                    'OTFee': instance.OTFee,    # Use NonACamt for consistency
                    'AssistantSurgeonFee': instance.AssistantSurgeonFee,
                    'AnesthesianFee': instance.AnesthesianFee,
                   
                    'Prev_Fee': 0.00,
                    'Prev_SurgeonFee': 0.00,
                    'Prev_OTFee': 0.00,
                    'Prev_AssistantSurgeonFee': 0.00,
                    'Prev_AnesthesianFee': 0.00,
                }
            )
 
       for client in Client_Master_Detials.objects.all():
            ClientFeeProcedure.objects.get_or_create(
                ProcedureId=instance,
                Client=client,
                defaults={
                    'Fee': instance.TotalAmount,  # Use Current_Charge for consistency
                    'SurgeonFee': instance.SurgeonFee,        # Use Acamt for consistency
                    'OTFee': instance.OTFee,    # Use NonACamt for consistency
                    'AssistantSurgeonFee': instance.AssistantSurgeonFee,
                    'AnesthesianFee': instance.AnesthesianFee,
                   
                    'Prev_Fee': 0.00,
                    'Prev_SurgeonFee': 0.00,
                    'Prev_OTFee': 0.00,
                    'Prev_AssistantSurgeonFee': 0.00,
                    'Prev_AnesthesianFee': 0.00,
                }
            )
 
       for corporate in Corporate_Master_Detials.objects.all():
            CorporateFeeProcedure.objects.get_or_create(
                ProcedureId=instance,
                Corporate=corporate,
                defaults={
                    'Fee': instance.TotalAmount,  # Use Current_Charge for consistency
                    'SurgeonFee': instance.SurgeonFee,        # Use Acamt for consistency
                    'OTFee': instance.OTFee,    # Use NonACamt for consistency
                    'AssistantSurgeonFee': instance.AssistantSurgeonFee,
                    'AnesthesianFee': instance.AnesthesianFee,
                   
                    'Prev_Fee': 0.00,
                    'Prev_SurgeonFee': 0.00,
                    'Prev_OTFee': 0.00,
                    'Prev_AssistantSurgeonFee': 0.00,
                    'Prev_AnesthesianFee': 0.00,
                }
            )
 
       for discount in DiscountMaster.objects.all():
            service = Service_Category_Masters.objects.get(Serviceid = discount.Service.pk)
            if service.ServiceCategory.upper() == 'PROCEDURES':
                DiscountFeeProcedure.objects.get_or_create(
                    ProcedureId=instance,
                    discount = discount,
                    Fee = instance.TotalAmount,  # Use Current_Charge for consistency
                    SurgeonFee = instance.SurgeonFee,        # Use Acamt for consistency
                    OTFee =  instance.OTFee,    # Use NonACamt for consistency
                    AssistantSurgeonFee =  instance.AssistantSurgeonFee,
                    AnesthesianFee =  instance.AnesthesianFee,
                   
                    Prev_Fee = 0.00,
                    Prev_SurgeonFee = 0.00,
                    Prev_OTFee =  0.00,
                    Prev_AssistantSurgeonFee = 0.00,
                    Prev_AnesthesianFee = 0.00,
 
                )
       
@receiver(post_save, sender=Insurance_Master_Detials)
def create_insurance_Procedure_fee(sender, instance, created, **kwargs):
    if created:
        # Create Insurance_Room_Fee for each Room_Ratecard_Master
        for Procedure_ratecard in Procedure_Master_Details.objects.all():
            InsuranceFeeProcedure.objects.get_or_create(
                ProcedureId=Procedure_ratecard,
                Insurance=instance,
                defaults={
                    'Fee': Procedure_ratecard.TotalAmount,  # Use Current_Charge for consistency
                    'SurgeonFee': Procedure_ratecard.SurgeonFee,        # Use Acamt for consistency
                    'OTFee': Procedure_ratecard.OTFee,    # Use NonACamt for consistency
                    'AssistantSurgeonFee': Procedure_ratecard.AssistantSurgeonFee,
                    'AnesthesianFee': Procedure_ratecard.AnesthesianFee,
                   
                    'Prev_Fee': 0.00,
                    'Prev_SurgeonFee': 0.00,
                    'Prev_OTFee': 0.00,
                    'Prev_AssistantSurgeonFee': 0.00,
                    'Prev_AnesthesianFee': 0.00,
                }
            )
 
@receiver(post_save, sender=Client_Master_Detials)
def create_client_Procedure_fee(sender, instance, created, **kwargs):
    if created:
        # Create Client_Room_Fee for each Room_Ratecard_Master
        for Procedure_ratecard in Procedure_Master_Details.objects.all():
            ClientFeeProcedure.objects.get_or_create(
                ProcedureId=Procedure_ratecard,
                Client=instance,
                defaults={
                    'Fee': Procedure_ratecard.TotalAmount,  # Use Current_Charge for consistency
                    'SurgeonFee': Procedure_ratecard.SurgeonFee,        # Use Acamt for consistency
                    'OTFee': Procedure_ratecard.OTFee,    # Use NonACamt for consistency
                    'AssistantSurgeonFee': Procedure_ratecard.AssistantSurgeonFee,
                    'AnesthesianFee': Procedure_ratecard.AnesthesianFee,
                   
                    'Prev_Fee': 0.00,
                    'Prev_SurgeonFee': 0.00,
                    'Prev_OTFee': 0.00,
                    'Prev_AssistantSurgeonFee': 0.00,
                    'Prev_AnesthesianFee': 0.00,
                }
            )
 
@receiver(post_save, sender=Corporate_Master_Detials)
def create_corporate_Procedure_fee(sender, instance, created, **kwargs):
    if created:
        # Create Corporate_Room_Fee for each Room_Ratecard_Master
        for Procedure_ratecard in Procedure_Master_Details.objects.all():
            CorporateFeeProcedure.objects.get_or_create(
                ProcedureId=Procedure_ratecard,
                Corporate=instance,
                defaults={
                    'Fee': Procedure_ratecard.TotalAmount,  # Use Current_Charge for consistency
                    'SurgeonFee': Procedure_ratecard.SurgeonFee,        # Use Acamt for consistency
                    'OTFee': Procedure_ratecard.OTFee,    # Use NonACamt for consistency
                    'AssistantSurgeonFee': Procedure_ratecard.AssistantSurgeonFee,
                    'AnesthesianFee': Procedure_ratecard.AnesthesianFee,
                   
                    'Prev_Fee': 0.00,
                    'Prev_SurgeonFee': 0.00,
                    'Prev_OTFee': 0.00,
                    'Prev_AssistantSurgeonFee': 0.00,
                    'Prev_AnesthesianFee': 0.00,
                }
            )
 
 
@receiver(post_save, sender=WardType_Master_Detials)
def create_Ward_Procedure_fee(sender, instance, created, **kwargs):
    if created:
        # Create Corporate_Room_Fee for each Room_Ratecard_Master
        for Procedure_ratecard in Procedure_Master_Details.objects.all():
            wardFeeProcedure.objects.get_or_create(
                ProcedureId=Procedure_ratecard,
                Ward=instance,
                defaults={
                    'Fee': Procedure_ratecard.TotalAmount,  # Use Current_Charge for consistency
                    'SurgeonFee': Procedure_ratecard.SurgeonFee,        # Use Acamt for consistency
                    'OTFee': Procedure_ratecard.OTFee,    # Use NonACamt for consistency
                    'AssistantSurgeonFee': Procedure_ratecard.AssistantSurgeonFee,
                    'AnesthesianFee': Procedure_ratecard.AnesthesianFee,
                   
                    'Prev_Fee': 0.00,
                    'Prev_SurgeonFee': 0.00,
                    'Prev_OTFee': 0.00,
                    'Prev_AssistantSurgeonFee': 0.00,
                    'Prev_AnesthesianFee': 0.00,
                }
            )
 
 
 
 
 
 












