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


class CreateUser(graphene.Mutation):
    class Arguments:
        name = graphene.String()
    
    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    def mutate(self, info, name):
        user = User(name=name)
        user.save()
        return CreateUser(ok=True, user=user)

class CreateStudyItem(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int()
        item_id = graphene.Int()
        priority = graphene.Int()
    
    ok = graphene.Boolean()
    study_item = graphene.Field(StudyItemType)

    def mutate(self, info, user_id, item_id, priority):
        user = User.objects.get(id=user_id)
        item = VocabItem.objects.get(id=item_id)
        
        print("Create study item:")
        study_item = StudyItem(user=user, item=item, priority=priority)
        print(study_item)

        try:
            study_item.save()
        except Exception as e:
            print(e)
        print("End")
        return CreateStudyItem(ok=True, study_item=study_item)

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
    user = graphene.Field(UserType, id=graphene.Int())
    
    # Need to define matching fields for functions!
    study_items = graphene.List(StudyItemType)
    study_items_by_user = graphene.List(StudyItemType, userId=graphene.Int())

    # Function name must be of the form 'resolve_{variable}' to work!
    def resolve_words(self, info, **kwargs):
        return VocabItem.objects.all()

    def resolve_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_user(self, info, **kwargs):
        id = kwargs.get('id')
        return User.objects.filter(id=id)

    def resolve_study_items(self, info):
        return StudyItem.objects.all()

    def resolve_study_items_by_user(self, info, **kwargs):
        userId = kwargs.get('userId')
        user = User.objects.filter(id=userId)[0]
        print(StudyItem.objects.filter(user=user))
        return StudyItem.objects.filter(user=user)

class Mutation(graphene.ObjectType):
    create_word = CreateVocabItem.Field()
    create_user = CreateUser.Field()
    create_study_item = CreateStudyItem.Field()

    delete_word = DeleteVocabItem.Field()
    update_word = UpdateVocabItem.Field()
    

schema = graphene.Schema(query=Query, mutation=Mutation)