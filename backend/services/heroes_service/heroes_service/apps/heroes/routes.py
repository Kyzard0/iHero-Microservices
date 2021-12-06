from django.urls import include, path
from rest_framework import routers
from .views import HeroAvailableView, HeroViewSet


router = routers.SimpleRouter()
router.register(r'heroes', HeroViewSet, basename='heroes')

urlpatterns = [
    path('', include(router.urls)),
    path('heroes/hero_available/',
         HeroAvailableView.as_view(), name='hero-available')
]
