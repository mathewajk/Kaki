import graphene
from graphene_django import DjangoObjectType
from kaki.models import VocabItem, User, StudyItem

class VocabType(DjangoObjectType):
    class Meta:
        model = VocabItem
        fields = ('id', 'tango', 'yomi', 'pitch', 'learned')

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'name')

class StudyItemType(DjangoObjectType):
    class Meta:
        model = StudyItem
        fields = ('id', 'user', 'item', 'priority')


# class User(graphene.ObjectType):

#     name = graphene.String()

#     def resolve_user(self, info, **kwargs):
#         return self.name

class CreateUser(graphene.Mutation):
    class Arguments:
        name = graphene.String()
    
    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    def mutate(self, info, name):
        user = User(name=name)
        user.save()
        return CreateUser(ok=True, user=user)

class CreateVocabItem(graphene.Mutation):

    class Arguments:
        tango   = graphene.String()
        yomi    = graphene.String()
        pitch   = graphene.Int()
        learned = graphene.Boolean()

    ok = graphene.Boolean()
    word = graphene.Field(VocabType)

    # Should default learned to false?
    def mutate(self, info, tango, yomi, pitch, learned):
        word = VocabItem(tango=tango, yomi=yomi, pitch=pitch, learned=learned)
        word.save()
        return CreateVocabItem(ok=True, word=word)

class DeleteVocabItem(graphene.Mutation):
    class Arguments:
        id = graphene.Int()

    ok = graphene.Boolean()

    def mutate(self, info, id):
        word = VocabItem.objects.get(id=id)
        word.delete()
        return DeleteVocabItem(ok=True)

class UpdateVocabItem(graphene.Mutation):
    class Arguments:
        id = graphene.Int()
        tango   = graphene.String()
        yomi    = graphene.String()
        pitch   = graphene.Int()
        learned = graphene.Boolean()

    ok = graphene.Boolean()
    word = graphene.Field(VocabType)

    def mutate(self, info, id, tango, yomi, pitch, learned): 
        word = VocabItem.objects.get(id=id)
        word.tango = tango
        word.yomi = yomi
        word.pitch = pitch
        word.learned = learned
        word.save()
        return UpdateVocabItem(ok=True, word=word)


class Query(graphene.ObjectType):
    
    words = graphene.List(VocabType)
    users = graphene.List(UserType)

    # Function name must be of the form 'resolve_{variable}' to work!
    def resolve_words(self, info, **kwargs):
        return VocabItem.objects.all()

    def resolve_users(self, info, **kwargs):
        return User.objects.all()

class Mutation(graphene.ObjectType):
    create_word = CreateVocabItem.Field()
    create_user = CreateUser.Field()
    delete_word = DeleteVocabItem.Field()
    update_word = UpdateVocabItem.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)