from django.contrib import admin

# Register your models here.

from .models import VocabItem, User

class VocabItemAdmin(admin.ModelAdmin):
    list_display = ("tango", "yomi", "pitch")

class UserAdmin(admin.ModelAdmin):
    list_display = ["name"]


admin.site.register(VocabItem, VocabItemAdmin)
admin.site.register(User, UserAdmin)
