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


@api_view(['GET'])
def getUser(request, id):
    if request.method == 'GET':
        try:
            user = ExpensesUsers.objects.get(id=id)
            serializer = UserSerializer(user)
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        except ExpensesUsers.DoesNotExist:
            return Response({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def updateUser(request, id):
    if request.method == 'PUT':
        try:
            user = ExpensesUsers.objects.get(id=id)
            updateUser = {
                'first_name': request.data.get('first_name', user.first_name),
                'last_name': request.data.get('last_name', user.last_name),
                'age': request.data.get('age', user.age),
                'email': user.email
            }
            serializer = UserSerializer(
                user, data=updateUser)
            if serializer.is_valid():
                serializer.save()
                return Response({'successfully updated': serializer.data}, status=status.HTTP_200_OK)
            return Response({'error updating': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def deleteUser(request, id):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        print("THIS IS FRONT PASSWORD", password)
        try:
            checkUser = ExpensesUsers.objects.get(id=id)
            if checkUser:
                user = authenticate(request, username=email, password=password)
                print("THIS IS CHECK USER", user)
                if user is not None:
                    user.delete()
                    return Response({'message': 'user deleted'}, status=status.HTTP_200_OK)
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except ExpensesUsers.DoesNotExist:
            return Response({'error':'user not found'}, status=status.HTTP_404_NOT_FOUND)
        


@api_view(['POST'])
def addIncome(request, id):
    if request.method == 'POST':
        print(request.data)
        user = ExpensesUsers.objects.get(id=id)
        serializer = UserDataIncomeSerializer(
            data=request.data, context={'user': user})

        if serializer.is_valid():
            newIncome = serializer.save()
            return Response({'newIncome': UserDataIncomeSerializer(newIncome).data}, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors: ", serializer.errors)

        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getIncomes(request, id):
    if request.method == 'GET':
        try:
            incomes = ExpensesUserDataIncome.objects.filter(user_id=id)

            serializer = UserDataIncomeSerializer(incomes, many=True)
            return Response({'incomes': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def addExpense(request, id):
    if request.method == 'POST':
        print(request.data)
        user = ExpensesUsers.objects.get(id=id)  # Get user by the passed 'id'
        serializer = UserDataSerializer(data=request.data, context={
                                        'user': user})  # Pass user in context
        print(request.data)

        if serializer.is_valid():
            newExpense = serializer.save()  # Serializer handles instance creation
            return Response({'newExpense': UserDataSerializer(newExpense).data}, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)

        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deleteExpense(request, user_id, id):
    if request.method == 'DELETE':
        expense = ExpensesUserData.objects.filter(id=id, user_id=user_id)
        if expense.exists():
            expense.delete()
            return Response({'message': 'Expense Deleted successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'error while deleting expense'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deleteIncome(request, user_id, id):
    if request.method == 'DELETE':
        income = ExpensesUserDataIncome.objects.filter(id=id, user_id=user_id)
        if income.exists():
            income.delete()
            return Response({'message': 'Income Deleted Successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Error while deleting income'})


@api_view(['PUT'])
def editTransaction(request, user_id):
    if request.method == 'PUT':
        try:
            user = ExpensesUsers.objects.get(id=user_id)
        except ExpensesUsers.DoesNotExist:
            return Response({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)

        type = request.data['type']
        request.data.pop('type')
        updateTransaction = request.data

        if type == 'exp':
            try:
                expense = ExpensesUserData.objects.get(
                    id=updateTransaction['id'], user_id=user_id)
            except ExpensesUserData.DoesNotExist:
                return Response({"error": "expense not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = UserDataSerializer(
                expense, data=updateTransaction, context={'user': user})
            if serializer.is_valid():
                serializer.save()
                return Response({'successfully updated': serializer.data}, status=status.HTTP_200_OK)
            return Response({'error updating': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        elif type == 'inc':
            try:
                income = ExpensesUserDataIncome.objects.get(
                    id=updateTransaction['id'], user_id=user_id)
            except ExpensesUserDataIncome.DoesNotExist:
                return Response({"error": "income not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = UserDataIncomeSerializer(
                income, data=updateTransaction, context={'user': user})
            if serializer.is_valid():
                serializer.save()
                return Response({"succesfully updated": serializer.data}, status=status.HTTP_200_OK)
            return Response({'error updating': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "invalid transaction type"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def getExpenses(request, id):
    if request.method == 'GET':
        try:
            expenses = ExpensesUserData.objects.filter(user_id=id)
            serializer = UserDataSerializer(expenses, many=True)
            return Response({'expenses': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
