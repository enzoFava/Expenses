from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("users", views.UserModelViewSet)
router.register("expenses", views.UserDataModelViewSet)
router.register("incomes", views.UserDataIncomeModelViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("<int:id>/add/", views.addExpense, name='addExpense'),
    path("<int:id>/expenses/", views.getExpenses, name='getExpenses'),
    path("<int:id>/add/incomes/", views.addIncome, name='addIncome'),
    path("<int:id>/incomes/", views.getIncomes, name="getIncomes"),
]