"""
This module defines the models for the expenses app.
It contains two models: `ExpendsUsers` and `ExpendsUserData`.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

# Create your models here.


class ExpensesUsers(AbstractUser):
    """
    Model representing a user who can track expenses.
    """
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.email} - {self.id}"
    
class ExpensesUserDataIncome(models.Model):
    CATEGORY_CHOICES = [
        ('salary', 'Salary'),
        ('deposits', 'Deposits'),
        ('savings', 'Savings'),
        ('other', 'Other'),
    ]
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(ExpensesUsers, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} - {self.amount} - {self.user.id} - {self.user.email}"


class ExpensesUserData(models.Model):
    """
    Model representing expense data for a user.
    """
    CATEGORY_CHOICES = [
            ('transport', 'Transport'),
            ('health', 'Health'),
            ('food', 'Food'),
            ('clothes', 'Clothes'),
            ('pets', 'Pets'),
            ('gifts', 'Gifts'),
            ('entertainment', 'Entertainment'),
            ('house', 'House'),
    ]
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(ExpensesUsers, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        # pylint: disable=E1101
        return f"{self.title} - {self.amount} - {self.user.id} - {self.user.email}"
