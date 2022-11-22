from django.contrib import admin
from django.contrib.sites.models import Site

# Register your models here.

from .models import VocabItem, User, StudyItem, UserAccount

class VocabItemAdmin(admin.ModelAdmin):
    list_display = ("tango", "yomi", "pos", "addl_pos", "definition", "pitch", "addl_pitch", "category")
    search_fields = ['tango','yomi', 'definition']
    list_filter = ('pos', 'pitch', 'category')

class UserAdmin(admin.ModelAdmin):
    list_display = ["name"]

class UserAccountAdmin(admin.ModelAdmin):
    list_display = ["userId", "username", "email", "active", "is_staff", "is_superuser", "created_on", "updated_at"]
    search_fields = ['username', 'email']
    list_filter = ('is_staff', 'is_superuser', 'active')

class StudyItemAdmin(admin.ModelAdmin):
    list_display = ("user", "item", "priority")

admin.site.register(VocabItem, VocabItemAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(UserAccount, UserAccountAdmin)
admin.site.register(StudyItem, StudyItemAdmin)
