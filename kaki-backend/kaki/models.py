from django.db import models

class VocabItem(models.Model):

    tango = models.CharField(max_length=50)
    yomi  = models.CharField(max_length=50)
    pitch = models.IntegerField()

    def __str__(self):
        return "{0} ({1}) | {2}".format(self.tango, self.yomi, self.pitch)