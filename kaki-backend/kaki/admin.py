from django.contrib import admin

# Register your models here.

from .models import VocabItem

class VocabItemAdmin(admin.ModelAdmin):

    list_display = ("tango", "yomi", "pitch")


admin.site.register(VocabItem, VocabItemAdmin)
