from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .serializers import VocabItemSerializer
from .models import VocabItem

class VocabItemView(viewsets.ModelViewSet):

    serializer_class = VocabItemSerializer
    queryset = VocabItem.objects.all()