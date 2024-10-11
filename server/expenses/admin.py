from django.contrib import admin
from .models import ExpensesUserData, ExpensesUsers, ExpensesUserDataIncome
# Register your models here.

admin.site.register(ExpensesUsers)
admin.site.register(ExpensesUserData)
admin.site.register(ExpensesUserDataIncome)

