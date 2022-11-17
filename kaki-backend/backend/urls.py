from django.contrib import admin
from django.urls import path, include

#from kaki import views

# For routing
#from rest_framework import routers

#router = routers.DefaultRouter()
#router.register(r'tango', views.VocabItemView, 'tango')

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/", include("dj_rest_auth.urls")),  # endpoints provided by dj-rest-auth
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include('kaki.urls')),
    path('accounts/', include('allauth.urls'))
]