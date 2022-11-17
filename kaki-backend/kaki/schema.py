import graphene
from graphene_django import DjangoObjectType
from kaki.models import VocabItem, User, UserAccount, StudyItem

class VocabType(DjangoObjectType):
    class Meta:
        model = VocabItem
        fields = ('id', 'tango', 'yomi', 'pitch', 'pos', 'definition', 'category', 'learned')

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'name')

class UserAccountType(DjangoObjectType):
    class Meta:
        model = UserAccount
        fields = ('userId', 'username', 'email', 'active')

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
        tango      = graphene.String()
        yomi       = graphene.String()
        pos        = graphene.String()
        pitch      = graphene.Int() 
        definition = graphene.String()
        category   = graphene.String()

    ok = graphene.Boolean()
    word = graphene.Field(VocabType)

    # Should default learned to false?
    def mutate(self, info, tango, yomi, pitch, pos, definition, category):
        exists = VocabItem.objects.filter(tango=tango)
        if exists:
            return CreateVocabItem(ok=False, word=None)
        word = VocabItem(tango=tango, yomi=yomi, pitch=pitch, pos=pos, definition=definition, category=category, learned=False)
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
        id         = graphene.Int()
        tango      = graphene.String()
        yomi       = graphene.String()
        pitch      = graphene.Int()
        learned    = graphene.Boolean()
        definition = graphene.String()
        category   = graphene.String()

    ok = graphene.Boolean()
    word = graphene.Field(VocabType)

    def mutate(self, info, id, tango, yomi, pitch, pos, learned, definition, category): 
        word            = VocabItem.objects.get(id=id)
        word.tango      = tango
        word.yomi       = yomi
        word.pos        = pos
        word.pitch      = pitch
        word.learned    = learned
        word.definition = definition
        word.category   = category

        word.save()
        return UpdateVocabItem(ok=True, word=word)

class UpdateVocabItemFromWord(graphene.Mutation):
    
    class Arguments:
        tango      = graphene.String()
        yomi       = graphene.String()
        pos        = graphene.String()
        pitch      = graphene.Int()
        definition = graphene.String()
        category   = graphene.String()

    ok = graphene.Boolean()
    word = graphene.Field(VocabType)

    def mutate(self, info, tango, yomi, pitch, pos, definition, category): 
        
        try:
            word = VocabItem.objects.get(tango=tango)
        except Exception as e:
            print(e)
            return UpdateVocabItemFromWord(ok=False, word=None)
        
        if not word:
            return UpdateVocabItemFromWord(ok=False, word=None)
        
        word.tango = tango
        word.yomi = yomi
        word.pitch = pitch
        word.pos = pos
        word.definition = definition
        word.learned = False
        word.category = category
        word.save()
        
        return UpdateVocabItemFromWord(ok=True, word=word)

class Query(graphene.ObjectType):
    
    words = graphene.List(VocabType)
    users = graphene.List(UserAccountType)

    user_by_identifier = graphene.Field(UserAccountType, identifier=graphene.String())
    user_by_email      = graphene.Field(UserAccountType, email=graphene.String())
    
    # Need to define matching fields for functions!
    study_items = graphene.List(StudyItemType)
    study_items_by_user = graphene.List(StudyItemType, userId=graphene.Int())
    vocab_by_level = graphene.List(VocabType, category=graphene.String())

    # Function name must be of the form 'resolve_{variable}' to work!
    def resolve_words(self, info, **kwargs):
        return VocabItem.objects.all()

    def resolve_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_user_by_identifier(self, info, **kwargs):
        identifier = kwargs.get('identifier')
        user = UserAccount.objects.filter(username=identifier)
        if not user:
            user = UserAccount.objects.filter(email=identifier)
        if not user:
            return
        return user[0]

    def resolve_user_by_email(self, info, **kwargs):
        email = kwargs.get('email')
        user = UserAccount.objects.filter(email=email)
        if not user:
            return
        return user[0]

    def resolve_study_items(self, info):
        return StudyItem.objects.all()

    def resolve_study_items_by_user(self, info, **kwargs):
        userId = kwargs.get('userId')
        user = User.objects.filter(id=userId)
        if not user:
            return
        return StudyItem.objects.filter(user=user[0])

    def resolve_vocab_by_level(self, info, **kwargs):
        category = kwargs.get('category')
        return VocabItem.objects.filter(category=category)


class Mutation(graphene.ObjectType):
    create_word = CreateVocabItem.Field()
    create_user = CreateUser.Field()
    create_study_item = CreateStudyItem.Field()
    delete_word = DeleteVocabItem.Field()
    update_word = UpdateVocabItem.Field()
    update_word_from_word = UpdateVocabItemFromWord.Field()
    

schema = graphene.Schema(query=Query, mutation=Mutation)