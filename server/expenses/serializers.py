from rest_framework import serializers
from .models import ExpensesUserData, ExpensesUsers, ExpensesUserDataIncome

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
    
class UserDataIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpensesUserDataIncome
        fields = ['id', 'user', 'title', 'amount', 'category', 'date']
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['user']
        newIncome = ExpensesUserDataIncome(
            user=user,
            title=validated_data['title'],
            amount=validated_data['amount'],
            category=validated_data['category'],
            date=validated_data['date']
        )
        newIncome.save()
        return newIncome
    
    def update(self, instance, validated_data):
        instance.user = self.context['user']
        instance.title = validated_data.get('title', instance.title)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.category = validated_data.get('category', instance.category)
        instance.date = validated_data.get('date', instance.date)
        instance.save()
        return instance


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpensesUserData
        fields = ['id', 'user', 'title', 'amount', 'category', 'date']
        read_only_fields = ['user']

    def create(self, validated_data):
        # You can assume 'user' is passed in as a context to the serializer
        user = self.context['user']
        newExpense = ExpensesUserData(
            user=user,
            title=validated_data['title'],
            amount=validated_data['amount'],
            category=validated_data['category'],
            date=validated_data['date']
        )
        newExpense.save()
        return newExpense
    
    def update(self, instance, validated_data):
        instance.user = self.context['user']
        instance.title = validated_data.get('title', instance.title)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.category = validated_data.get('category', instance.category)
        instance.date = validated_data.get('date', instance.date)
        instance.save()
        return instance
        
