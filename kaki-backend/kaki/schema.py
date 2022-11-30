import graphene
import math
from datetime import *
from dateutil import parser
from dateutil.relativedelta import relativedelta

from graphene_django import DjangoObjectType
from kaki.models import VocabItem, User, UserAccount, StudyItem
from kaki.vocab_schema import VocabType, CreateVocabItem, UpdateVocabItem, UpdateVocabItemFromWord, DeleteVocabItem

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
        fields = ('id', 'user', 'item', 'due', 'interval', 'easing_factor')


class CreateUser(graphene.Mutation):
    class Arguments:
        name = graphene.String()
    
    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    def mutate(self, info, name):
        user = User(name=name)
        user.save()
        return CreateUser(ok=True, user=user)


class CreateStudyItems(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        tango_id = graphene.List(graphene.Int)
        due      = graphene.String()
    
    ok = graphene.Boolean()
    items = graphene.List(StudyItemType)

    def mutate(self, info, **kwargs):
        
        ids = kwargs.get('tango_id')
        items = []

        for i in range(0, len(ids)):
            id = ids[i]

            user = UserAccount.objects.get(username=kwargs.get('username'))
            item = VocabItem.objects.get(id=id)
            
            # Disallow duplicate study items
            matches = StudyItem.objects.filter(user=user, item=item)
            if matches:
                continue

            due = parser.parse(kwargs.get('due')) + relativedelta(days = + math.floor(i / 20))

            study_item = StudyItem(user=user, item=item, due=due.isoformat())
            items.append(study_item)
            study_item.save()

        return CreateStudyItems(ok=True, items=items)


class UpdateStudyItem(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        id       = graphene.Int()
        due      = graphene.String()
        # interval  = graphene.Int()
        # easing_factor = graphene.Float()
    
    ok = graphene.Boolean()
    item = graphene.Field(StudyItemType)

    def mutate(self, info, **kwargs):

        id = kwargs.get('id')
        due = kwargs.get('due')

        interval = kwargs.get('interval')
        easing_factor =  kwargs.get('easing_factor')
        

        user = UserAccount.objects.get(username=kwargs.get('username'))
        item = StudyItem.objects.get(id=id)
    
        if item:
            if due:
                item.due = due
            if interval:
                item.interval = interval
            if easing_factor:
                item.easing_factor = easing_factor
            item.save()
            return UpdateStudyItem(ok=True, item=item)
        
        return UpdateStudyItem(ok=False, item=None)

        

class Query(graphene.ObjectType):
    
    users = graphene.List(UserAccountType)

    user_by_identifier = graphene.Field(UserAccountType, identifier=graphene.String())
    user_by_email      = graphene.Field(UserAccountType, email=graphene.String())
    
    # Need to define matching fields for functions!
    study_items = graphene.List(StudyItemType, \
                                username= graphene.Argument(graphene.String(), required=False), \
                                category= graphene.Argument(graphene.String(), required=False), \
                                getDue  = graphene.Boolean())

    words = graphene.List(VocabType, \
                          category=graphene.Argument(graphene.String(), required=False))

    # Function name must be of the form 'resolve_{variable}' to work!
    def resolve_words(self, info, **kwargs):
        category = kwargs.get('category')
        if category:
            return VocabItem.objects.filter(category=category)
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

    def resolve_study_items(self, info, **kwargs):
        
        username  = kwargs.get('username')
        if not username:
            return StudyItem.objects.all()

        user = UserAccount.objects.filter(username=username)
        if not user:
            return Null
        
        userItems = StudyItem.objects.filter(user=user[0])

        category = kwargs.get('category')
        if not category:
            if(kwargs.get('getDue')):
                return list(filter(lambda x: parser.parse(x.due) < datetime.now(timezone.utc), userItems))
            else:
                return userItems

        if(kwargs.get('getDue')):
            return list(filter(lambda x: parser.parse(x.due) < datetime.now(timezone.utc), userItems.filter(item__category__contains=category)))
        else:
            return userItems.filter(item__category__contains=category)
        
class Mutation(graphene.ObjectType):
    create_word = CreateVocabItem.Field()
    create_user = CreateUser.Field()
    create_update_study_item = CreateStudyItems.Field()
    delete_word = DeleteVocabItem.Field()
    update_word = UpdateVocabItem.Field()
    update_study_item = UpdateStudyItem.Field()
    update_word_from_word = UpdateVocabItemFromWord.Field()
    

schema = graphene.Schema(query=Query, mutation=Mutation)