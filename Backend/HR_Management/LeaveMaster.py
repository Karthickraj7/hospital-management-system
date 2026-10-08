from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import LeaveMaster
import json


# Create a new LeaveMaster record






@csrf_exempt
def leave_master_create(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON data from the request body
            
            data = json.loads(request.body)
            
            # Create a new LeaveMaster object
            leave_master = LeaveMaster.objects.create(
                leave_type=data['leave_type'],
                short_name=data['short_name'],
                # description=data['description'],
                applicable_to=data.get('applicable_to', 'Both'),
                leave_unit=data.get('leave_unit', 'Days'),
                leave_unit_no_of=data.get('leave_unit_no_of', 1),
                carry_forward=data.get('carry_forward', 'NO'),
                lop=data.get('lop', 'NO'),
                payable=data.get('payable', 'NO'),
                yearly_encashment=data.get('yearly_encashment', 'NO'),
                # Per_year=data.get('Per_year', None),
                # no_balance_check=data.get('no_balance_check', 'NO'),
                # leave_back_date=data.get('leave_back_date', 'NO'),
                inactive=data.get('inactive', 'NO')
            )

            # The code is auto-generated in the model's save() method, so no need to manually handle it
            leave_master.save()

            # Return a success response
            return JsonResponse({'message': 'Leave Master created successfully!', 'code': leave_master.code}, status=201)

        except Exception as e:
            # Return an error response if something goes wrong
            return JsonResponse({'error': str(e)}, status=400)


# Get all LeaveMaster records
@csrf_exempt
def leave_master_list(request):
    if request.method == 'GET':
        # Fetch all LeaveMaster records from the database
        leave_masters = LeaveMaster.objects.all()

        # Prepare the response data
        data = []
        for leave in leave_masters:
            data.append({
                'id': leave.id,
                'code': leave.code,
                'leave_type': leave.leave_type,
                'short_name': leave.short_name,
                # 'description': leave.description,
                'applicable_to': leave.applicable_to,
                'leave_unit': leave.leave_unit,
                'leave_unit_no_of': leave.leave_unit_no_of,
                'carry_forward': leave.carry_forward,
                'lop': leave.lop,
                'payable': leave.payable,
                'yearly_encashment': leave.yearly_encashment,
                # 'Per_year': leave.Per_year,
                # 'no_balance_check': leave.no_balance_check,
                # 'leave_back_date': leave.leave_back_date,
                'inactive': leave.inactive,
                'created_at': leave.created_at,
                'updated_at': leave.updated_at
            })

        # Return the data as JSON
        return JsonResponse(data, safe=False)


@csrf_exempt  # Use this if you are testing without proper CSRF setup
def leave_master_update(request, pk):
    if request.method == 'PUT':
        try:
            leave_master = LeaveMaster.objects.get(pk=pk)
        except LeaveMaster.DoesNotExist:
            return JsonResponse({'error': 'LeaveMaster record not found'}, status=404)

        # Parse incoming JSON data
        try:
            body = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        # Update fields manually (Ensure the fields exist in your model)
        leave_master.code = body.get('code', leave_master.code)
        leave_master.leave_type = body.get('leave_type', leave_master.leave_type)
        leave_master.short_name = body.get('short_name', leave_master.short_name)
        # leave_master.description = body.get('description', leave_master.description)
        leave_master.applicable_to = body.get('applicable_to', leave_master.applicable_to)
        leave_master.leave_unit = body.get('leave_unit', leave_master.leave_unit)
        leave_master.leave_unit_no_of = body.get('leave_unit_no_of', leave_master.leave_unit_no_of)
        leave_master.carry_forward = body.get('carry_forward', leave_master.carry_forward)
        leave_master.lop = body.get('lop', leave_master.lop)
        leave_master.payable = body.get('payable', leave_master.payable)
        leave_master.yearly_encashment = body.get('yearly_encashment', leave_master.yearly_encashment)
        # leave_master.Per_year = body.get('Per_year', leave_master.Per_year)
        # leave_master.no_balance_check = body.get('no_balance_check', leave_master.no_balance_check)
        # leave_master.leave_back_date = body.get('leave_back_date', leave_master.leave_back_date)
        leave_master.inactive = body.get('inactive', leave_master.inactive)

        # Save the updated record
        leave_master.save()

        return JsonResponse({'message': 'LeaveMaster updated successfully'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
