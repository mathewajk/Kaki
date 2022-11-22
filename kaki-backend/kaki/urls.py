from django.urls import path
from kaki.schema import schema
from kaki.views import PrivateGraphQLView

from .views import GoogleLoginView

from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path('graphiql/', PrivateGraphQLView.as_view(graphiql=True, schema=schema)),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=False, schema=schema))),
    path("google/", GoogleLoginView.as_view(), name = "google")
]