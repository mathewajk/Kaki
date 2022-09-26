# Import serializers
from rest_framework import serializers

# Import VocabItem model
from .models import VocabItem

# Serializer class
class VocabItemSerializer(serializers.ModelSerializer):

    class Meta:

        model = VocabItem
        fields = ('id', 'tango', 'yomi', 'pitch')