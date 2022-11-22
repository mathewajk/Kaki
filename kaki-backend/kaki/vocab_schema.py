import graphene
from graphene_django import DjangoObjectType
from kaki.models import VocabItem


class VocabType(DjangoObjectType):
    class Meta:
        model = VocabItem
        fields = ('id', 'tango', 'yomi', 'pitch', 'addl_pitch', 'pos', 'addl_pos', 'definition', 'category')

class CreateVocabItem(graphene.Mutation):

    class Arguments:
        tango      = graphene.String()
        yomi       = graphene.String()
        pitch      = graphene.String()
        addl_pitch = graphene.String()
        pos        = graphene.String()
        addl_pos   = graphene.String()
        definition = graphene.String()
        category   = graphene.String()

    ok = graphene.Boolean()
    word = graphene.Field(VocabType)

    def mutate(self, info, **kwargs):
        exists = VocabItem.objects.filter(tango=kwargs.get('tango'), pos=kwargs.get('pos'), addl_pos=kwargs.get('addl_pos'))
        if exists:
            return CreateVocabItem(ok=False, word=None)
        word = VocabItem(tango      =kwargs.get('tango'), \
                         yomi       =kwargs.get('yomi'), \
                         pitch      =kwargs.get('pitch'), \
                         addl_pitch =kwargs.get('addl_pitch'), \
                         pos        =kwargs.get('pos'), \
                         addl_pos   =kwargs.get('addl_pos'),\
                         definition =kwargs.get('definition'), \
                         category   =kwargs.get('category'))
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
        pitch      = graphene.String()
        addl_pitch = graphene.String()
        pos        = graphene.String()
        addl_pos   = graphene.String()
        definition = graphene.String()
        category   = graphene.String()

    ok = graphene.Boolean()
    word = graphene.Field(VocabType)

    def mutate(**kwargs): 
        word            = VocabItem.objects.get(id=id)
        word.tango      = kwargs.get('tango')
        word.yomi       = kwargs.get('yomi')
        word.pos        = kwargs.get('pos')
        word.addl_pos   = kwargs.get('addl_pos')
        word.pitch      = kwargs.get('pitch')
        word.addl_pitch = kwargs.get('addl_pitch')
        word.definition = kwargs.get('definition')
        word.category   = kwargs.get('category')

        word.save()
        return UpdateVocabItem(ok=True, word=word)

class UpdateVocabItemFromWord(graphene.Mutation):
    
    class Arguments:
        tango      = graphene.String()
        yomi       = graphene.String()
        pos        = graphene.String()
        pitch      = graphene.String()
        definition = graphene.String()
        category   = graphene.String()

    ok = graphene.Boolean()
    word = graphene.Field(VocabType)

    def mutate(self, info, **kwargs): 
        
        try:
            word = VocabItem.objects.get(tango=tango)
        except Exception as e:
            print(e)
            return UpdateVocabItemFromWord(ok=False, word=None)
        
        if not word:
            return UpdateVocabItemFromWord(ok=False, word=None)
        
        word.tango      = kwargs.get('tango')
        word.yomi       = kwargs.get('yomi')
        word.pos        = kwargs.get('pos')
        word.addl_pos   = kwargs.get('addl_pos')
        word.pitch      = kwargs.get('pitch')
        word.addl_pitch = kwargs.get('addl_pitch')
        word.definition = kwargs.get('definition')
        word.category   = kwargs.get('category')
        word.save()
        
        return UpdateVocabItemFromWord(ok=True, word=word)