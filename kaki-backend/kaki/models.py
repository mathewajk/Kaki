from django.db import models

class VocabItem(models.Model):

    tango = models.CharField(max_length=50)
    yomi  = models.CharField(max_length=50)
    pitch = models.IntegerField()
    learned = models.BooleanField(default=False)

    def __str__(self):
        return "{0} ({1})".format(self.tango, self.yomi)


class User(models.Model):

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class StudyItem(models.Model):

    user     = models.ForeignKey(User, on_delete=models.CASCADE)
    item     = models.ForeignKey(VocabItem, on_delete=models.CASCADE)
    priority = models.IntegerField()

    def __str__(self):
        return "{0}, {1}, {2}".format(self.user.name, self.item.tango, self.priority)