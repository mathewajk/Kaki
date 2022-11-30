from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from uuid import uuid4

class VocabItem(models.Model):

    tango      = models.CharField(default="", max_length=50)
    yomi       = models.CharField(default="", max_length=50)

    pitch = models.CharField(default="", max_length=25)
    addl_pitch = models.CharField(blank=True, default="", max_length=25)

    pos = models.CharField(default="", max_length=50)
    addl_pos = models.CharField(blank=True, default="", max_length=50)

    definition = models.CharField(default="", max_length=1000)   
    category   = models.CharField(blank=True, default="", max_length=50)

    def __str__(self):
        return "{0} ({1} {2})".format(self.tango, self.yomi, self.pitch)


class User(models.Model):

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class UserAccountManager(BaseUserManager):
  def create_user(self, username, email, password=None):
    """
      Creates a custom user with the given fields
    """

    user = self.model(
      username = username,
      email = self.normalize_email(email),
    )

    user.set_password(password)
    user.save(using = self._db)

    return user

  
  def create_superuser(self, username, email, password):
    user = self.create_user(
      username,
      email,
      password = password
    )

    user.is_staff = True
    user.is_superuser = True
    user.save(using = self._db)

    return user


# User account for authorization 
class UserAccount(AbstractBaseUser, PermissionsMixin):
  userId    = models.CharField(max_length = 255, default = uuid4, primary_key = True, editable = False)
  username  = models.CharField(max_length = 255, unique = True, null = False, blank = False)
  email     = models.EmailField(max_length = 255, unique = True, null = False, blank = False)

  USERNAME_FIELD = "username"
  REQUIRED_FIELDS = ["email"]

  active       = models.BooleanField(default = True)
  
  is_staff     = models.BooleanField(default = False)
  is_superuser = models.BooleanField(default = False)
  
  created_on   = models.DateTimeField(auto_now_add = True, blank = True, null = True)
  updated_at   = models.DateTimeField(auto_now = True)

  objects = UserAccountManager()


class StudyItem(models.Model):

    # TODO add seen/unseen for reporting
    
    user     = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    item     = models.ForeignKey(VocabItem, on_delete=models.CASCADE)
    due      = models.CharField(max_length = 255, null=False, blank=False)
    interval = models.IntegerField(default=1, blank=False, null=False)
    easing_factor = models.FloatField(default=2.5, blank=False, null=False)

    def __str__(self):
        return "{0}, {1}, {2}".format(self.user.username, self.item.tango, self.due)