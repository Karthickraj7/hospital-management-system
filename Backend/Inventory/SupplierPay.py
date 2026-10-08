import json
from django.http import JsonResponse
from django.db.models import Q, Sum
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Supplier_pay_detials,GRN_Table_Detials,Supplier_Pay_By_Date
from .GoodsReceiptNote import get_or_none
@csrf_exempt
@require_http_methods(["GET"])
def get_supplier_payment_detials(request):
    try:
        SupplierCode = request.GET.get('supplierCode')
        SupplierName = request.GET.get('supplierName')
        Status = request.GET.get('status','Pending') == 'Completed'
        
        filter_conditions = Q()
        
        if SupplierCode:
            filter_conditions &= Q(Grn_Detials__Supplier_Detials__pk__icontains=SupplierCode)
        if SupplierName:
            filter_conditions &= Q(Grn_Detials__Supplier_Detials__Supplier_Name__icontains=SupplierName)
        if Status:
            filter_conditions &= Q(Status=Status)  # Directly comparing with 'Completed'

        supplier_pay_Instance = Supplier_pay_detials.objects.filter(filter_conditions).values(
            'Grn_Detials__Supplier_Detials__pk', 
            'Grn_Detials__Supplier_Detials__Supplier_Name'
        ).annotate(
            total_amount=Sum('GRN_Invoice_Amount'),
            paid_amount=Sum('GRN_Paid_Amount'),
            balance_amount=Sum('GRN_Balance_Amount')
        )
        
        supplier_pay_Instance_data = []

        for indx, ins in enumerate(supplier_pay_Instance):
            ins_data = {
                "id": indx+1,
                "SupplierCode": ins['Grn_Detials__Supplier_Detials__pk'],
                "SupplierName": ins['Grn_Detials__Supplier_Detials__Supplier_Name'],
                "TotalAmount": ins['total_amount'],
                "PaidAmount": ins['paid_amount'],
                "BalanceAmount": ins['balance_amount'],
            }
            supplier_pay_Instance_data.append(ins_data)

        return JsonResponse(supplier_pay_Instance_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_supplier_payment_by_invoice_detials(request):
    try:
        SupplierCode = request.GET.get('supplierCode')
        InvoiceNo = request.GET.get('invoiceNo')
        Status = request.GET.get('status','') 
        GRN_No = request.GET.get('GRN_No','') 
        
        filter_conditions = Q()
        
        if SupplierCode:
            filter_conditions &= Q(Grn_Detials__Supplier_Detials__pk=SupplierCode)
        
        if InvoiceNo:
            filter_conditions &= Q(Grn_Detials__pk__icontains=InvoiceNo)
        if GRN_No:
            filter_conditions &= Q(Grn_Detials__GRN_No__icontains=GRN_No)
        
        if Status != '':
            if Status =='Completed':
                filter_conditions &= Q(Status=True)  # Directly comparing with 'Completed'
            elif Status =='Pending':
                filter_conditions &= Q(Status=False)  # Directly comparing with 'Completed'
                
        supplier_pay_Instance = Supplier_pay_detials.objects.filter(filter_conditions)
        print(supplier_pay_Instance)
        supplier_pay_Instance_data = []

        for indx, ins in enumerate(supplier_pay_Instance):
            ins_data = {
                "id": indx+1,
                'pk':ins.pk,
                'GRN_No':ins.Grn_Detials.GRN_No,
                "SupplierCode": ins.Grn_Detials.Supplier_Detials.pk,
                "SupplierName": ins.Grn_Detials.Supplier_Detials.Supplier_Name,
                "GRN_Invoice_No": ins.Grn_Detials.pk,
                "GRN_Invoice_Date": ins.Grn_Detials.Created_at.strftime('%Y-%m-%d'),
                "Supplier_Bill_Date": ins.Grn_Detials.Supplier_Bill_Date,
                "GRN_Due_Date": ins.Grn_Detials.Supplier_Bill_Due_Date,
                "GRN_Invoice_Amount": ins.GRN_Invoice_Amount,
                "GRN_Paid_Amount": ins.GRN_Paid_Amount,
                "GRN_Balance_Amount": ins.GRN_Balance_Amount,
                'Status':ins.Status,
                'OldGrn':ins.Grn_Detials.IsOldGRN,
                'OldGrnUpdateStatus':ins.Grn_Detials.OldGRN_Updated
            }
            supplier_pay_Instance_data.append(ins_data)


        return JsonResponse(supplier_pay_Instance_data, safe=False)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'An internal server error occurred'}, status=500)



