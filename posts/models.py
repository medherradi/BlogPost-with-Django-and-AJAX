from django.db import models
from django.contrib.auth.models import User
from matplotlib.pyplot import get
from profiles.models import Profile
# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=120)
    experience = models.TextField()
    liked = models.ManyToManyField(User, blank=True)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created',)

    def __str__(self):
        return str(self.title)

    @property
    def like_count(self):
        return self.liked.all().count()
        
    # reverse relationship between classes
    def get_pictures(self):
        return self.picture_set.all()


class Picture(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='photos')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.post.title}-{self.pk}'

