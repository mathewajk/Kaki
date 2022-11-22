from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets

from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter

from django.conf import settings

from django.contrib.auth.mixins import LoginRequiredMixin
from graphene_django.views import GraphQLView

from .serializers import VocabItemSerializer
from .models import VocabItem


class VocabItemView(viewsets.ModelViewSet):
    serializer_class = VocabItemSerializer
    queryset = VocabItem.objects.all()


class GoogleLoginView(SocialLoginView):
  authentication_classes = [] # disable authentication, make sure to override `allowed origins` in settings.py in production!
  adapter_class = GoogleOAuth2Adapter
  callback_url = "http://localhost:3000"  # frontend application url
  client_class = OAuth2Client


class PrivateGraphQLView(LoginRequiredMixin, GraphQLView):
    pass