@csrf_exempt
@require_http_methods(["POST", "GET", "OPTIONS"])
def supplier_payment_day_by_date(request):
    
    # Handle POST request
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            pk = data.get('pk')
            GRN_Invoice_Amount = data.get('GRN_Invoice_Amount')
            GRN_Paid_Amount = data.get('GRN_Paid_Amount')
            GRN_Balance_Amount = data.get('GRN_Balance_Amount')
            Payable_Amount = data.get('Payable_Amount')
            Balance_Amount = data.get('Balance_Amount')
            PaidDate = data.get('PaidDate')
            PaymentMethod = data.get('PaymentMethod')
            PaymentDetails = data.get('PaymentDetials')  # Fixing typo
            Created_by = data.get('Created_by')
            
            # Assuming get_or_none is a utility function that returns None if no object is found
            Supplier_pay_detials_ins = get_or_none(Supplier_pay_detials, pk)
            
            if not Supplier_pay_detials_ins:
                return JsonResponse({'error': 'Invalid GRN Invoice provided'}, status=400)
            
            # Create the Supplier_Pay_By_Date entry
            Supplier_Pay_By_Date.objects.create(
                Supplier_pay_detials=Supplier_pay_detials_ins,
                GRN_Invoice_Amount=GRN_Invoice_Amount,
                GRN_Paid_Amount=GRN_Paid_Amount,
                GRN_Balance_Amount=GRN_Balance_Amount,
                Paid_Amount=Payable_Amount,
                Balance_Amount=Balance_Amount,
                Bill_Paid_Date=PaidDate,
                Payment_Method=PaymentMethod,
                Payment_Detials=PaymentDetails,
                Created_by=Created_by,
            )
            
            return JsonResponse({'success': f'Supplier bill paid successfully for invoice {Supplier_pay_detials_ins.Grn_Detials.pk}'}, status=200)
        
        # Handle JSON decoding errors and other exceptions
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)

    # Handle GET request
    elif request.method == 'GET':
        try:
            SupplierName = request.GET.get('SupplierName')
            SupplierCode = request.GET.get('SupplierCode')
            InvoiceNo = request.GET.get('InvoiceNo')
            DateType = request.GET.get('DateType')
            CurrentDate = request.GET.get('CurrentDate')
            FromDate = request.GET.get('FromDate')
            ToDate = request.GET.get('ToDate')
            filter_conditions = Q()

            # Add filtering conditions based on provided GET parameters
            if SupplierCode:
                filter_conditions &= Q(Supplier_pay_detials__Grn_Detials__Supplier_Detials__pk__icontains=SupplierCode)
            if SupplierName:
                filter_conditions &= Q(Supplier_pay_detials__Grn_Detials__Supplier_Detials__Supplier_Name__icontains=SupplierName)
            if InvoiceNo:
                filter_conditions &= Q(Supplier_pay_detials__Grn_Detials__pk__icontains=InvoiceNo)

            # Date filtering based on Current or Custom date range
            if DateType == 'Current' and CurrentDate:
                filter_conditions &= Q(Bill_Paid_Date=CurrentDate)
            if DateType == 'Customize' :
                if FromDate and ToDate:
                    filter_conditions &= Q(Bill_Paid_Date__range=[FromDate, ToDate])
                elif FromDate:
                    filter_conditions &= Q(Bill_Paid_Date__gte=FromDate)
                elif ToDate:
                    filter_conditions &= Q(Bill_Paid_Date__lte=ToDate)
            # Query the filtered data
            supplier_payment_ins = Supplier_Pay_By_Date.objects.filter(filter_conditions).values(
                'Supplier_pay_detials__Grn_Detials__Supplier_Detials__pk', 
                'Supplier_pay_detials__Grn_Detials__Supplier_Detials__Supplier_Name', 
                'Supplier_pay_detials__Grn_Detials__pk', 
                'Supplier_pay_detials__Grn_Detials__Created_at', 
                'Supplier_pay_detials__Grn_Detials__Supplier_Bill_Date', 
                'Supplier_pay_detials__Grn_Detials__Supplier_Bill_Due_Date',
                'GRN_Invoice_Amount', 
                'GRN_Paid_Amount', 
                'GRN_Balance_Amount', 
                'Paid_Amount', 
                'Balance_Amount', 
                'Bill_Paid_Date', 
                'Payment_Method', 
                'Payment_Detials', 
                'NewPayment', 
                'Created_by'
            )

            supplier_payment_data = []

            # Iterate over the results and build the response list
            for indx, ins in enumerate(supplier_payment_ins):
                data = {
                    "id": indx + 1,
                    "SupplierCode": ins['Supplier_pay_detials__Grn_Detials__Supplier_Detials__pk'],
                    "SupplierName": ins['Supplier_pay_detials__Grn_Detials__Supplier_Detials__Supplier_Name'],
                    "GRN_Invoice_No": ins['Supplier_pay_detials__Grn_Detials__pk'],
                    "GRN_Invoice_Date": ins['Supplier_pay_detials__Grn_Detials__Created_at'].strftime('%Y-%m-%d'),
                    "Supplier_Bill_Date": ins['Supplier_pay_detials__Grn_Detials__Supplier_Bill_Date'],
                    "GRN_Due_Date": ins['Supplier_pay_detials__Grn_Detials__Supplier_Bill_Due_Date'],
                    "GRN_Invoice_Amount": ins['GRN_Invoice_Amount'],
                    "GRN_Paid_Amount": ins['GRN_Paid_Amount'],
                    "GRN_Balance_Amount": ins['GRN_Balance_Amount'],
                    "Paid_Amount": ins['Paid_Amount'],
                    "Balance_Amount": ins['Balance_Amount'],
                    "Bill_Paid_Date": ins['Bill_Paid_Date'],
                    "Payment_Method": ins['Payment_Method'],
                    "Payment_Detials": ins['Payment_Detials'],
                    "PaymentMode": 'New Payment' if ins['NewPayment'] else 'Old Payment',
                    "Payment_by": ins['Created_by'],
                }
                supplier_payment_data.append(data)

            return JsonResponse(supplier_payment_data, safe=False)
        
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)



