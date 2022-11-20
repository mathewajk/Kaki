# Import serializers
from rest_framework import serializers

# Import VocabItem model
from .models import VocabItem, UserAccount

# Serializer class
class VocabItemSerializer(serializers.ModelSerializer):

    class Meta:

        model = VocabItem
        fields = ('id', 'tango', 'yomi', 'pitch', 'pos', 'definition')
 
class UserAccountSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserAccount
    fields = [
      "userId",
      "username",
      "email"
    ]

  def create(self, validated_data):
    user = UserAccount.objects.create_user(
      validated_data["username"],
      validated_data["email"],
      validated_data["password"]
    )

    return user