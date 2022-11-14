from django.contrib import admin

# Register your models here.

from .models import VocabItem, User, StudyItem

class VocabItemAdmin(admin.ModelAdmin):
    list_display = ("tango", "yomi", "pos", "definition", "pitch")

class UserAdmin(admin.ModelAdmin):
    list_display = ["name"]

class StudyItemAdmin(admin.ModelAdmin):
    list_display = ("user", "item", "priority")


admin.site.register(VocabItem, VocabItemAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(StudyItem, StudyItemAdmin)
