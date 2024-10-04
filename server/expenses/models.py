"""
This module defines the models for the expenses app.
It contains two models: `ExpendsUsers` and `ExpendsUserData`.
"""
from django.db import models
from django.utils import timezone

# Create your models here.


class ExpensesUsers(models.Model):
    """
    Model representing a user who can track expenses.
    """
    id = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return f"{self.email} - {self.id}"


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
    date = models.DateField(default=timezone.now)

    def __str__(self):
        # pylint: disable=E1101
        return f"{self.title} - {self.amount} - {self.user.id} - {self.user.email}"
