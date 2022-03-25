from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    #title = forms.CharField(widget=forms.Textinput(attrs={'class':'form-control'}))
    #experience = forms.CharField(widget=forms.Textarea(attrs={'class':'form-control','rows':9}))
    class Meta:
        model = Post 
        fields = ('title', 'experience',)