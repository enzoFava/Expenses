from rest_framework import serializers
from .models import ExpensesUserData, ExpensesUsers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpensesUsers
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = ExpensesUsers(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            username=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()
        return user

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpensesUserData
        fields = ['id', 'user', 'title', 'amount', 'title', 'category', 'date']
