from django.shortcuts import render
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer, UserDataSerializer
from .models import ExpensesUsers, ExpensesUserData

# Create your views here
User = get_user_model()


class UserModelViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = ExpensesUsers.objects.all()


class UserDataModelViewSet(ModelViewSet):
    serializer_class = UserDataSerializer
    queryset = ExpensesUserData.objects.all()


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
                    'email': user.email
                }, status=status.HTTP_200_OK)

            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
#################################################################################################################################
# @api_view(['POST'])
# def login(request):
#     if request.method == 'POST':
#         serializer = UserDataSerializer(data=request.data)
#         if serializer.is_valid():
