from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import pandas as pd
from .models import *
from Frontoffice.models import *
from django.db.models import Q
from dateutil.relativedelta import relativedelta
from datetime import datetime, date

@csrf_exempt
@require_http_methods(["POST", "GET"])
def Patient_Detials_FileUpload(request):
    if request.method == "POST":
        try:
            excel_file = request.FILES.get("file")

            print(excel_file, 'excel_file')
            print("Received file:", excel_file.name)

            if not excel_file or not excel_file.name.endswith(('.xlsx', '.xls')):
                return JsonResponse({"error": "Please upload a valid Excel (.xlsx or .xls) file."})

            df = pd.read_excel(excel_file, engine='openpyxl')
            df = df.where(pd.notnull(df), "").astype(str)
            print(df.head(), 'ddddddddddffffffff')

            def clean_numeric_string(val):
                if pd.isna(val) or val in ["", "nan", "NaN"]:
                    return ""
                try:
                    val_float = float(val)
                    if val_float.is_integer():
                        return str(int(val_float))
                    return str(val)
                except:
                    return str(val).strip()

            numeric_string_fields = [
                "Pincode", "PermanentPincode", "ExistingPtNo",
                "PhoneNo", "UniqueIdNo"
            ]

            for field in numeric_string_fields:
                if field in df.columns:
                    df[field] = df[field].apply(clean_numeric_string)

            # Optional: clear table before uploading
            # Patient_Detials.objects.all().delete()

            def safe_fk_lookup(model, field, value):
                return model.objects.filter(**{field: int(value)}).first() if value and str(value).isdigit() else None

            def parse_dob(dob_str):
                """Parse DOB from various formats"""
                if not dob_str or str(dob_str).strip().lower() in ["", "nat", "nan", "none", "null"]:
                    return None
                
                try:
                    # Handle different date formats with dayfirst=True for DD-MM-YYYY
                    parsed = pd.to_datetime(dob_str, errors='coerce', dayfirst=True)
                    if pd.notna(parsed):
                        return parsed.date()
                    return None
                except:
                    return None

            def calculate_full_age(dob):
                """Calculate age from DOB in format: Y years, M months, D days"""
                if not dob:
                    return ""
                
                try:
                    today = date.today()
                    
                    # Ensure dob is a date object
                    if isinstance(dob, str):
                        dob = parse_dob(dob)
                        if not dob:
                            return ""
                    
                    # Handle future dates
                    if dob > today:
                        print(f"Warning: DOB {dob} is in the future")
                        return "0 Y, 0 M, 0 D"
                    
                    # Calculate the difference
                    diff = relativedelta(today, dob)
                    
                    # Format the age string
                    return f"{diff.years} Y, {diff.months} M, {diff.days} D"
                except Exception as e:
                    print(f"Error calculating age: {e}")
                    return ""

            def estimate_dob_from_age(age_str):
                """Estimate DOB from age (assuming Jan 1st of birth year)"""
                try:
                    age = int(float(age_str))
                    today = date.today()
                    # Simple estimation: birth year = current year - age
                    return date(today.year - age, 1, 1)
                except:
                    return None

            for index, row in df.iterrows():
                try:
                    # Handle ForeignKey lookups
                    title = safe_fk_lookup(Title_Detials, "Title_Id", row.get("Title"))
                    blood_group = safe_fk_lookup(BloodGroup_Detials, "BloodGroup_Id", row.get("BloodGroup"))
                    religion = safe_fk_lookup(Religion_Detials, "Religion_Id", row.get("Religion"))
                    flagging = safe_fk_lookup(Flaggcolor_Detials, "Flagg_Id", row.get("Flagging"))
                    doctor = safe_fk_lookup(Doctor_Personal_Form_Detials, "Doctor_ID", row.get("DoctorID"))
                    specialization = safe_fk_lookup(Speciality_Detials, "Speciality_Id", row.get("SpecializationId"))

                    opening_balance = row.get("OpeningBalance")
                    opening_balance = float(opening_balance) if opening_balance not in [None, ""] else 0

                    # Check for existing patient
                    existing_patient = Patient_Detials.objects.filter(
                        FirstName=row.get("FirstName") or "",
                        MiddleName=row.get("MiddleName") or "",
                        SurName=row.get("SurName") or "",
                        DOB=row.get("DOB") or "",
                        PhoneNo=row.get("PhoneNo") or "",
                        DoorNo=row.get("DoorNo") or "",
                        Street=row.get("Street") or "",
                        Area=row.get("Area") or "",
                        City=row.get("City") or "",
                        District=row.get("District") or "",
                        State=row.get("State") or "",
                        Country=row.get("Country") or "",
                        Pincode=row.get("Pincode") or ""
                    ).first()

                    FirstName = row.get("FirstName") or ""
                    MiddleName = row.get("MiddleName") or ""
                    SurName = row.get("SurName") or ""
                    upper_name = f'{FirstName.upper()} {MiddleName.upper()} {SurName.upper()}'

                    # **CORE LOGIC: Handle Age and DOB fields**
                    dob_raw = str(row.get("DOB", "")).strip()
                    age_raw = str(row.get("Age", "")).strip()
                    
                    print(f"Processing patient - DOB: '{dob_raw}', Age: '{age_raw}'")
                    
                    dob = None
                    age_display = ""
                    
                    # Case 1: Both DOB and Age are provided
                    if dob_raw and dob_raw not in ["", "nan", "NaN"] and age_raw and age_raw not in ["", "nan", "NaN"]:
                        dob = parse_dob(dob_raw)
                        age_display = calculate_full_age(dob)  # Use calculated age from DOB for accuracy
                    
                    # Case 2: Only DOB is provided
                    elif dob_raw and dob_raw not in ["", "nan", "NaN"]:
                        dob = parse_dob(dob_raw)
                        age_display = calculate_full_age(dob)
                    
                    # Case 3: Only Age is provided
                    elif age_raw and age_raw not in ["", "nan", "NaN"]:
                        dob = estimate_dob_from_age(age_raw)
                        age_display = f"{age_raw} Y"  # Keep original age format
                    
                    # Case 4: Neither is provided (both empty)
                    else:
                        dob = None
                        age_display = ""

                    print(f"Result - DOB: {dob}, Age: {age_display}")

                    if existing_patient:
                        # Update existing patient
                        existing_patient.ExistingPtNo = row.get("ExistingPtNo") or ""
                        existing_patient.Gender = row.get("Gender") or ""
                        existing_patient.MaritalStatus = row.get("MaritalStatus") or ""
                        existing_patient.SpouseName = row.get("SpouseName") or ""
                        existing_patient.FatherName = row.get("FatherName") or ""
                        existing_patient.Age = age_display or ""
                        existing_patient.DOB = dob or ""
                        existing_patient.Email = row.get("Email") or ""
                        existing_patient.Occupation = row.get("Occupation") or ""
                        existing_patient.Nationality = row.get("Nationality") or ""
                        existing_patient.UniqueIdType = row.get("UniqueIdType") or ""
                        existing_patient.UniqueIdNo = row.get("UniqueIdNo") or ""
                        existing_patient.PatientType = row.get("PatientType") or ""
                        existing_patient.ABHA = row.get("ABHA") or ""
                        existing_patient.PermanentAddressSameAsAbove = row.get("PermanentAddressSameAsAbove") or ""
                        existing_patient.PermanentdoorNo = row.get("PermanentdoorNo") or ""
                        existing_patient.PermanentStreet = row.get("PermanentStreet") or ""
                        existing_patient.PermanentArea = row.get("PermanentArea") or ""
                        existing_patient.PermanentCity = row.get("PermanentCity") or ""
                        existing_patient.PermanentDistrict = row.get("PermanentDistrict") or ""
                        existing_patient.PermanentState = row.get("PermanentState") or ""
                        existing_patient.PermanentCountry = row.get("PermanentCountry") or ""
                        existing_patient.PermanentPincode = row.get("PermanentPincode") or ""
                        existing_patient.LedgerName = upper_name 
                        existing_patient.LedgerGroupName = Finance_GroupMaster_Detailes.objects.get(pk=2)
                        existing_patient.DebitOrCredit = 'Dr'
                        existing_patient.OpeningBalance = opening_balance
                        existing_patient.updated_by = row.get("updated_by", "system")
                        existing_patient.Status = row.get("Status", "Saved")
                        existing_patient.save()
                    else:
                        # Create new patient record
                        Patient_Detials.objects.create(
                            DuplicateId=row.get("DuplicateId", False),
                            Patient_profile=None,
                            ExistingPtNo=row.get("ExistingPtNo") or "",
                            Title=title,
                            FirstName=row.get("FirstName") or "",
                            MiddleName=row.get("MiddleName") or "",
                            SurName=row.get("SurName") or "",
                            Gender=row.get("Gender") or "",
                            MaritalStatus=row.get("MaritalStatus") or "",
                            SpouseName=row.get("SpouseName") or "",
                            FatherName=row.get("FatherName") or "",
                            DOB=dob or "",
                            Age=age_display or "",
                            PhoneNo=row.get("PhoneNo") or "",
                            Email=row.get("Email") or "",
                            BloodGroup=blood_group,
                            Occupation=row.get("Occupation") or "",
                            Religion=religion,
                            Nationality=row.get("Nationality") or "",
                            UniqueIdType=row.get("UniqueIdType") or "",
                            UniqueIdNo=row.get("UniqueIdNo") or "",
                            PatientType=row.get("PatientType") or "",
                            ABHA=row.get("ABHA") or "",
                            Flagging=flagging,
                            DoorNo=row.get("DoorNo") or "",
                            Street=row.get("Street") or "",
                            Area=row.get("Area") or "",
                            City=row.get("City") or "",
                            District=row.get("District") or "",
                            State=row.get("State") or "",
                            Country=row.get("Country") or "",
                            Pincode=row.get("Pincode") or "",
                            PermanentAddressSameAsAbove=row.get("PermanentAddressSameAsAbove") or "",
                            PermanentdoorNo=row.get("PermanentdoorNo") or "",
                            PermanentStreet=row.get("PermanentStreet") or "",
                            PermanentArea=row.get("PermanentArea") or "",
                            PermanentCity=row.get("PermanentCity") or "",
                            PermanentDistrict=row.get("PermanentDistrict") or "",
                            PermanentState=row.get("PermanentState") or "",
                            PermanentCountry=row.get("PermanentCountry") or "",
                            PermanentPincode=row.get("PermanentPincode") or "",
                            LedgerName=upper_name,
                            LedgerGroupName=Finance_GroupMaster_Detailes.objects.get(pk=2),
                            DebitOrCredit='Dr',
                            OpeningBalance=opening_balance,
                            DoctorID=doctor,
                            SpecializationId=specialization,
                            created_by=row.get("created_by", "system"),
                            updated_by=row.get("updated_by", "system") or "",
                            Status=row.get("Status", "Saved"),
                        )
                except Exception as row_err:
                    return JsonResponse({"error": f"Row {index + 2} failed: {str(row_err)}"})

            return JsonResponse({"success": "Patient details uploaded successfully."})

        except Exception as e:
            print("Upload failed:", str(e))
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "GET":
        try:
            SearchPatientName = request.GET.get("SearchPatientName")
            search_phone = request.GET.get("PhoneNo")
            SearchPatientID = request.GET.get("SearchPatientID")

            query = Q()
            if SearchPatientName:
                query &= Q(FirstName__icontains=SearchPatientName)
            if search_phone:
                query &= Q(PhoneNo__icontains=search_phone)
            if SearchPatientID:
                query &= Q(PatientId=SearchPatientID)
            
            data = Patient_Detials.objects.filter(query)

            result = []
            for idx, item in enumerate(data):
                result.append({
                    "id": idx + 1,
                    "PatientId": item.PatientId,
                    "FirstName": item.FirstName,
                    "MiddleName": item.MiddleName,
                    "SurName": item.SurName,
                    "FullName": f"""{item.Title.Title_Name if item.Title else ''}.{item.FirstName or ""} {item.MiddleName or ""} {item.SurName or ""}""".strip(),
                    "Gender": item.Gender,
                    "Age": item.Age,
                    "Dob": item.DOB,
                    "PhoneNo": item.PhoneNo,
                    "Email": item.Email,
                    "Status": item.Status,
                    "CreatedAt": item.created_at.strftime('%d-%m-%Y') if item.created_at else "",
                })

            return JsonResponse(result, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
# from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.http import require_http_methods
# from django.http import JsonResponse
# import pandas as pd
# from .models import *
# from Frontoffice.models import *
# # from .models import Patient_Detials, Title_Detials, BloodGroup_Detials, Religion_Detials, Flaggcolor_Detials, Speciality_Detials, Doctor_Personal_Form_Detials
# from django.db.models import Q
# from dateutil.relativedelta import relativedelta
# from datetime import datetime, date



# ##---------age =25 dob =======> 01-01-1998
# ##---------age - 23 and dob 04-08-2001  ======> age : 23 Y, 10M, 0 D
# ##---------age and dob empty then save empty
# ## --------dob 04-08-2001 age====> 23 Y, 10M, 0 D



# @csrf_exempt
# @require_http_methods(["POST", "GET"])
# def Patient_Detials_FileUpload(request):
#     if request.method == "POST":
#         try:
#             excel_file = request.FILES.get("file")

#             print(excel_file,'excel_file')
#             print("Received file:", excel_file.name)

#             if not excel_file or not excel_file.name.endswith(('.xlsx', '.xls')):
#                 return JsonResponse({"error": "Please upload a valid Excel (.xlsx or .xls) file."})

#             # df = pd.read_excel(excel_file).fillna(None)

#             # df = pd.read_excel(excel_file, engine='openpyxl').where(pd.notnull(df), None)

#             df = pd.read_excel(excel_file, engine='openpyxl')
#             df = df.where(pd.notnull(df), "").astype(str)  # 👈 key line to avoid NaN issues
#             # df = df.where(pd.notnull(df), None)
            
#             # df = pd.read_excel(excel_file, engine='openpyxl').where(pd.notnull(pd.read_excel(excel_file, engine='openpyxl')), None)
#             print(df.head(),'ddddddddddffffffff')
            
#             # return JsonResponse({"success": "File read successfully."})

            
#             # def clean_numeric_string(val):
#             #     if pd.isna(val):
#             #         return ""
#             #     if isinstance(val, float) and val.is_integer():
#             #         return str(int(val))
#             #     return str(val)

#             def clean_numeric_string(val):
#                 if pd.isna(val) or val in ["", "nan", "NaN"]:
#                     return ""
#                 try:
#                     val_float = float(val)
#                     if val_float.is_integer():
#                         return str(int(val_float))
#                     return str(val)
#                 except:
#                     return str(val).strip()

#             numeric_string_fields = [
#                 "Pincode", "PermanentPincode", "ExistingPtNo",
#                 "PhoneNo", "UniqueIdNo"
#             ]

#             for field in numeric_string_fields:
#                 if field in df.columns:
#                     df[field] = df[field].apply(clean_numeric_string)

#             Patient_Detials.objects.all().delete()  # Optional: clear table before uploading

#             def safe_fk_lookup(model, field, value):
#                 return model.objects.filter(**{field: int(value)}).first() if value and str(value).isdigit() else None

#             # def calculate_dob_from_age(age):
#             #     try:
#             #         age = int(age)
#             #         year = datetime.now().year - age
#             #         return datetime(year, 1, 1).date()
#             #     except:
#             #         return None

#             # def get_cleaned_dob(dob, age):
#                 if pd.isna(dob) or str(dob).strip().lower() in ["", "nat", "nan", "none"]:
#                     return calculate_dob_from_age(age)
#                 try:
#                     return pd.to_datetime(dob).date()
#                 except:
#                     return calculate_dob_from_age(age)

#             # def parse_dob(dob_str):
#             #     try:
#             #         parsed = pd.to_datetime(dob_str, errors='coerce')
#             #         return parsed.date() if pd.notna(parsed) else None
#             #     except:
#             #         return None
#             def parse_dob(dob_str):
#                 """Parse DOB from various formats"""
#                 if not dob_str or str(dob_str).strip().lower() in ["", "nat", "nan", "none"]:
#                     return None
    
#                 try:
#                     # Handle different date formats with dayfirst=True for DD-MM-YYYY
#                     parsed = pd.to_datetime(dob_str, errors='coerce', dayfirst=True)
#                     if pd.notna(parsed):
#                         return parsed.date()
#                     return None
#                 except:
#                     return None

#             # def calculate_full_age(dob):
#             #     today = date.today()
#             #     diff = relativedelta(today, dob)
#             #     return f"{diff.years} Y, {diff.months} M, {diff.days} D"

#             # def estimate_dob_from_age(age_str):
#             #     try:
#             #         age = int(float(age_str))
#             #         today = date.today()
#             #         return date(today.year - age, 1, 1)
#             #     except:
#             #         return None

#             def calculate_full_age(dob):
#                 """Calculate age from DOB in format: Y years, M months, D days"""
#                 if not dob:
#                     return ""
    
#                 try:
#                     today = date.today()
        
#                     # Ensure dob is a date object
#                     if isinstance(dob, str):
#                         dob = parse_dob(dob)
#                         if not dob:
#                             return ""
        
#                     # Handle future dates
#                     if dob > today:
#                      print(f"Warning: DOB {dob} is in the future")
#                      return "0 Y, 0 M, 0 D"
        
#                 # Calculate the difference
#                     diff = relativedelta(today, dob)
        
#                      # Format the age string
#                     return f"{diff.years} Y, {diff.months} M, {diff.days} D"
#                 except Exception as e:
#                     print(f"Error calculating age: {e}")
#                     return ""
#             for index, row in df.iterrows():
#                 try:
#                     # Correct ForeignKey resolution using custom PKs
                   
#                     # title = None
#                     # if not pd.isna(row.get("Title")):
#                     #     title = Title_Detials.objects.filter(Title_Id=row.get("Title")).first()

#                     # blood_group = None
#                     # if not pd.isna(row.get("BloodGroup")):
#                     #     blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Id=row.get("BloodGroup")).first()

#                     # religion = None
#                     # if not pd.isna(row.get("Religion")):
#                     #     religion = Religion_Detials.objects.filter(Religion_Id=row.get("Religion")).first()

#                     # flagging = None
#                     # if not pd.isna(row.get("Flagging")):
#                     #     flagging = Flaggcolor_Detials.objects.filter(Flagg_Id=row.get("Flagging")).first()

#                     # doctor = None
#                     # if not pd.isna(row.get("DoctorID")):
#                     #     doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=row.get("DoctorID")).first()

#                     # specialization = None
#                     # if not pd.isna(row.get("SpecializationId")):
#                     #     specialization = Speciality_Detials.objects.filter(Speciality_Id=row.get("SpecializationId")).first()


#                     title = safe_fk_lookup(Title_Detials, "Title_Id", row.get("Title"))
#                     blood_group = safe_fk_lookup(BloodGroup_Detials, "BloodGroup_Id", row.get("BloodGroup"))
#                     religion = safe_fk_lookup(Religion_Detials, "Religion_Id", row.get("Religion"))
#                     flagging = safe_fk_lookup(Flaggcolor_Detials, "Flagg_Id", row.get("Flagging"))
#                     doctor = safe_fk_lookup(Doctor_Personal_Form_Detials, "Doctor_ID", row.get("DoctorID"))
#                     specialization = safe_fk_lookup(Speciality_Detials, "Speciality_Id", row.get("SpecializationId"))

                   
                    

#                     opening_balance = row.get("OpeningBalance")
#                     opening_balance = float(opening_balance) if opening_balance not in [None, ""] else 0

#                     existing_patient = Patient_Detials.objects.filter(
#                         FirstName=row.get("FirstName") or "",
#                         MiddleName=row.get("MiddleName") or "",
#                         SurName=row.get("SurName") or "",
#                         DOB=row.get("DOB") or "",
#                         PhoneNo=row.get("PhoneNo") or "",
#                         DoorNo=row.get("DoorNo") or "",
#                         Street=row.get("Street") or "",
#                         Area=row.get("Area") or "",
#                         City=row.get("City") or "",
#                         District=row.get("District") or "",
#                         State=row.get("State") or "",
#                         Country=row.get("Country") or "",
#                         Pincode=row.get("Pincode") or ""
#                     ).first()

#                     FirstName = row.get("FirstName") or ""
#                     MiddleName = row.get("MiddleName") or ""
#                     SurName = row.get("SurName") or ""

#                     upper_name = f'{FirstName.upper()} {MiddleName.upper()} {SurName.upper()} '

#                     # dob = row.get("DOB")
#                     # age = row.get("Age")
                    
#                     # dob = get_cleaned_dob(row.get("DOB"), row.get("Age"))
#                     # age = row.get("Age")

#                     # if not dob and age:
#                     #     dob = calculate_dob_from_age(age)


#                     # dob_raw = row.get("DOB")
#                     # age_raw = row.get("Age")

#                     # dob = parse_dob(dob_raw)  # Try parse DOB from file
#                     # age_val = age_raw if age_raw and str(age_raw).strip() != "" else None
                

#                     # if dob and age_val:
#                     #     # Both given: calculate age from DOB only
#                     #     calculated_age = calculate_precise_age(dob)
#                     # elif dob and not age_val:
#                     #     # Only DOB given
#                     #     calculated_age = calculate_precise_age(dob)
#                     # elif not dob and age_val:
#                     #     # Only Age given: estimate DOB Jan 1 (Year - age)
#                     #     dob = calculate_dob_from_age(age_val)
#                     #     calculated_age = calculate_precise_age(dob) if dob else ""
#                     # else:
#                     #     # Both missing
#                     #     dob = None
#                     #     calculated_age = ""


#                     # if dob:
#                     #     # DOB is given (ignore age column)
#                     #     calculated_age = calculate_precise_age(dob)
#                     # elif age_val:
#                     #     # Only age is given, estimate DOB from age
#                     #     dob = estimate_dob_from_age(age_val)
#                     #     calculated_age = calculate_precise_age(dob)
#                     # elif dob and age_val:
#                     #     # Both given: calculate age from DOB only
#                     #     calculated_age = calculate_precise_age(dob)
#                     # else:
#                     #     dob = None
#                     #     calculated_age = ""    

#                     # dob_raw = row.get("DOB", "").strip()
#                     # age_raw = row.get("Age", "").strip()

#                     # dob = parse_dob(dob_raw)
#                     # age = ""

#                     # if dob:
#                     #     age = calculate_full_age(dob)  # Use DOB to get accurate age
#                     # elif age_raw:
#                     #     dob = estimate_dob_from_age(age_raw)
#                     #     age = age_raw  # Keep original age number if DOB missing
#                     # else:
#                     #     dob = None
#                     #     age = ""
#                     dob_raw = str(row.get("DOB", "")).strip()
#                     age_raw = str(row.get("Age", "")).strip()
#                     print(f"Processing patient - DOB: '{dob_raw}', Age: '{age_raw}'")
#                     dob = None
#                     age = ""
#                     if existing_patient:
#                         # Step 2: If patient exists, update details
#                         existing_patient.ExistingPtNo = row.get("ExistingPtNo") or ""
#                         existing_patient.Gender = row.get("Gender") or ""
#                         existing_patient.MaritalStatus = row.get("MaritalStatus") or ""
#                         existing_patient.SpouseName = row.get("SpouseName") or ""
#                         existing_patient.FatherName = row.get("FatherName") or ""
#                         existing_patient.Age = age or ""
#                         existing_patient.DOB = dob or ""
#                         # existing_patient.Age = row.get("Age") or ""
#                         # existing_patient.DOB = row.get("DOB") or ""
#                         existing_patient.Email = row.get("Email") or ""
#                         existing_patient.Occupation = row.get("Occupation") or ""
#                         existing_patient.Nationality = row.get("Nationality") or ""
#                         existing_patient.UniqueIdType = row.get("UniqueIdType") or ""
#                         existing_patient.UniqueIdNo = row.get("UniqueIdNo") or ""
#                         existing_patient.PatientType = row.get("PatientType") or ""
#                         existing_patient.ABHA = row.get("ABHA") or ""
#                         existing_patient.PermanentAddressSameAsAbove = row.get("PermanentAddressSameAsAbove") or ""
#                         existing_patient.PermanentdoorNo = row.get("PermanentdoorNo") or ""
#                         existing_patient.PermanentStreet = row.get("PermanentStreet") or ""
#                         existing_patient.PermanentArea = row.get("PermanentArea") or ""
#                         existing_patient.PermanentCity = row.get("PermanentCity") or ""
#                         existing_patient.PermanentDistrict = row.get("PermanentDistrict") or ""
#                         existing_patient.PermanentState = row.get("PermanentState") or ""
#                         existing_patient.PermanentCountry = row.get("PermanentCountry") or ""
#                         existing_patient.PermanentPincode = row.get("PermanentPincode") or ""
#                         existing_patient.LedgerName = upper_name 
#                         existing_patient.LedgerGroupName = Finance_GroupMaster_Detailes.objects.get(pk=2)
#                         existing_patient.DebitOrCredit = 'Dr'
#                         existing_patient.OpeningBalance = opening_balance
#                         # existing_patient.OpeningBalance = row.get("OpeningBalance") or 0
#                         existing_patient.updated_by = row.get("updated_by", "system")
#                         existing_patient.Status = row.get("Status", "Saved")
#                         existing_patient.save()
#                     else:
                    
#                         # Create patient record
#                         Patient_Detials.objects.create(
#                         DuplicateId=row.get("DuplicateId", False),
#                         Patient_profile=None,  # Not handled (BinaryField)
#                         ExistingPtNo=row.get("ExistingPtNo") or "",
#                         Title=title,
#                         FirstName=row.get("FirstName") or "",
#                         MiddleName=row.get("MiddleName") or "",
#                         SurName=row.get("SurName") or "",
#                         Gender=row.get("Gender") or "",
#                         MaritalStatus=row.get("MaritalStatus") or "",
#                         SpouseName=row.get("SpouseName") or "",
#                         FatherName=row.get("FatherName") or "",
#                         DOB=dob or "",
#                         Age=age or "",
#                         # DOB=row.get("DOB") or "",
#                         # Age=row.get("Age") or "",
#                         PhoneNo=row.get("PhoneNo") or "",
#                         Email=row.get("Email") or "",
#                         BloodGroup=blood_group,
#                         Occupation=row.get("Occupation") or "",
#                         Religion=religion,
#                         Nationality=row.get("Nationality") or "",
#                         UniqueIdType=row.get("UniqueIdType") or "",
#                         UniqueIdNo=row.get("UniqueIdNo") or "",
#                         PatientType=row.get("PatientType") or "",
#                         ABHA=row.get("ABHA") or "",
#                         Flagging=flagging,
#                         DoorNo=row.get("DoorNo") or "",
#                         Street=row.get("Street") or "",
#                         Area=row.get("Area") or "",
#                         City=row.get("City") or "",
#                         District=row.get("District") or "",
#                         State=row.get("State") or "",
#                         Country=row.get("Country") or "",
#                         Pincode=row.get("Pincode") or "",
#                         PermanentAddressSameAsAbove=row.get("PermanentAddressSameAsAbove") or "",
#                         PermanentdoorNo=row.get("PermanentdoorNo") or "",
#                         PermanentStreet=row.get("PermanentStreet") or "",
#                         PermanentArea=row.get("PermanentArea") or "",
#                         PermanentCity=row.get("PermanentCity") or "",
#                         PermanentDistrict=row.get("PermanentDistrict") or "",
#                         PermanentState=row.get("PermanentState") or "",
#                         PermanentCountry=row.get("PermanentCountry") or "",
#                         PermanentPincode=row.get("PermanentPincode") or "",
#                         LedgerName = upper_name,
#                         LedgerGroupName = Finance_GroupMaster_Detailes.objects.get(pk=2),
#                         DebitOrCredit = 'Dr',
#                         OpeningBalance = opening_balance,
#                         # OpeningBalance = 0,
#                         # LedgerName=row.get("LedgerName") or "",
#                         # DebitOrCredit=row.get("DebitOrCredit") or "",
#                         # OpeningBalance=row.get("OpeningBalance") or 0,
                        
#                         DoctorID=doctor,
#                         SpecializationId=specialization,
#                         created_by=row.get("created_by", "system"),
#                         updated_by=row.get("updated_by", "system") or "",
#                         Status=row.get("Status", "Saved"),
#                     )
#                 except Exception as row_err:
#                     return JsonResponse({"error": f"Row {index + 2} failed: {str(row_err)}"})

#             return JsonResponse({"success": "Patient details uploaded successfully."})

#         except Exception as e:
#             print("Upload failed:", str(e))
#             return JsonResponse({"error": str(e)}, status=500)

#     elif request.method == "GET":
#         try:
            
#             SearchPatientName = request.GET.get("SearchPatientName")
#             search_phone = request.GET.get("PhoneNo")
#             SearchPatientID = request.GET.get("SearchPatientID")

#             query = Q()
#             if SearchPatientName:
#                 query &= Q(FirstName__icontains=SearchPatientName)
#             if search_phone:
#                 query &= Q(PhoneNo__icontains=search_phone)
#             if SearchPatientID:
#                 query &= Q(PatientId=SearchPatientID)
            
#             data = Patient_Detials.objects.filter(query)

#             result = []
#             for idx, item in enumerate(data):
#                 result.append({
#                     "id": idx + 1,
#                     "PatientId": item.PatientId,
#                     "FirstName": item.FirstName,
#                     "MiddleName": item.MiddleName,
#                     "SurName": item.SurName,
#                     "FullName": f"""{item.Title.Title_Name if item.Title else ''}.{item.FirstName or ""} {item.MiddleName or ""} {item.SurName or ""}""".strip(),
#                     "Gender": item.Gender,
#                     "Age": item.Age,
#                     "Dob": item.DOB,
#                     "PhoneNo": item.PhoneNo,
#                     "Email": item.Email,
#                     "Status": item.Status,
#                     "CreatedAt": item.created_at.strftime('%d-%m-%Y') if item.created_at else "",
#                 })

#             return JsonResponse(result, safe=False)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)




# ## age=23 ===> 23 Y, 5 M, 3D and Dob  01-01-2002

# # @csrf_exempt
# # @require_http_methods(["POST", "GET"])
# # def Patient_Detials_FileUpload(request):
# #     if request.method == "POST":
# #         try:
# #             excel_file = request.FILES.get("file")

# #             print(excel_file,'excel_file')
# #             print("Received file:", excel_file.name)

# #             if not excel_file or not excel_file.name.endswith(('.xlsx', '.xls')):
# #                 return JsonResponse({"error": "Please upload a valid Excel (.xlsx or .xls) file."})

# #             # df = pd.read_excel(excel_file).fillna(None)

# #             # df = pd.read_excel(excel_file, engine='openpyxl').where(pd.notnull(df), None)

# #             df = pd.read_excel(excel_file, engine='openpyxl')
# #             df = df.where(pd.notnull(df), "").astype(str)  # 👈 key line to avoid NaN issues
# #             # df = df.where(pd.notnull(df), None)
            
# #             # df = pd.read_excel(excel_file, engine='openpyxl').where(pd.notnull(pd.read_excel(excel_file, engine='openpyxl')), None)
# #             print(df.head(),'ddddddddddffffffff')
            
# #             # return JsonResponse({"success": "File read successfully."})

            
# #             # def clean_numeric_string(val):
# #             #     if pd.isna(val):
# #             #         return ""
# #             #     if isinstance(val, float) and val.is_integer():
# #             #         return str(int(val))
# #             #     return str(val)

# #             def clean_numeric_string(val):
# #                 if pd.isna(val) or val in ["", "nan", "NaN"]:
# #                     return ""
# #                 try:
# #                     val_float = float(val)
# #                     if val_float.is_integer():
# #                         return str(int(val_float))
# #                     return str(val)
# #                 except:
# #                     return str(val).strip()

# #             numeric_string_fields = [
# #                 "Pincode", "PermanentPincode", "ExistingPtNo",
# #                 "PhoneNo", "UniqueIdNo"
# #             ]

# #             for field in numeric_string_fields:
# #                 if field in df.columns:
# #                     df[field] = df[field].apply(clean_numeric_string)

# #             Patient_Detials.objects.all().delete()  # Optional: clear table before uploading

# #             def safe_fk_lookup(model, field, value):
# #                 return model.objects.filter(**{field: int(value)}).first() if value and str(value).isdigit() else None

# #             # def calculate_dob_from_age(age):
# #             #     try:
# #             #         age = int(age)
# #             #         year = datetime.now().year - age
# #             #         return datetime(year, 1, 1).date()
# #             #     except:
# #             #         return None

# #             def calculate_dob_from_age(age):
# #                 try:
# #                     age = int(age)
# #                     year = date.today().year - age
# #                     return date(year, 1, 1)
# #                 except:
# #                     return None

# #             def get_cleaned_dob(dob, age):
# #                 if pd.isna(dob) or str(dob).strip().lower() in ["", "nat", "nan", "none"]:
# #                     return calculate_dob_from_age(age)
# #                 try:
# #                     return pd.to_datetime(dob).date()
# #                 except:
# #                     return calculate_dob_from_age(age)

# #             def calculate_precise_age(dob):
# #                 try:
# #                     dob_dt = pd.to_datetime(dob, errors='coerce')
# #                     if pd.isna(dob_dt):
# #                         return ""
# #                     today = datetime.today()
# #                     delta = relativedelta(today, dob_dt)
# #                     return f"{delta.years} Y, {delta.months} M, {delta.days} D"
# #                 except Exception as e:
# #                     return ""

# #             def calculate_precise_age_from_dob(dob):
# #                 try:
# #                     today = date.today()
# #                     years = today.year - dob.year
# #                     months = today.month - dob.month
# #                     days = today.day - dob.day

# #                     if days < 0:
# #                         months -= 1
# #                         previous_month = (today.month - 1) if today.month > 1 else 12
# #                         previous_month_year = today.year if today.month > 1 else today.year - 1
# #                         days += (date(previous_month_year, previous_month + 1, 1) - date(previous_month_year, previous_month, 1)).days

# #                     if months < 0:
# #                         years -= 1
# #                         months += 12

# #                     return f"{years} Y, {months} M, {days} D"
# #                 except:
# #                     return ""
                
# #             for index, row in df.iterrows():
# #                 try:
# #                     # Correct ForeignKey resolution using custom PKs
                   
# #                     # title = None
# #                     # if not pd.isna(row.get("Title")):
# #                     #     title = Title_Detials.objects.filter(Title_Id=row.get("Title")).first()

# #                     # blood_group = None
# #                     # if not pd.isna(row.get("BloodGroup")):
# #                     #     blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Id=row.get("BloodGroup")).first()

# #                     # religion = None
# #                     # if not pd.isna(row.get("Religion")):
# #                     #     religion = Religion_Detials.objects.filter(Religion_Id=row.get("Religion")).first()

# #                     # flagging = None
# #                     # if not pd.isna(row.get("Flagging")):
# #                     #     flagging = Flaggcolor_Detials.objects.filter(Flagg_Id=row.get("Flagging")).first()

# #                     # doctor = None
# #                     # if not pd.isna(row.get("DoctorID")):
# #                     #     doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=row.get("DoctorID")).first()

# #                     # specialization = None
# #                     # if not pd.isna(row.get("SpecializationId")):
# #                     #     specialization = Speciality_Detials.objects.filter(Speciality_Id=row.get("SpecializationId")).first()


# #                     title = safe_fk_lookup(Title_Detials, "Title_Id", row.get("Title"))
# #                     blood_group = safe_fk_lookup(BloodGroup_Detials, "BloodGroup_Id", row.get("BloodGroup"))
# #                     religion = safe_fk_lookup(Religion_Detials, "Religion_Id", row.get("Religion"))
# #                     flagging = safe_fk_lookup(Flaggcolor_Detials, "Flagg_Id", row.get("Flagging"))
# #                     doctor = safe_fk_lookup(Doctor_Personal_Form_Detials, "Doctor_ID", row.get("DoctorID"))
# #                     specialization = safe_fk_lookup(Speciality_Detials, "Speciality_Id", row.get("SpecializationId"))

                   
                    

# #                     opening_balance = row.get("OpeningBalance")
# #                     opening_balance = float(opening_balance) if opening_balance not in [None, ""] else 0

# #                     existing_patient = Patient_Detials.objects.filter(
# #                         FirstName=row.get("FirstName") or "",
# #                         MiddleName=row.get("MiddleName") or "",
# #                         SurName=row.get("SurName") or "",
# #                         DOB=row.get("DOB") or "",
# #                         PhoneNo=row.get("PhoneNo") or "",
# #                         DoorNo=row.get("DoorNo") or "",
# #                         Street=row.get("Street") or "",
# #                         Area=row.get("Area") or "",
# #                         City=row.get("City") or "",
# #                         District=row.get("District") or "",
# #                         State=row.get("State") or "",
# #                         Country=row.get("Country") or "",
# #                         Pincode=row.get("Pincode") or ""
# #                     ).first()

# #                     FirstName = row.get("FirstName") or ""
# #                     MiddleName = row.get("MiddleName") or ""
# #                     SurName = row.get("SurName") or ""

# #                     upper_name = f'{FirstName.upper()} {MiddleName.upper()} {SurName.upper()} '

# #                     dob = get_cleaned_dob(row.get("DOB"), row.get("Age"))
# #                     age = calculate_precise_age(dob)
                    
# #                     #--------------------
# #                     # age = row.get("Age")

# #                     # dob = row.get("DOB")
# #                     # age = row.get("Age")
# #                     #--------------------

# #                     if not dob and age:
# #                         dob = calculate_dob_from_age(age)

# #                     # dob_raw = row.get("DOB")
# #                     # age_raw = row.get("Age")

# #                     # dob = None
# #                     # age = ""

# #                     # age_raw = str(age_raw).strip()
# #                     # dob_raw = str(dob_raw).strip()

# #                     # if dob_raw not in ["", "None", "nan", "NaN"] and age_raw not in ["", "None", "nan", "NaN"]:
# #                     #     dob = pd.to_datetime(dob_raw, dayfirst=True).date()
# #                     #     age = calculate_precise_age_from_dob(dob)
# #                     # elif age_raw not in ["", "None", "nan", "NaN"]:
# #                     #     dob = calculate_dob_from_age(age_raw)
# #                     #     age = calculate_precise_age_from_dob(dob)
# #                     # elif dob_raw not in ["", "None", "nan", "NaN"]:
# #                     #     dob = pd.to_datetime(dob_raw, dayfirst=True).date()
# #                     #     age = calculate_precise_age_from_dob(dob)
    

# #                     if existing_patient:
# #                         # Step 2: If patient exists, update details
# #                         existing_patient.ExistingPtNo = row.get("ExistingPtNo") or ""
# #                         existing_patient.Gender = row.get("Gender") or ""
# #                         existing_patient.MaritalStatus = row.get("MaritalStatus") or ""
# #                         existing_patient.SpouseName = row.get("SpouseName") or ""
# #                         existing_patient.FatherName = row.get("FatherName") or ""
# #                         existing_patient.Age = age or ""
# #                         existing_patient.DOB = dob or ""
# #                         # existing_patient.Age = row.get("Age") or ""
# #                         # existing_patient.DOB = row.get("DOB") or ""
# #                         existing_patient.Email = row.get("Email") or ""
# #                         existing_patient.Occupation = row.get("Occupation") or ""
# #                         existing_patient.Nationality = row.get("Nationality") or ""
# #                         existing_patient.UniqueIdType = row.get("UniqueIdType") or ""
# #                         existing_patient.UniqueIdNo = row.get("UniqueIdNo") or ""
# #                         existing_patient.PatientType = row.get("PatientType") or ""
# #                         existing_patient.ABHA = row.get("ABHA") or ""
# #                         existing_patient.PermanentAddressSameAsAbove = row.get("PermanentAddressSameAsAbove") or ""
# #                         existing_patient.PermanentdoorNo = row.get("PermanentdoorNo") or ""
# #                         existing_patient.PermanentStreet = row.get("PermanentStreet") or ""
# #                         existing_patient.PermanentArea = row.get("PermanentArea") or ""
# #                         existing_patient.PermanentCity = row.get("PermanentCity") or ""
# #                         existing_patient.PermanentDistrict = row.get("PermanentDistrict") or ""
# #                         existing_patient.PermanentState = row.get("PermanentState") or ""
# #                         existing_patient.PermanentCountry = row.get("PermanentCountry") or ""
# #                         existing_patient.PermanentPincode = row.get("PermanentPincode") or ""
# #                         existing_patient.LedgerName = upper_name 
# #                         existing_patient.LedgerGroupName = Finance_GroupMaster_Detailes.objects.get(pk=2)
# #                         existing_patient.DebitOrCredit = 'Dr'
# #                         existing_patient.OpeningBalance = opening_balance
# #                         # existing_patient.OpeningBalance = row.get("OpeningBalance") or 0
# #                         existing_patient.updated_by = row.get("updated_by", "system")
# #                         existing_patient.Status = row.get("Status", "Saved")
# #                         existing_patient.save()
# #                     else:
                    
# #                         # Create patient record
# #                         Patient_Detials.objects.create(
# #                         DuplicateId=row.get("DuplicateId", False),
# #                         Patient_profile=None,  # Not handled (BinaryField)
# #                         ExistingPtNo=row.get("ExistingPtNo") or "",
# #                         Title=title,
# #                         FirstName=row.get("FirstName") or "",
# #                         MiddleName=row.get("MiddleName") or "",
# #                         SurName=row.get("SurName") or "",
# #                         Gender=row.get("Gender") or "",
# #                         MaritalStatus=row.get("MaritalStatus") or "",
# #                         SpouseName=row.get("SpouseName") or "",
# #                         FatherName=row.get("FatherName") or "",
# #                         DOB=dob or "",
# #                         Age=age or "",
# #                         # DOB=row.get("DOB") or "",
# #                         # Age=row.get("Age") or "",
# #                         PhoneNo=row.get("PhoneNo") or "",
# #                         Email=row.get("Email") or "",
# #                         BloodGroup=blood_group,
# #                         Occupation=row.get("Occupation") or "",
# #                         Religion=religion,
# #                         Nationality=row.get("Nationality") or "",
# #                         UniqueIdType=row.get("UniqueIdType") or "",
# #                         UniqueIdNo=row.get("UniqueIdNo") or "",
# #                         PatientType=row.get("PatientType") or "",
# #                         ABHA=row.get("ABHA") or "",
# #                         Flagging=flagging,
# #                         DoorNo=row.get("DoorNo") or "",
# #                         Street=row.get("Street") or "",
# #                         Area=row.get("Area") or "",
# #                         City=row.get("City") or "",
# #                         District=row.get("District") or "",
# #                         State=row.get("State") or "",
# #                         Country=row.get("Country") or "",
# #                         Pincode=row.get("Pincode") or "",
# #                         PermanentAddressSameAsAbove=row.get("PermanentAddressSameAsAbove") or "",
# #                         PermanentdoorNo=row.get("PermanentdoorNo") or "",
# #                         PermanentStreet=row.get("PermanentStreet") or "",
# #                         PermanentArea=row.get("PermanentArea") or "",
# #                         PermanentCity=row.get("PermanentCity") or "",
# #                         PermanentDistrict=row.get("PermanentDistrict") or "",
# #                         PermanentState=row.get("PermanentState") or "",
# #                         PermanentCountry=row.get("PermanentCountry") or "",
# #                         PermanentPincode=row.get("PermanentPincode") or "",
# #                         LedgerName = upper_name,
# #                         LedgerGroupName = Finance_GroupMaster_Detailes.objects.get(pk=2),
# #                         DebitOrCredit = 'Dr',
# #                         OpeningBalance = opening_balance,
# #                         # OpeningBalance = 0,
# #                         # LedgerName=row.get("LedgerName") or "",
# #                         # DebitOrCredit=row.get("DebitOrCredit") or "",
# #                         # OpeningBalance=row.get("OpeningBalance") or 0,
                        
# #                         DoctorID=doctor,
# #                         SpecializationId=specialization,
# #                         created_by=row.get("created_by", "system"),
# #                         updated_by=row.get("updated_by", "system") or "",
# #                         Status=row.get("Status", "Saved"),
# #                     )
# #                 except Exception as row_err:
# #                     return JsonResponse({"error": f"Row {index + 2} failed: {str(row_err)}"})

# #             return JsonResponse({"success": "Patient details uploaded successfully."})

# #         except Exception as e:
# #             print("Upload failed:", str(e))
# #             return JsonResponse({"error": str(e)}, status=500)

# #     elif request.method == "GET":
# #         try:
            
# #             SearchPatientName = request.GET.get("SearchPatientName")
# #             search_phone = request.GET.get("PhoneNo")
# #             SearchPatientID = request.GET.get("SearchPatientID")

# #             query = Q()
# #             if SearchPatientName:
# #                 query &= Q(FirstName__icontains=SearchPatientName)
# #             if search_phone:
# #                 query &= Q(PhoneNo__icontains=search_phone)
# #             if SearchPatientID:
# #                 query &= Q(PatientId=SearchPatientID)
            
# #             data = Patient_Detials.objects.filter(query)

# #             result = []
# #             for idx, item in enumerate(data):
# #                 result.append({
# #                     "id": idx + 1,
# #                     "PatientId": item.PatientId,
# #                     "FirstName": item.FirstName,
# #                     "MiddleName": item.MiddleName,
# #                     "SurName": item.SurName,
# #                     "FullName": f'{item.Title.Title_Name if item.Title else ''}.{item.FirstName or ""} {item.MiddleName or ""} {item.SurName or ""}'.strip(),
# #                     "Gender": item.Gender,
# #                     "Age": item.Age,
# #                     "Dob": item.DOB,
# #                     "PhoneNo": item.PhoneNo,
# #                     "Email": item.Email,
# #                     "Status": item.Status,
# #                     "CreatedAt": item.created_at.strftime('%d-%m-%Y') if item.created_at else "",
# #                 })

# #             return JsonResponse(result, safe=False)
# #         except Exception as e:
# #             return JsonResponse({"error": str(e)}, status=500)


# ## age = 23 ===> age =23 and DOB 05-06-2002


# # @csrf_exempt
# # @require_http_methods(["POST", "GET"])
# # def Patient_Detials_FileUpload(request):
# #     if request.method == "POST":
# #         try:
# #             excel_file = request.FILES.get("file")

# #             print(excel_file,'excel_file')
# #             print("Received file:", excel_file.name)

# #             if not excel_file or not excel_file.name.endswith(('.xlsx', '.xls')):
# #                 return JsonResponse({"error": "Please upload a valid Excel (.xlsx or .xls) file."})

# #             # df = pd.read_excel(excel_file).fillna(None)

# #             # df = pd.read_excel(excel_file, engine='openpyxl').where(pd.notnull(df), None)

# #             df = pd.read_excel(excel_file, engine='openpyxl')
# #             df = df.where(pd.notnull(df), "").astype(str)  # 👈 key line to avoid NaN issues
# #             # df = df.where(pd.notnull(df), None)
            
# #             # df = pd.read_excel(excel_file, engine='openpyxl').where(pd.notnull(pd.read_excel(excel_file, engine='openpyxl')), None)
# #             print(df.head(),'ddddddddddffffffff')
            
# #             # return JsonResponse({"success": "File read successfully."})

            
# #             # def clean_numeric_string(val):
# #             #     if pd.isna(val):
# #             #         return ""
# #             #     if isinstance(val, float) and val.is_integer():
# #             #         return str(int(val))
# #             #     return str(val)

# #             def clean_numeric_string(val):
# #                 if pd.isna(val) or val in ["", "nan", "NaN"]:
# #                     return ""
# #                 try:
# #                     val_float = float(val)
# #                     if val_float.is_integer():
# #                         return str(int(val_float))
# #                     return str(val)
# #                 except:
# #                     return str(val).strip()

# #             numeric_string_fields = [
# #                 "Pincode", "PermanentPincode", "ExistingPtNo",
# #                 "PhoneNo", "UniqueIdNo"
# #             ]

# #             for field in numeric_string_fields:
# #                 if field in df.columns:
# #                     df[field] = df[field].apply(clean_numeric_string)

# #             Patient_Detials.objects.all().delete()  # Optional: clear table before uploading

# #             def safe_fk_lookup(model, field, value):
# #                 return model.objects.filter(**{field: int(value)}).first() if value and str(value).isdigit() else None

# #             def calculate_dob_from_age(age):
# #                 try:
# #                     age = int(age)
# #                     year = datetime.now().year - age
# #                     return datetime(year, 1, 1).date()
# #                 except:
# #                     return None

# #             def get_cleaned_dob(dob, age):
# #                 if pd.isna(dob) or str(dob).strip().lower() in ["", "nat", "nan", "none"]:
# #                     return calculate_dob_from_age(age)
# #                 try:
# #                     return pd.to_datetime(dob).date()
# #                 except:
# #                     return calculate_dob_from_age(age)



# #             for index, row in df.iterrows():
# #                 try:
# #                     # Correct ForeignKey resolution using custom PKs
                   
# #                     # title = None
# #                     # if not pd.isna(row.get("Title")):
# #                     #     title = Title_Detials.objects.filter(Title_Id=row.get("Title")).first()

# #                     # blood_group = None
# #                     # if not pd.isna(row.get("BloodGroup")):
# #                     #     blood_group = BloodGroup_Detials.objects.filter(BloodGroup_Id=row.get("BloodGroup")).first()

# #                     # religion = None
# #                     # if not pd.isna(row.get("Religion")):
# #                     #     religion = Religion_Detials.objects.filter(Religion_Id=row.get("Religion")).first()

# #                     # flagging = None
# #                     # if not pd.isna(row.get("Flagging")):
# #                     #     flagging = Flaggcolor_Detials.objects.filter(Flagg_Id=row.get("Flagging")).first()

# #                     # doctor = None
# #                     # if not pd.isna(row.get("DoctorID")):
# #                     #     doctor = Doctor_Personal_Form_Detials.objects.filter(Doctor_ID=row.get("DoctorID")).first()

# #                     # specialization = None
# #                     # if not pd.isna(row.get("SpecializationId")):
# #                     #     specialization = Speciality_Detials.objects.filter(Speciality_Id=row.get("SpecializationId")).first()


# #                     title = safe_fk_lookup(Title_Detials, "Title_Id", row.get("Title"))
# #                     blood_group = safe_fk_lookup(BloodGroup_Detials, "BloodGroup_Id", row.get("BloodGroup"))
# #                     religion = safe_fk_lookup(Religion_Detials, "Religion_Id", row.get("Religion"))
# #                     flagging = safe_fk_lookup(Flaggcolor_Detials, "Flagg_Id", row.get("Flagging"))
# #                     doctor = safe_fk_lookup(Doctor_Personal_Form_Detials, "Doctor_ID", row.get("DoctorID"))
# #                     specialization = safe_fk_lookup(Speciality_Detials, "Speciality_Id", row.get("SpecializationId"))

                   
                    

# #                     opening_balance = row.get("OpeningBalance")
# #                     opening_balance = float(opening_balance) if opening_balance not in [None, ""] else 0

# #                     existing_patient = Patient_Detials.objects.filter(
# #                         FirstName=row.get("FirstName") or "",
# #                         MiddleName=row.get("MiddleName") or "",
# #                         SurName=row.get("SurName") or "",
# #                         DOB=row.get("DOB") or "",
# #                         PhoneNo=row.get("PhoneNo") or "",
# #                         DoorNo=row.get("DoorNo") or "",
# #                         Street=row.get("Street") or "",
# #                         Area=row.get("Area") or "",
# #                         City=row.get("City") or "",
# #                         District=row.get("District") or "",
# #                         State=row.get("State") or "",
# #                         Country=row.get("Country") or "",
# #                         Pincode=row.get("Pincode") or ""
# #                     ).first()

# #                     FirstName = row.get("FirstName") or ""
# #                     MiddleName = row.get("MiddleName") or ""
# #                     SurName = row.get("SurName") or ""

# #                     upper_name = f'{FirstName.upper()} {MiddleName.upper()} {SurName.upper()} '

# #                     dob = get_cleaned_dob(row.get("DOB"), row.get("Age"))
# #                     age = row.get("Age")

# #                     # dob = row.get("DOB")
# #                     # age = row.get("Age")

# #                     if not dob and age:
# #                         dob = calculate_dob_from_age(age)

# #                     if existing_patient:
# #                         # Step 2: If patient exists, update details
# #                         existing_patient.ExistingPtNo = row.get("ExistingPtNo") or ""
# #                         existing_patient.Gender = row.get("Gender") or ""
# #                         existing_patient.MaritalStatus = row.get("MaritalStatus") or ""
# #                         existing_patient.SpouseName = row.get("SpouseName") or ""
# #                         existing_patient.FatherName = row.get("FatherName") or ""
# #                         existing_patient.Age = age or ""
# #                         existing_patient.DOB = dob or ""
# #                         # existing_patient.Age = row.get("Age") or ""
# #                         # existing_patient.DOB = row.get("DOB") or ""
# #                         existing_patient.Email = row.get("Email") or ""
# #                         existing_patient.Occupation = row.get("Occupation") or ""
# #                         existing_patient.Nationality = row.get("Nationality") or ""
# #                         existing_patient.UniqueIdType = row.get("UniqueIdType") or ""
# #                         existing_patient.UniqueIdNo = row.get("UniqueIdNo") or ""
# #                         existing_patient.PatientType = row.get("PatientType") or ""
# #                         existing_patient.ABHA = row.get("ABHA") or ""
# #                         existing_patient.PermanentAddressSameAsAbove = row.get("PermanentAddressSameAsAbove") or ""
# #                         existing_patient.PermanentdoorNo = row.get("PermanentdoorNo") or ""
# #                         existing_patient.PermanentStreet = row.get("PermanentStreet") or ""
# #                         existing_patient.PermanentArea = row.get("PermanentArea") or ""
# #                         existing_patient.PermanentCity = row.get("PermanentCity") or ""
# #                         existing_patient.PermanentDistrict = row.get("PermanentDistrict") or ""
# #                         existing_patient.PermanentState = row.get("PermanentState") or ""
# #                         existing_patient.PermanentCountry = row.get("PermanentCountry") or ""
# #                         existing_patient.PermanentPincode = row.get("PermanentPincode") or ""
# #                         existing_patient.LedgerName = upper_name 
# #                         existing_patient.LedgerGroupName = Finance_GroupMaster_Detailes.objects.get(pk=2)
# #                         existing_patient.DebitOrCredit = 'Dr'
# #                         existing_patient.OpeningBalance = opening_balance
# #                         # existing_patient.OpeningBalance = row.get("OpeningBalance") or 0
# #                         existing_patient.updated_by = row.get("updated_by", "system")
# #                         existing_patient.Status = row.get("Status", "Saved")
# #                         existing_patient.save()
# #                     else:
                    
# #                         # Create patient record
# #                         Patient_Detials.objects.create(
# #                         DuplicateId=row.get("DuplicateId", False),
# #                         Patient_profile=None,  # Not handled (BinaryField)
# #                         ExistingPtNo=row.get("ExistingPtNo") or "",
# #                         Title=title,
# #                         FirstName=row.get("FirstName") or "",
# #                         MiddleName=row.get("MiddleName") or "",
# #                         SurName=row.get("SurName") or "",
# #                         Gender=row.get("Gender") or "",
# #                         MaritalStatus=row.get("MaritalStatus") or "",
# #                         SpouseName=row.get("SpouseName") or "",
# #                         FatherName=row.get("FatherName") or "",
# #                         DOB=dob or "",
# #                         Age=age or "",
# #                         # DOB=row.get("DOB") or "",
# #                         # Age=row.get("Age") or "",
# #                         PhoneNo=row.get("PhoneNo") or "",
# #                         Email=row.get("Email") or "",
# #                         BloodGroup=blood_group,
# #                         Occupation=row.get("Occupation") or "",
# #                         Religion=religion,
# #                         Nationality=row.get("Nationality") or "",
# #                         UniqueIdType=row.get("UniqueIdType") or "",
# #                         UniqueIdNo=row.get("UniqueIdNo") or "",
# #                         PatientType=row.get("PatientType") or "",
# #                         ABHA=row.get("ABHA") or "",
# #                         Flagging=flagging,
# #                         DoorNo=row.get("DoorNo") or "",
# #                         Street=row.get("Street") or "",
# #                         Area=row.get("Area") or "",
# #                         City=row.get("City") or "",
# #                         District=row.get("District") or "",
# #                         State=row.get("State") or "",
# #                         Country=row.get("Country") or "",
# #                         Pincode=row.get("Pincode") or "",
# #                         PermanentAddressSameAsAbove=row.get("PermanentAddressSameAsAbove") or "",
# #                         PermanentdoorNo=row.get("PermanentdoorNo") or "",
# #                         PermanentStreet=row.get("PermanentStreet") or "",
# #                         PermanentArea=row.get("PermanentArea") or "",
# #                         PermanentCity=row.get("PermanentCity") or "",
# #                         PermanentDistrict=row.get("PermanentDistrict") or "",
# #                         PermanentState=row.get("PermanentState") or "",
# #                         PermanentCountry=row.get("PermanentCountry") or "",
# #                         PermanentPincode=row.get("PermanentPincode") or "",
# #                         LedgerName = upper_name,
# #                         LedgerGroupName = Finance_GroupMaster_Detailes.objects.get(pk=2),
# #                         DebitOrCredit = 'Dr',
# #                         OpeningBalance = opening_balance,
# #                         # OpeningBalance = 0,
# #                         # LedgerName=row.get("LedgerName") or "",
# #                         # DebitOrCredit=row.get("DebitOrCredit") or "",
# #                         # OpeningBalance=row.get("OpeningBalance") or 0,
                        
# #                         DoctorID=doctor,
# #                         SpecializationId=specialization,
# #                         created_by=row.get("created_by", "system"),
# #                         updated_by=row.get("updated_by", "system") or "",
# #                         Status=row.get("Status", "Saved"),
# #                     )
# #                 except Exception as row_err:
# #                     return JsonResponse({"error": f"Row {index + 2} failed: {str(row_err)}"})

# #             return JsonResponse({"success": "Patient details uploaded successfully."})

# #         except Exception as e:
# #             print("Upload failed:", str(e))
# #             return JsonResponse({"error": str(e)}, status=500)

# #     elif request.method == "GET":
# #         try:
            
# #             SearchPatientName = request.GET.get("SearchPatientName")
# #             search_phone = request.GET.get("PhoneNo")
# #             SearchPatientID = request.GET.get("SearchPatientID")

# #             query = Q()
# #             if SearchPatientName:
# #                 query &= Q(FirstName__icontains=SearchPatientName)
# #             if search_phone:
# #                 query &= Q(PhoneNo__icontains=search_phone)
# #             if SearchPatientID:
# #                 query &= Q(PatientId=SearchPatientID)
            
# #             data = Patient_Detials.objects.filter(query)

# #             result = []
# #             for idx, item in enumerate(data):
# #                 result.append({
# #                     "id": idx + 1,
# #                     "PatientId": item.PatientId,
# #                     "FirstName": item.FirstName,
# #                     "MiddleName": item.MiddleName,
# #                     "SurName": item.SurName,
# #                     "FullName": f'{item.Title.Title_Name if item.Title else ''}.{item.FirstName or ""} {item.MiddleName or ""} {item.SurName or ""}'.strip(),
# #                     "Gender": item.Gender,
# #                     "Age": item.Age,
# #                     "Dob": item.DOB,
# #                     "PhoneNo": item.PhoneNo,
# #                     "Email": item.Email,
# #                     "Status": item.Status,
# #                     "CreatedAt": item.created_at.strftime('%d-%m-%Y') if item.created_at else "",
# #                 })

# #             return JsonResponse(result, safe=False)
# #         except Exception as e:
# #             return JsonResponse({"error": str(e)}, status=500)






