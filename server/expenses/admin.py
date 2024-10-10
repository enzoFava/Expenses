from django.contrib import admin
from .models import ExpensesUserData, ExpensesUsers
# Register your models here.

admin.site.register(ExpensesUsers)
admin.site.register(ExpensesUserData)