from django.shortcuts import render
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer, UserDataSerializer, UserDataIncomeSerializer
from .models import ExpensesUsers, ExpensesUserData, ExpensesUserDataIncome

# Create your views here
User = get_user_model()


class UserModelViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = ExpensesUsers.objects.all()


class UserDataModelViewSet(ModelViewSet):
    serializer_class = UserDataSerializer
    queryset = ExpensesUserData.objects.all()

class UserDataIncomeModelViewSet(ModelViewSet):
    serializer_class = UserDataIncomeSerializer
    queryset = ExpensesUserDataIncome.objects.all()


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            if ExpensesUsers.objects.filter(email=email).exists():
                return Response({'error': f'email {email} already registered.'}, status=status.HTTP_409_CONFLICT)
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        email = request.data['email']
        password = request.data['password']
        try:
            user = authenticate(request, username=email, password=password)

            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'id': user.id
                }, status=status.HTTP_200_OK)

            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['POST'])
def addIncome(request, id):
    if request.method == 'POST':
        print(request.data)
        user = ExpensesUsers.objects.get(id=id)
        serializer = UserDataIncomeSerializer(data=request.data, context={'user':user})

        if serializer.is_valid():
            newIncome=serializer.save()
            return Response({'newIncome':UserDataIncomeSerializer(newIncome).data}, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors: ", serializer.errors)
        
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def getIncomes(request, id):
    if request.method == 'GET':
        try:
            incomes = ExpensesUserDataIncome.objects.filter(user_id=id)
            if not incomes.exists():
                return Response({'error':'no data for the user'}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = UserDataIncomeSerializer(incomes, many=True)
            return Response({'incomes': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       


@api_view(['POST'])
def addExpense(request, id):
    if request.method == 'POST':
        print(request.data)
        user = ExpensesUsers.objects.get(id=id)  # Get user by the passed 'id'
        serializer = UserDataSerializer(data=request.data, context={'user': user})  # Pass user in context
        
        if serializer.is_valid():
            newExpense = serializer.save()  # Serializer handles instance creation
            return Response({'newExpense': UserDataSerializer(newExpense).data}, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
        
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def deleteExpense(request, user_id, id):
    if request.method == 'DELETE':
        expense = ExpensesUserData.objects.filter(id=id)
        print(expense)
        if expense.exists():
            expense.delete()
            return Response({'message':'Deleted successfully'}, status=status.HTTP_200_OK)
        return Response({'error':'error while deleting'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
def editExpense(request, user_id):
    if request.method == 'PUT':
        try:
            user = ExpensesUsers.objects.get(id=user_id)
        except ExpensesUsers.DoesNotExist:
            return Response({'error':'user not found'}, status=status.HTTP_404_NOT_FOUND)
        
        updateExpense = request.data

        try:
            expense = ExpensesUserData.objects.get(id=updateExpense['id'], user_id=user_id)
        except ExpensesUserData.DoesNotExist:
            return Response({'error':'expense not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserDataSerializer(expense, data=updateExpense, context={'user': user})
        
        if serializer.is_valid():
            serializer.save()
            return Response({'updated succesfully': serializer.data}, status=status.HTTP_200_OK)
        
        return Response({'error updating':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            
        


@api_view(['GET'])
def getExpenses(request, id):
    if request.method == 'GET':
        try:
            expenses = ExpensesUserData.objects.filter(user_id=id)
            if not expenses.exists():
                return Response({'error':'no data for the user'}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = UserDataSerializer(expenses, many=True)
            return Response({'expenses': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

#################################################################################################################################
# @api_view(['POST'])
# def login(request):
#     if request.method == 'POST':
#         serializer = UserDataSerializer(data=request.data)
#         if serializer.is_valid():
