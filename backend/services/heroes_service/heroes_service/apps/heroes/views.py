import random
from datetime import datetime

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Hero
from .enums import DANGER_LEVEL_TO_RANK
from .serializers import HeroSerializer
from .utils import calculate_distance, convert_location


class HeroViewSet(viewsets.ModelViewSet):
    serializer_class = HeroSerializer

    def get_queryset(self):

        queryset = Hero.objects.all()
        dangerLevel = self.request.query_params.get('dangerLevel')
        if dangerLevel is not None:
            queryset = queryset.filter(
                rank=DANGER_LEVEL_TO_RANK[dangerLevel], inBattle=False
            )
        return queryset


class HeroAvailableView(APIView):

    def get_closest_hero_available(self, threat):
        heroes_available = Hero.objects.filter(
            inBattle=False, rank=DANGER_LEVEL_TO_RANK[threat['level']])
        if heroes_available.exists():
            closest_hero = None
            shortest_distance = 999999999
            for hero in heroes_available:
                distance = calculate_distance(
                    convert_location(hero.current_location),
                    convert_location(threat['location'])
                )
                if distance < shortest_distance:
                    shortest_distance = distance
                    closest_hero = hero

            return closest_hero
        return None

    def post(self, request):
        closest_hero = self.get_closest_hero_available(request.data)
        if closest_hero is not None:
            serializer = HeroSerializer(closest_hero)
            return Response(serializer.data, status.HTTP_200_OK)
        return Response("")
